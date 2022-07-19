export function checkInput(username: String, password: String) {
    if (username.trim().length === 0) {
        throw new Error("invalid_email");
    }
    if (password.trim().length === 0) {
        throw new Error("invalid_password");
    }
}
