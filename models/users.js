const { MongoClient } = require('mongodb');

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


/**
 * Function that receives a username and permission and checks whether the user has the appropriate permission
 * @param username {string} the username you need to check
 * @param permission {string} requested permission
 * @returns {boolean} true if permission is approved and false if not
 */
module.exports.checkPermission = async function checkPermission(username, permission) {
    let type = await getType(username);
    let permissions = { admin: 3, employee: 2, customer: 1 };

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
module.exports.login = async function(username, password) {
    let user = await db.collection("users").findOne({ "username": username });

    if (user.username === username && user.password === password && user.active) {
        console.log(user)
        return user;
    }
    return undefined;
}

/**
 * Function that returns the type of user
 * @param username {string} the username on which you want to receive the information
 * @returns {string|undefined} the user type, undefined if the user does not exist
 */
async function getType(username) {
    // search the user name in th DB and return his type
    let user = await db.collection("users").findOne({ "username": username });

    if (user !== null && user.username === username && user.active) {
        return user.type;
    }
    return undefined;
}
module.exports.getType = getType

/**
 * Function that receives user data and adds it to DB
 * @param user {Object} the new user details
 * @returns {{massage: string, succeeded: boolean}} textual message and a boolean variable depending on the success / failure of the insertion
 */
module.exports.addUser = async function(user) {
    let username = user.username;

    // check if the user name already exist
    if (await getType(username) !== undefined)
        return { massage: "Username already exist!", succeeded: false };

    // if username not exist add the user into the DB
    await db.collection("users").insertOne({
        "firstName": user.firstName,
        "lastName": user.lastName,
        "username": user.username,
        "password": user.password,
        "type": user.type,
        "image": user.imageURL,
        "active": true
    });

    return { massage: "User added successfully!", succeeded: true };
}


module.exports.updateUser = async function(username, newType) {
    let oldType = await getType(username);
    let succeeded = true,
        message = "User updated successfully!"
        // if the user dont in the DB return false
    if (oldType === undefined)
        return false;

    let user = await this.getUser(username);
    await db.collection("users").findOneAndUpdate({ "username": user.username }, {
        $set: {
            "firstName": user.firstName,
            "lastName": user.lastName,
            "username": user.username,
            "password": user.password,
            "type": newType,
            "image": user.image,
            "active": true
        }
    }).catch(reason => {
        succeeded = false;
        message = reason;
    });
    return { message: message, succeeded: succeeded };;
}

/**
 * @returns {Promise<Promise|void|any[]>} All users saved in the system
 */
module.exports.getAllUsers = async function() {
    return db.collection("users").find().toArray();
}

module.exports.getUser = async function(username) {
    let user = await db.collection("users").findOne({ username: username })
    return user

}

module.exports.removeUser = async function(username) {
    return await db.collection("users").deleteOne({ username: username })


}