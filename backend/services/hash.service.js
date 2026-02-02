import crypto from "crypto";

const SECRET_SALT = "VERY_SECRET_SALT";

export function generateHash(idNumber) {
    return crypto
        .createHash("sha256")
        .update(idNumber + SECRET_SALT)
        .digest("hex");
}
