"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuthUser = checkAuthUser;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errors_1 = require("../errors/errors");
const config_1 = require("../../config/config");
async function checkAuthUser(req, res, next) {
    if (!req.headers.token) {
        next(new errors_1.TokenExpiredError("Token is Not or Expired Error"));
    }
    jsonwebtoken_1.default.verify(req.headers.token, config_1.jsonSecretKey, (err, decoded) => {
        if (err) {
            console.log("err=", err);
            next(new errors_1.JsonWebTokenError("Json Web Token Error"));
        }
        else {
            req.body.user = { id: decoded.id };
            next();
        }
    });
}
