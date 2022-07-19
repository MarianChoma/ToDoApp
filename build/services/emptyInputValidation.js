"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
exports.checkInput = void 0;
function checkInput(username, password) {
    if (username.trim().length === 0) {
        throw new Error("invalid_email");
    }
    if (password.trim().length === 0) {
        throw new Error("invalid_password");
    }
}
exports.checkInput = checkInput;
