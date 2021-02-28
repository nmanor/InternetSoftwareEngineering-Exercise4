const { MongoClient } = require('mongodb');

function connectToDB() {
    /**
     * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
     * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
     */
    const uri = "mongodb+srv://admin:Mongodb2021@cluster0.u7xlk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    client = new MongoClient(uri);

    // Connect to the MongoDB cluster
    client.connect();
    console.log("connected to mongo :)")
        // Make the appropriate DB calls
    const db = client.db("FlowerOrderingSystem");
    console.log("created db")

    return db;


}



/**
 * Function that receives a username and permission and checks whether the user has the appropriate permission
 * @param username {string} the username you need to check
 * @param permission {string} requested permission
 * @returns {boolean} true if permission is approved and false if not
 */
module.exports.checkPermission = function checkPermission(username, permission) {
    let type = getType(username);
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
module.exports.login = function(username, password) {
    db = connectToDB()
    cruser = db.collection("users").find({ "username": username })
    var user;

    function iterateFunc(doc) {
        user = doc;
    }

    function errorFunc(error) {
        console.log(error);
    }

    cursor.forEach(iterateFunc, errorFunc);

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
module.exports.getType = function(username) {
    // search the user name in th DB and return his type
    db = connectToDB()
    cruser = db.collection("users").find({ "username": username })
    var user;

    function iterateFunc(doc) {
        user = doc;
    }

    function errorFunc(error) {
        console.log(error);
    }

    cursor.forEach(iterateFunc, errorFunc);
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
module.exports.addUser = function(user) {
    connectToDB()
    let username = user.username;

    // check if the user name already exist
    if (getType(username) !== undefined)
        return { massage: "Username already exist!", succeeded: false };

    // if username not exist add the user into the DB
    DB.collection("users").insertOne({
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

module.exports.moveUser = function(username, newType) {
    let oldType = getType(username) + "s";

    // if the user dont in the DB return flase
    if (oldType === undefined)
        return false;

    // get the index of the user in his list
    let index = users[oldType].findIndex(((value) => value.username === username));

    // check if the user is already in the newType list and mark as not active
    let found = false;
    for (let i in users[newType])
        if (users[newType][i].username === username) {
            users[newType][i].active = true;
            found = true;
            break;
        }

        // if not found in newType, perform deep copy into the new type list
    if (!found)
        users[newType].push(JSON.parse(JSON.stringify(users[oldType][index])));

    // update the user in the old type
    users[oldType][index].active = false;

    // override the DB to save the changes
    fs.writeFile('./DB/users.json', JSON.stringify(users, null, 4), 'utf8', _ => null);
    return true;
}



async function main() {
    /**
     * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
     * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
     */
    const uri = "mongodb+srv://admin:Mongodb2021@cluster0.u7xlk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    const client = new MongoClient(uri);
    try {
        // Connect to the MongoDB cluster
        await client.connect();
        console.log("connected to mongo :)")
            // Make the appropriate DB calls
        const db = await client.db("FlowerOrderingSystem");
        console.log("created db")

        db.collection("users").insertOne({
            firstName: "michael",
            lastName: "goldmeier",
            username: "mgoldmeier",
            password: "123",
            image: "",
            "type": "admin",
            active: true
        });
        console.log("added user")
        await listDatabases(client);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}
main().catch(console.error);