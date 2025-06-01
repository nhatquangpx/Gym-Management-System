const Package = require("../models/Package");

// Tạo mới package
exports.createPackage = async (req, res) => {
    try {
        const { name, description, price, period, type, typePackage, features, duration, status } = req.body;
        const pkg = new Package({ 
            name, 
            description, 
            price, 
            period: period || "/tháng", 
            type: type || "Tự tập", 
            typePackage: typePackage || "gym",
            features: features || [],
            duration: duration || 30
        });
        await pkg.save();
        res.status(201).json(pkg);
    } catch (err) {
        res.status(500).json({ message: "Error creating package", error: err.message });
    }
};

// Lấy danh sách package
exports.getAllPackages = async (req, res) => {
    try {
        const packages = await Package.find();
        res.json(packages);
    } catch (err) {
        res.status(500).json({ message: "Error fetching packages", error: err.message });
    }
};

// Lấy chi tiết package
exports.getPackageById = async (req, res) => {
    try {
        const pkg = await Package.findById(req.params.id);
        if (!pkg) return res.status(404).json({ message: "Package not found" });
        res.json(pkg);
    } catch (err) {
        res.status(500).json({ message: "Error fetching package", error: err.message });
    }
};

// Cập nhật package
exports.updatePackage = async (req, res) => {
    try {
        const { name, description, price, period, type, typePackage, features, duration, status } = req.body;
        const updateData = {};
        
        // Chỉ cập nhật các trường được cung cấp
        if (name !== undefined) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (price !== undefined) updateData.price = price;
        if (period !== undefined) updateData.period = period;
        if (type !== undefined) updateData.type = type;
        if (typePackage !== undefined) updateData.typePackage = typePackage;
        if (features !== undefined) updateData.features = features;
        if (duration !== undefined) updateData.duration = duration;
        
        const updatedPackage = await Package.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );
        
        if (!updatedPackage) {
            return res.status(404).json({ message: "Package not found" });
        }
        
        res.json(updatedPackage);
    } catch (err) {
        res.status(500).json({ message: "Error updating package", error: err.message });
    }
};

// Xóa package
exports.deletePackage = async (req, res) => {
    try {
        const deletedPackage = await Package.findByIdAndDelete(req.params.id);
        
        if (!deletedPackage) {
            return res.status(404).json({ message: "Package not found" });
        }
        
        res.json({ message: "Package deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting package", error: err.message });
    }
};

// Lấy danh sách package theo loại (yoga/gym)
exports.getPackagesByType = async (req, res) => {
    try {
        const { type } = req.params;
        
        // Kiểm tra type có hợp lệ không
        if (type !== 'yoga' && type !== 'gym') {
            return res.status(400).json({ message: "Invalid package type, only 'yoga' or 'gym' are allowed" });
        }
        
        const packages = await Package.find({ typePackage: type });
        res.json(packages);
    } catch (err) {
        res.status(500).json({ message: "Error fetching packages by type", error: err.message });
    }
};
