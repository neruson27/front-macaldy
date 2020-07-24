import store from '../store'
const googleAuth = require('google_authenticator').authenticator;
let nya=new googleAuth();

function generateSecret() {
  return nya.createSecret([16]);
}

function generatQRCode(secret) {
  return nya.getQRCodeText(store.state.user.email,secret,"orinoco.io");
}

function verifyToken(secret,token) {
 
  let discrepancy = 1
  return nya.verifyCode(secret,token,discrepancy)

}

export {generateSecret,generatQRCode};
