import jwt from "jsonwebtoken";

import { secret } from "../../config/config";

export function generateToken(id: number) {
    const payload = {id};
    return jwt.sign(payload, secret, { expiresIn: '7d' });
}