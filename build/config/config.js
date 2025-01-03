"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configWallet = exports.jsonExpiresIn = exports.jsonSecretKey = exports.wsPath = exports.wsPort = exports.allowOrigin = exports.appPort = void 0;
exports.appPort = 3500;
exports.allowOrigin = "http://localhost:3000";
exports.wsPort = 8008;
exports.wsPath = "/connectWS";
exports.jsonSecretKey = "phantom_coin";
exports.jsonExpiresIn = "24h";
exports.configWallet = {
    btc: 0,
    eth: 0,
    dog: 0,
    usd: 1000,
};
