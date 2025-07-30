const Cryptr = require("cryptr");
const config = require("config");
const key = config.get("encryption.entryKey");
const cryptr = new Cryptr(key);

module.exports = {
    /**
     *
     * @param {String} content - plain text version of the the
     *                 journal entry
     * @description    Uses the cryptr npm package to encrypt
     *                 a users journal entry with a aes-128-gsm
     *                 hashing algorithm before saving the entry in
     *                 the database
     * @return         returns a hashed string representation of
     *                 the entry
     */
    encryptEntry: function (content) {
        const encryptedContent = cryptr.encrypt(content);
        return encryptedContent;
    },

    /**
     *
     * @param {String} content - hashed string representation of
     *                 the  journal entry
     * @description    Uses the cryptr npm package to decrypt
     *                 a users journal entry before sending the
     *                 entry data back to the client
     * @return         returns the plain text version of the entry
     */
    decryptEntry: function (content) {
        const decryptedContent = cryptr.decrypt(content);
        return decryptedContent;
    },
};
