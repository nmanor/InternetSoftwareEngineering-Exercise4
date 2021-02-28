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
    for (let type in users)
        for (let user in users[type]) {
            try {
                user = users[type][user];
                if (user.username === username && user.password === password && user.active) {
                    user["type"] = type.substring(0, type.length - 1);
                    return user;
                }
            } catch {
            }
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
    for (let type in users) {
        for (let user in users[type]) {
            try {
                user = users[type][user];
                if (user.username === username && user.active) {
                    return type.substring(0, type.length - 1);
                }
            } catch {
            }
        }
    }
    return undefined;
}

 /**
 * Function that receives user data and adds it to DB
 * @param user {Object} the new user details
 * @returns {{massage: string, succeeded: boolean}} textual message and a boolean variable depending on the success / failure of the insertion
 */
 module.exports.addUser = function (user) {
    let username = user.username;
    let type = user.type;

    // check if the user name already exist
    if (getType(username) !== undefined)
        return {massage: "Username already exist!", succeeded: false};

    // if username not exist add the user into the DB
    users[type].push({
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        password: user.password,
        image: user.imageURL,
        active: true
    });

    // override the DB to save the new user
    fs.writeFile('./DB/users.json', JSON.stringify(users, null, 4), 'utf8', _ => null);
    return {massage: "User added successfully!", succeeded: true};
}

module.exports.moveUser = function (username, newType) {
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