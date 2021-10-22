const md5 = require('blueimp-md5');
export const publickey = 'b3f3ae85c881c6196c303b96f1678274';
 const privatekey = 'b82cf5047defc8b4ca20fd4bd5338432c0fe5739';
export const ts = new Date().getTime();
const stringToHash = ts + privatekey + publickey;
export const hash = md5(stringToHash);

