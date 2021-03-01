const {MongoClient} = require('mongodb');

/**
 * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
 * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
 */
const uri = "mongodb+srv://admin:Mongodb2021@cluster0.u7xlk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
let client = new MongoClient(uri);

// Connect to the MongoDB cluster
let db;
client.connect().then(() => {
    console.log("connected to mongo :)")
    // Make the appropriate DB calls
    db = client.db("FlowerOrderingSystem");
    console.log("created db")
});

// async function connectToDB() {
//     /**
//      * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
//      * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
//      */
//     const uri = "mongodb+srv://admin:Mongodb2021@cluster0.u7xlk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
//     let client = new MongoClient(uri);
//
//     // Connect to the MongoDB cluster
//     let db;
//     await client.connect().then(() => {
//         console.log("connected to mongo :)")
//         // Make the appropriate DB calls
//         db = client.db("FlowerOrderingSystem");
//         console.log("created db")
//     });
//
//     return db;
// }


/**
 * Function that receives a username and permission and checks whether the user has the appropriate permission
 * @param username {string} the username you need to check
 * @param permission {string} requested permission
 * @returns {boolean} true if permission is approved and false if not
 */
module.exports.checkPermission = function checkPermission(username, permission) {
    let type = getType(username);
    let permissions = {admin: 3, employee: 2, customer: 1};

    // returns if the user permission is great or equal to the excepted permission
    if (type !== undefined)
        return permissions[type] >= permissions[permission];
    return false;
}

/**
 * Function that check if user exist in the DB
 * @param username {string} the username of the desired user
 * @param password {string} the password of the desired user
 * @returns {undefined|Object} returns Object with the user data if the user exist & the password matches the username,
 * else return undefined
 */
module.exports.login = function (username, password) {
    let user = db.collection("users").findOne({"username": username});

    if (user.username === username && user.password === password && user.active) {
        return user;
    }
    return undefined;
}

/**
 * Function that returns the type of user
 * @param username {string} the username on which you want to receive the information
 * @returns {string|undefined} the user type, undefined if the user does not exist
 */
module.exports.getType = function (username) {
    // search the user name in th DB and return his type
    var db = connectToDB();
    var user = db.collection("users").findOne({"username": username});

    if (user.username === username && user.active) {
        return user.type;
    }
    return undefined;
}

/**
 * Function that receives user data and adds it to DB
 * @param user {Object} the new user details
 * @returns {{massage: string, succeeded: boolean}} textual message and a boolean variable depending on the success / failure of the insertion
 */
module.exports.addUser = function (user) {
    var db = connectToDB();
    let username = user.username;

    // check if the user name already exist
    if (getType(username) !== undefined)
        return {massage: "Username already exist!", succeeded: false};

    // if username not exist add the user into the DB
    db.collection("users").insertOne({
        "firstName": user.firstName,
        "lastName": user.lastName,
        "username": user.username,
        "password": user.password,
        "type": user.type,
        "image": user.imageURL,
        "active": true
    });


    return {massage: "User added successfully!", succeeded: true};
}

module.exports.moveUser = function (username, newType) {
    let oldType = getType(username) + "s";

    // if the user dont in the DB return flase
    if (oldType === undefined)
        return false;

    var db = connectToDB();
    var user = db.collection("users").findOneAndUpdate({"username": username}, {$set: {type: newType}});
    return true;
}