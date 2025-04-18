const mongoose = require("mongoose");

const PackageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    price: {
        type: Number,
        required: true
    }
},
    { timestamps: true }
);

module.exports = mongoose.model("Package", PackageSchema);