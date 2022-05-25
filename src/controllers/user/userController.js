const responseBuilder = require("../../helper/responseBuilder");
var path = require("path");
var jsonPath = path.join(__dirname, "..", "..", "docs", "users.json");
const jsonFile = require('../../helper/jsonFile');
const encryption = require('../../helper/encryption');
const bcrypt = require("bcryptjs");
const emailTransport = require("../../helper/email");


function signUp(request, response) {
    let signupType = request.query.key;
    let users = jsonFile.getJsonFile(jsonPath);
    let newUser = request.body;
    if (signupType === "emp") {
        return updateUser(request, response);
    } else {
        let userExists = false;
        for (const user of users) {
            if (user.email === newUser.email) {
                userExists = true;
                break;
            }
        }
        if (userExists) {
            response.send(responseBuilder.buildFailureResponse("User with email already exists!"));
        } else {
            let id = users.length + 1;
            let salt = bcrypt.genSaltSync(10);
            let hash = bcrypt.hashSync(newUser.password, salt);
            Object.assign(newUser, { id: id, password: hash, verificationToken: null, role: "cus" });
            users.push(newUser);
            jsonFile.writeJsonFile(jsonPath, users);
            return response.send(
                responseBuilder.buildSucessResponse({ user: "User registered,please login !" })
            );
        }

    }
}


function verifySignupToken(request, response) {
    if (request.query.key === "cus") {
        next();
    } else {
        let verificationToken = request.query.token;
        if (!verificationToken) {
            response.send(responseBuilder.buildFailureResponse("Verification token missing!"));
        } else {
            verificationToken = encodeURIComponent(verificationToken);
            let users = jsonFile.getJsonFile(jsonPath);
            let userIndex;
            try {
                let data = encryption.decrypt(decodeURIComponent(verificationToken));
                let loggedInUser = users.find((user) => {
                    if (data.id === user.id) {
                        return true;
                    }
                    return false;
                });
                if (loggedInUser) {
                    if (loggedInUser.verificationToken === verificationToken) {
                        delete loggedInUser.verificationToken;
                        delete loggedInUser.link;
                        return response.send(
                            responseBuilder.buildSucessResponse(loggedInUser)
                        );
                    } else {
                        response.send(responseBuilder.buildFailureResponse("Invalid registration link/user already registered !"));
                    }
                } else {
                    response.send(responseBuilder.buildFailureResponse("Invalid registration link!"));
                }
            } catch (err) {
                response.send(responseBuilder.buildFailureResponse("Broken registration link!"));
            }
        }
    }
}

function createUser(request, response) {
    let users = jsonFile.getJsonFile(jsonPath);
    let id = users.length + 1;
    let newUser = request.body;
    let userExists = false;
    for (const user of users) {
        if (user.email === newUser.email) {
            userExists = true;
            break;
        }
    }
    if (userExists) {
        response.send(responseBuilder.buildFailureResponse("User with email already exists!"));
    } else {
        let verificationToken = encodeURIComponent(encryption.encrypt(JSON.stringify({ id: id, role: newUser.role })));
        Object.assign(newUser, { id: id, shopId: newUser.shopId, verificationToken: verificationToken, role: "shopEmp", link: `http://localhost:3000/signupVerify?token=${verificationToken}` });
        users.push(newUser);
        jsonFile.writeJsonFile(jsonPath, users);
        emailTransport
            .sendMail({
                from: `Account confirmation`,
                to: newUser.email,
                subject: "Please complete signup process for your account",
                html: `<h1>Complete signup process</h1>
      <h2>Hello  </h2>
      <p>Please confirm your complete your signup process by clicking on the following link</p>
      <a href=http://localhost:3000/signupVerify?token=${verificationToken}> Click here</a>
      </div>`,
            })
            .catch((err) => console.log(err));
        return response.send(
            responseBuilder.buildSucessResponse({ user: "User created !" })
        );
    }
}


function login(request, response) {
    let users = jsonFile.getJsonFile(jsonPath);
    let loginDetails = request.body;
    let loggedInUser = users.find((user) => {
        if ((loginDetails.email && user.email === loginDetails.email) || (loginDetails.phoneNumber && user.phoneNumber === loginDetails.phoneNumber)) {
            return true;
        }
        return false;
    });
    if (loggedInUser) {
        if (bcrypt.compareSync(loginDetails.password, loggedInUser.password)) {
            delete loggedInUser.password;
            delete loggedInUser.verificationToken;
            delete loggedInUser.link;
            delete loggedInUser.hobby;
            loggedInUser.authToken = encryption.encrypt(JSON.stringify({ user: loggedInUser, exp: Date.now() + (86400 * 1000) }));
            return response.send(
                responseBuilder.buildSucessResponse({ user: loggedInUser })
            );
        } else {
            response.send(responseBuilder.buildFailureResponse("Incorrect password"));
        }
    } else {
        response.send(responseBuilder.buildFailureResponse("User with email or  phone number doesnt exist!"));
    }
}

function updateUser(request, response) {
    let users = jsonFile.getJsonFile(jsonPath);
    let updateUser = request.body;
    users.forEach((user, index) => {
        if (user.id === updateUser.id) {
            let salt = bcrypt.genSaltSync(10);
            let hash = bcrypt.hashSync(updateUser.password, salt);
            updateUser.password = hash;
            users[index] = updateUser;
        }
    });
    jsonFile.writeJsonFile(jsonPath, users);
    delete updateUser.password;
    return response.send(
        responseBuilder.buildSucessResponse({ user: updateUser })
    );
}

function verifyEmail(request, response) {
    let users = jsonFile.getJsonFile(jsonPath);
    let email = request.query.email;
    let userIndex;
    let loggedInUser = users.find((user, index) => {
        if (user.email === email) {
            userIndex = index;
            return true;
        }
        return false;
    });
    if (loggedInUser) {
        if (loggedInUser.verifiedEmail) {
            response.send(responseBuilder.buildFailureResponse("Email already verified please login!"));
        } else if (loggedInUser.verificationToken === request.query.token) {
            users[userIndex].verifiedEmail = true;
            jsonFile.writeJsonFile(jsonPath, users);
            return response.send(
                responseBuilder.buildSucessResponse("Email verified sucessfully please login!")
            );
        } else {
            response.send(responseBuilder.buildFailureResponse("Invalid verification token!"));
        }
    } else {
        response.send(responseBuilder.buildFailureResponse("User with email or  phone number doesnt exist!"));
    }
}


function assignRole(request, response) {
    let body = request.body;
    let users = jsonFile.getJsonFile(jsonPath);
    for (const user of users) {
        if (user.id === body.id) {
            user.role = body.role;
            break;
        }
    }
    jsonFile.writeJsonFile(jsonPath, users);
    return response.send(
        responseBuilder.buildSucessResponse("role sucessfully updated!")
    );
}


function getActiveUsers(request, response) {
    let users = jsonFile.getJsonFile(jsonPath);
    let filteredUsers = users.filter((user) => {
        if (user.active) {
            return true;
        }
        return false;
    });
    return response.send(
        responseBuilder.buildSucessResponse({ users: filteredUsers })
    );
}

function getVerfiedUsers(request, response) {
    let users = jsonFile.getJsonFile(jsonPath);
    let filteredUsers = users.filter((user) => {
        if (user.verifiedEmail) {
            return true;
        }
        return false;
    });
    return response.send(
        responseBuilder.buildSucessResponse({ users: filteredUsers })
    );
}

function createAdmin(request, response) {
    let users = jsonFile.getJsonFile(jsonPath);
    let id = users.length + 1;
    let newUser = request.body;
    let userExists = false;
    for (const user of users) {
        if (user.email === newUser.email) {
            userExists = true;
            break;
        }
    }
    if (userExists) {
        response.send(responseBuilder.buildFailureResponse("User with email already exists!"));
    } else {
        let verificationToken = encodeURIComponent(encryption.encrypt(JSON.stringify({ id: id, role: newUser.role })));
        Object.assign(newUser, { id: id, verificationToken: verificationToken, role: newUser.role, link: `http://localhost:3000/signupVerify?token=${verificationToken}` });
        users.push(newUser);
        jsonFile.writeJsonFile(jsonPath, users);
        emailTransport
            .sendMail({
                from: `Account confirmation`,
                to: newUser.email,
                subject: "Please complete signup process for your account",
                html: `<h1>Complete signup process</h1>
  <h2>Hello  </h2>
  <p>Please confirm your complete your signup process by clicking on the following link</p>
  <a href=http://localhost:3000/signupVerify?token=${verificationToken}> Click here</a>
  </div>`,
            })
            .catch((err) => console.log(err));
        return response.send(
            responseBuilder.buildSucessResponse({ user: "User created !" })
        );
    }
}


module.exports = { signUp, login, getActiveUsers, getVerfiedUsers, assignRole, updateUser, verifyEmail, createUser, verifySignupToken, createAdmin };