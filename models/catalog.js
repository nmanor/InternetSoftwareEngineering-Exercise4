const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://admin:Mongodb2021@cluster0.u7xlk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

// Connect to the MongoDB cluster
let client = new MongoClient(uri);
let db;
client.connect().then(() => {
    db = client.db("FlowerOrderingSystem").collection("catalog");
});


module.exports.getAllProducts = async function() {
    return db.find().toArray();
}

/**
 * A function that receives a product and tries to add it to the product collection
 * @param product The product to be added
 * @returns {Promise<{message: string, succeeded: boolean}>} Whether the addition was successful or not,
 * and an appropriate message
 */
module.exports.insertProduct = async function(product) {
    let succeeded = true,
        message = "Product added successfully!"
    await db.insert(product).catch(reason => {
        succeeded = false;
        message = reason;
    });
    return { message: message, succeeded: succeeded };
}

/**
 * A function that receives a product ID and tries to remove it from the product collection
 * @param productId The ID of the product to be removed
 * @returns {Promise<{message: string, succeeded: boolean}>} Whether the operation was successful or not,
 * and an appropriate message
 */
module.exports.removeProduct = async function(productId) {
    let succeeded = true,
        message = "Product removed successfully!"
    await db.remove({ _id: productId }).catch(reason => {
        succeeded = false;
        message = reason;
    });
    return { message: message, succeeded: succeeded };
}

/**
 * A function that receives a product ID and tries to remove it from the product collection
 * @param product The ID of the product to be removed
 * @returns {Promise<{message: string, succeeded: boolean}>} Whether the operation was successful or not,
 * and an appropriate message
 */
module.exports.updateProduct = async function(product) {
    let succeeded = true,
        message = "Product updated successfully!"
    await db.findOneAndUpdate({ _id: product._id }, { $set: { name: product.name, color: product.color, description: product.description, image: product.image, price: product.price } }).catch(reason => {
        succeeded = false;
        message = reason;
    });
    return { message: message, succeeded: succeeded };
}