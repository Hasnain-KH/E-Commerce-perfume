import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    category: {
        type: String,
        required: true,
        enum: ["Men", "Women", "Unisex"]
    },

    price: {
        type: Number,
        required: true,
        min: 1
    },

    stock: {
        type: Number,
        required: true,
        min: 0
    },

    image: {
        type: String,
        required: true,
        default: "default-perfume.jpg"
    },

    description: {
        type: String,
        required: true,
        trim: true,
    },
},
    { timestamps: true }
)

const Product = mongoose.model("Product", ProductSchema);

export default Product;