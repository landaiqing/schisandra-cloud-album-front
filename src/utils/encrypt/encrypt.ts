/** @format */
import CryptoJS from "crypto-js";

const key = CryptoJS.enc.Hex.parse("d86d7bab3d6ac01ad9dc6a897652f2d2");
// const iv = CryptoJS.enc.Latin1.parse("d86d7bab3d6ac01ad9dc6a897652f2d2");

/**
 * 加密
 * @param data
 */
function EncryptData(data: string) {
	const src = CryptoJS.enc.Utf8.parse(data);
	const encrypted = CryptoJS.AES.encrypt(src, key, {
		mode: CryptoJS.mode.ECB,
		padding: CryptoJS.pad.Pkcs7,
	});
	return encrypted.toString();
}

/**
 * 解密
 * @param data
 */
function DecryptData(data: string) {
	const decrypt = CryptoJS.AES.decrypt(data, key, {
		mode: CryptoJS.mode.ECB,
		padding: CryptoJS.pad.Pkcs7,
	});
	return JSON.parse(CryptoJS.enc.Utf8.stringify(decrypt).toString());
}
export { EncryptData, DecryptData };
