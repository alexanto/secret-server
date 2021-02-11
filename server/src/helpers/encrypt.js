const crypto = require('crypto');

const encrypt = (text, encryptKey) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(encryptKey), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
};

const decrypt = (text, iv, encryptKey) => {
    const encryptedText = Buffer.from(text, 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(encryptKey), Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

module.exports = {
    encrypt,
    decrypt,
}