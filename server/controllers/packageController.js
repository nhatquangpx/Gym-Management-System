const Package = require("../models/Package");

// Tạo mới package
exports.createPackage = async (req, res) => {
    try {
        const { name, description, price } = req.body;
        const pkg = new Package({ name, description, price });
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
