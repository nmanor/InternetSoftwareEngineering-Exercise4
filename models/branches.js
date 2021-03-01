const {MongoClient} = require('mongodb');
const uri = "mongodb+srv://admin:Mongodb2021@cluster0.u7xlk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

// Connect to the MongoDB cluster
let client = new MongoClient(uri);
let db;
client.connect().then(() => {
    db = client.db("FlowerOrderingSystem");
});


module.exports.getAllBranches = async function () {
    return db.collection("branches").find().toArray();
}