import crypto from "node:crypto";
import fs from "fs";
const ENCRYPTION_SECERT_KEY = Buffer.from("12343567891234567891233456789012", 'utf8');
const IV_LENGTH = 16; //FOR AES , THIS IS ALWAYES 16

//encrypt
export const encrypt = (plaintext) => {

const iv = crypto.randomBytes(IV_LENGTH);

const cipher = crypto.createCipheriv("aes-256-cbc" , 
ENCRYPTION_SECERT_KEY,
iv
    );
    let encrypted = cipher.update(plaintext , "utf-8" ,"hex");
    encrypted += cipher.final("hex");
     
    return iv.toString("hex")+ ":" + encrypted;

};

//decrypt
export const decrypt = (encryptedData) => {
    const [ivHex, cipherText ] = encryptedData.split(":");
    const iv = Buffer.from(ivHex, "hex");

    const decipher = crypto.createDecipheriv(
        "aes-256-cbc" ,
        ENCRYPTION_SECERT_KEY,
         iv );
     let decrypted = decipher.update(cipherText , "hex","utf-8" );
    decrypted += decipher.final("utf8");
     
    return decrypted;


};

//1- create encryption
//2- update encrypt 
//3- final encryption 

// Asymmetric
if(fs.existsSync("public_key.pem") && fs.existsSync("private_key.pem")){
    console.log("Key Already Exists");

} else {
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: {type: "pkcs1" , format: "pem"},
    privateKeyEncoding:{type: "pkcs1" , format: "pem"},
});
console.log(publicKey, privateKey);

fs.writeFileSync("public_key.pem" , publicKey);
fs.writeFileSync("private_key.pem" ,  privateKey);

}
///encript
export const asymmetricEncrypt = (plaintext) => {
    const bufferedText = Buffer.from(plaintext, "utf8");

    const encryptedData = crypto.publicEncrypt({
        key:fs.readFileSync("public_key.pem","utf8"),
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING //ده عشان ميجيبليش اي ايرورو);
},
bufferedText
    );
return encryptedData.toString("hex");
};
///decript
export const asymmetricDecript = (cipherText) => {
    const bufferedCipherText = Buffer.from(cipherText, "hex");

    const decryptedData = crypto.privateDecrypt({
        key:fs.readFileSync("private_key.pem","utf8"),
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING //ده عشان ميجيبليش اي ايرورو);
},
bufferedCipherText
    );
return encryptedData.toString("utf8");
};