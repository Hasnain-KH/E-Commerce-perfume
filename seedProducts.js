import Product from './models/Product.js';
import dbConnect from './config/db.js';

await dbConnect();


const product = new Product({
    name: "Royal Oud",
    category: "Men",
    price: 4500,
    stock: 10,
    description: "Woody men fragrance"
});

try {
    await product.save();
    console.log("Product Saved!");

} catch (err) {
    console.log("error", err);

}