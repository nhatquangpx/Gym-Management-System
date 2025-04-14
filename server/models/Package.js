const mongoose = require("mongoose");

const PackageScchema = new mongoose.Schema({
    name: {
        type: varchar,
        required: true
    },
    description: {
        type: varchar,
        required: false
    },
    

},
    { timestamps: true }
)

module.exports = mongoose.model("Package", PackageSchema)