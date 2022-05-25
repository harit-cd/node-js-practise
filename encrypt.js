var aes256 = require('aes256');

var key = 'HJlsie132334';
var plaintext = {
    email: "mohammeds@clouddestinations.com",
    password: "Test@123"
};

var encryptedPlainText = aes256.encrypt(key, JSON.stringify(plaintext));
console.log("data", encryptedPlainText);