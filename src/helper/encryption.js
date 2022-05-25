const aes256 = require('aes256');
var key = 'HJlsie132334';

function encrypt(data) {
    var encryptedData = aes256.encrypt(key, data);
    return encryptedData;
}

function decrypt(data) {
    var decryptedData = aes256.decrypt(key, data);
    return JSON.parse(decryptedData);
}

module.exports = { encrypt, decrypt }