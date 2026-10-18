
import express from "express";

const myrouter = express.Router();

// Initial product data
const products = [

];

let nextProductId = 4;


myrouter.get("/products", (req, res) => {
    const totalProducts = products.length;

    const currentPage = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);

    if (!Number.isInteger(currentPage) || currentPage < 1) {
        return res.status(400).send({
            status: 400,
            message: "Page must be a positive integer."
        });
    }

    if (!Number.isInteger(limit) || limit < 1) {
        return res.status(400).send({
            status: 400,
            message: "Give a valid limit."
        });
    }

    if (limit > 50) {
        return res.status(400).send({
            status: 400,
            message: "The product limit is 50."
        });
    }

    const totalPages = Math.ceil(totalProducts / limit);

    if (totalProducts > 0 && currentPage > totalPages) {
        return res.status(400).send({
            status: 400,
            message: `You have only ${totalPages} pages.`
        });
    }

    const skip = (currentPage - 1) * limit;
    const paginatedProducts = products.slice(skip, skip + limit);


    return res.status(200).send({
        status: 200,
        message: "Products fetched successfully!",
        data: paginatedProducts,
        pagination: {
            totalProducts,
            currentPage,
            limit,
            totalPages
        }
    });
});





// 2. GET products by category
// IMPORTANT: Keep this before GET /products/:id
myrouter.get("/products/filter", (req, res) => {
    const category = req.query.category;

    if (typeof category !== "string" || !category.trim()) {
        return res.status(400).send({
            status: 400,
            message: "Please provide a product category!"
        });
    }

    const filteredProducts = products.filter(
        (product) =>
            product.category.toLowerCase() === category.trim().toLowerCase()
    );

    return res.status(200).send({
        status: 200,
        message: "Products filtered successfully!",
        data: filteredProducts
    });
});


myrouter.get('/products/search', (req, res) => {
    const Searchname = req.query.name;


    if (typeof Searchname !== "string" || !Searchname.trim()) {
        return res.status(400).send({
            status: 400,
            message: "Pleae Provide a Valid Product Search Name!"
        })
    }
    if (Searchname === undefined) {
        return res.status(400).send({
            status: 400,
            message: "Product Not Found"
        })
    }

    let filteredProduct = products.filter((product) => product.name.toLowerCase().includes(Searchname.trim().toLowerCase()));

    res.status(200).send({
        status: 200,
        message: "Product Filtered",
        data: filteredProduct
    })

})

// 3. GET one product by ID
myrouter.get("/products/:id", (req, res) => {
    const productID = Number(req.params.id);

    if (!Number.isInteger(productID) || productID <= 0) {
        return res.status(400).send({
            status: 400,
            message: "Product ID must be a positive integer!"
        });
    }

    const product = products.find((item) => item.id === productID);

    if (!product) {
        return res.status(404).send({
            status: 404,
            message: "Product not found!"
        });
    }

    return res.status(200).send({
        status: 200,
        message: "Product fetched successfully!",
        data: product
    });
});


// 4. POST a new product
myrouter.post("/products", (req, res) => {
    const { name, price, category, image, stock, description } = req.body;

    if (
        name === undefined ||
        price === undefined ||
        category === undefined ||
        image === undefined ||
        stock === undefined ||
        description === undefined
    ) {
        return res.status(400).send({
            status: 400,
            message: "All product fields are required!"
        });
    }

    if (
        typeof name !== "string" ||
        typeof category !== "string" ||
        typeof image !== "string" ||
        typeof description !== "string" ||
        typeof price !== "number" ||
        typeof stock !== "number"
    ) {
        return res.status(400).send({
            status: 400,
            message: "Invalid product data types!"
        });
    }

    if (
        !name.trim() ||
        !category.trim() ||
        !image.trim() ||
        !description.trim()
    ) {
        return res.status(400).send({
            status: 400,
            message: "Text fields cannot be empty!"
        });
    }

    if (!Number.isFinite(price) || price <= 0) {
        return res.status(400).send({
            status: 400,
            message: "Price must be a number greater than 0!"
        });
    }

    if (!Number.isInteger(stock) || stock < 0) {
        return res.status(400).send({
            status: 400,
            message: "Stock must be a non-negative integer!"
        });
    }

    const newProduct = {
        id: nextProductId++,
        name,
        price,
        category,
        image,
        stock,
        description
    };

    products.push(newProduct);

    return res.status(201).send({
        status: 201,
        message: "New product added successfully!",
        data: newProduct
    });
});


// 5. PUT: replace all editable fields of a product
myrouter.put("/products/:id", (req, res) => {
    const productID = Number(req.params.id);

    if (!Number.isInteger(productID) || productID <= 0) {
        return res.status(400).send({
            status: 400,
            message: "Product ID must be a positive integer!"
        });
    }

    const productPosition = products.findIndex(
        (product) => product.id === productID
    );

    if (productPosition === -1) {
        return res.status(404).send({
            status: 404,
            message: "Product not found!"
        });
    }

    const { name, price, category, image, stock, description } = req.body;

    if (
        name === undefined ||
        price === undefined ||
        category === undefined ||
        image === undefined ||
        stock === undefined ||
        description === undefined
    ) {
        return res.status(400).send({
            status: 400,
            message: "All product fields are required for PUT!"
        });
    }

    if (
        typeof name !== "string" ||
        typeof category !== "string" ||
        typeof image !== "string" ||
        typeof description !== "string" ||
        typeof price !== "number" ||
        typeof stock !== "number"
    ) {
        return res.status(400).send({
            status: 400,
            message: "Invalid product data types!"
        });
    }

    if (
        !name.trim() ||
        !category.trim() ||
        !image.trim() ||
        !description.trim()
    ) {
        return res.status(400).send({
            status: 400,
            message: "Text fields cannot be empty!"
        });
    }

    if (!Number.isFinite(price) || price <= 0) {
        return res.status(400).send({
            status: 400,
            message: "Price must be greater than 0!"
        });
    }

    if (!Number.isInteger(stock) || stock < 0) {
        return res.status(400).send({
            status: 400,
            message: "Stock must be a non-negative integer!"
        });
    }

    const updatedProduct = {
        id: productID,
        name,
        price,
        category,
        image,
        stock,
        description
    };

    products[productPosition] = updatedProduct;

    return res.status(200).send({
        status: 200,
        message: "Product updated successfully!",
        data: updatedProduct
    });
});


// 6. PATCH: update only the supplied fields
myrouter.patch("/products/:id", (req, res) => {
    const productID = Number(req.params.id);

    if (!Number.isInteger(productID) || productID <= 0) {
        return res.status(400).send({
            status: 400,
            message: "Product ID must be a positive integer!"
        });
    }

    const product = products.find((item) => item.id === productID);

    if (!product) {
        return res.status(404).send({
            status: 404,
            message: "Product not found!"
        });
    }

    const allowedFields = [
        "name",
        "price",
        "category",
        "image",
        "stock",
        "description"
    ];

    const updates = Object.keys(req.body);

    if (updates.length === 0) {
        return res.status(400).send({
            status: 400,
            message: "Provide at least one field to update!"
        });
    }

    const invalidField = updates.find(
        (field) => !allowedFields.includes(field)
    );

    if (invalidField) {
        return res.status(400).send({
            status: 400,
            message: `Invalid field: ${invalidField}`
        });
    }

    const { name, price, category, image, stock, description } = req.body;

    if (
        (name !== undefined &&
            (typeof name !== "string" || !name.trim())) ||
        (category !== undefined &&
            (typeof category !== "string" || !category.trim())) ||
        (image !== undefined &&
            (typeof image !== "string" || !image.trim())) ||
        (description !== undefined &&
            (typeof description !== "string" || !description.trim()))
    ) {
        return res.status(400).send({
            status: 400,
            message: "Text fields must be non-empty strings!"
        });
    }

    if (
        price !== undefined &&
        (typeof price !== "number" ||
            !Number.isFinite(price) ||
            price <= 0)
    ) {
        return res.status(400).send({
            status: 400,
            message: "Price must be a number greater than 0!"
        });
    }

    if (
        stock !== undefined &&
        (typeof stock !== "number" ||
            !Number.isInteger(stock) ||
            stock < 0)
    ) {
        return res.status(400).send({
            status: 400,
            message: "Stock must be a non-negative integer!"
        });
    }

    if (name !== undefined) product.name = name;
    if (price !== undefined) product.price = price;
    if (category !== undefined) product.category = category;
    if (image !== undefined) product.image = image;
    if (stock !== undefined) product.stock = stock;
    if (description !== undefined) product.description = description;

    return res.status(200).send({
        status: 200,
        message: "Product partially updated successfully!",
        data: product
    });
});


// 7. DELETE a product
myrouter.delete("/products/:id", (req, res) => {
    const productID = Number(req.params.id);

    if (!Number.isInteger(productID) || productID <= 0) {
        return res.status(400).send({
            status: 400,
            message: "Product ID must be a positive integer!"
        });
    }

    const productPosition = products.findIndex(
        (product) => product.id === productID
    );

    if (productPosition === -1) {
        return res.status(404).send({
            status: 404,
            message: "Product not found!"
        });
    }

    const deletedProducts = products.splice(productPosition, 1);

    return res.status(200).send({
        status: 200,
        message: "Product deleted successfully!",
        data: deletedProducts[0]
    });
});



export default myrouter;
