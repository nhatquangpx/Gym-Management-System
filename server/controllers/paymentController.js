const Order = require("../models/Order");
const Package = require("../models/Package");
const qs = require("qs");
const crypto = require("crypto");

// Lấy config từ biến môi trường
const vnp_TmnCode = process.env.VNP_TMNCODE;
const vnp_HashSecret = process.env.VNP_HASHSECRET;
const vnp_Url = process.env.VNP_URL;
const vnp_ReturnUrl = process.env.VNP_RETURNURL;

// Tạo URL thanh toán VNPAY
exports.createVnpayPayment = async (req, res) => {
    try {
        console.log(vnp_TmnCode, vnp_HashSecret, vnp_Url, vnp_ReturnUrl)
        const { userId, packageId } = req.body;
        const gymPackage = await Package.findById(packageId);
        if (!gymPackage) return res.status(404).json({ message: "Package not found" });

        // Tạo đơn hàng
        const order = await Order.create({
            userId,
            packageId,
            amount: gymPackage.price,
            status: "pending"
        });

        const ipAddr = '127.0.0.1';
        const tmnCode = vnp_TmnCode;
        const secretKey = vnp_HashSecret;
        let vnpUrl = vnp_Url;
        const returnUrl = vnp_ReturnUrl;
        const date = new Date();
        const createDate = date.toISOString().replace(/[-T:Z.]/g, '').slice(0, 14);
        const orderId = order._id.toString();
        const txnRef = `${orderId}-${Date.now()}`;
        order.vnp_TxnRef = txnRef;
        await order.save();

        const amount = gymPackage.price * 100; // VNPAY yêu cầu đơn vị là VND * 100
        let vnp_Params = {
            'vnp_Version': '2.1.0',
            'vnp_Command': 'pay',
            'vnp_TmnCode': tmnCode,
            'vnp_Locale': 'vn',
            'vnp_CurrCode': 'VND',
            'vnp_TxnRef': txnRef,
            'vnp_OrderInfo': `Thanh toan goi tap ${gymPackage.name}`,
            'vnp_OrderType': 'other',
            'vnp_Amount': amount,
            'vnp_ReturnUrl': returnUrl,
            'vnp_IpAddr': ipAddr,
            'vnp_CreateDate': createDate
        };
        vnp_Params = sortObject(vnp_Params);
        const signData = qs.stringify(vnp_Params, { encode: false });
        const hmac = crypto.createHmac("sha512", secretKey);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
        vnp_Params['vnp_SecureHash'] = signed;
        vnpUrl += '?' + qs.stringify(vnp_Params, { encode: false });
        return res.json({ paymentUrl: vnpUrl});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Xử lý callback từ VNPAY
exports.vnpayReturn = async (req, res) => {
    let vnp_Params = req.query;
    const secureHash = vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHash'];
    vnp_Params = sortObject(vnp_Params);
    const signData = qs.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", vnp_HashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
    if (secureHash === signed) {
        // Thành công, cập nhật trạng thái đơn hàng
        const order = await Order.findOne({ vnp_TxnRef: vnp_Params['vnp_TxnRef'] });
        if (order) {
            order.status = vnp_Params['vnp_ResponseCode'] === '00' ? 'paid' : 'failed';
            order.vnp_TransactionNo = vnp_Params['vnp_TransactionNo'];
            order.vnp_ResponseCode = vnp_Params['vnp_ResponseCode'];
            order.vnp_PayDate = vnp_Params['vnp_PayDate'];
            order.vnp_OrderInfo = vnp_Params['vnp_OrderInfo'];
            order.vnp_SecureHash = secureHash;
            await order.save();
        }
        return res.json({ code: vnp_Params['vnp_ResponseCode'], message: order.status });
    } else {
        return res.status(400).json({ code: '97', message: 'Checksum failed' });
    }
};

function sortObject(obj) {
    var sorted = {};
    var str = [];
    var key;
    for (key in obj){
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        var k = str[key];
        sorted[k] = encodeURIComponent(obj[decodeURIComponent(k)]).replace(/%20/g, "+");
    }
    return sorted;
}
