import CryptoJS from "crypto-js";

const SECRET_KEY = import.meta.env.VITE_CRYPTO_SECRET || "its-resto-team-a";

export const obfuscateData = (data: string) => {

    // check if data is empty
    if (!data) {
        return "";
    };

    try {

        // encrypt data using AES
        const encrypted = CryptoJS.AES.encrypt(data, SECRET_KEY).toString();

        // encodeURIComponent to handle special characters
        return encodeURIComponent(encrypted);

    } catch (error) {
        console.error("Encryption error:", error);
        return "";
    }
};

export const deObfuscateData = (scrambled: string) : string => {

    // check if data is empty
    if (!scrambled) {
        return "";
    };

    try {
        // decodeURIComponent to handle special characters
        const decodeStr = decodeURIComponent(scrambled);

        // decrypt data using AES
        const decrypted = CryptoJS.AES.decrypt(decodeStr, SECRET_KEY).toString(CryptoJS.enc.Utf8);

        return decrypted;
    } catch (error) {
        console.error("Decryption error:", error);
        return "";
    };
    
};