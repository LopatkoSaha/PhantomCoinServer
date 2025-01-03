"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramError = exports.BestCoursesError = exports.QuantityUsersError = exports.WhoAmIError = exports.StatisticsCursError = exports.DataPortfolioError = exports.ActualCoinsError = exports.BuyAllInError = exports.BuyCurrencyError = exports.ValidationError = exports.LoginError = exports.RegistrationError = exports.JsonWebTokenError = exports.TokenExpiredError = void 0;
/* tslint:disable:max-classes-per-file */
class TokenExpiredError extends Error {
    constructor() {
        super(...arguments);
        this.errName = "TokenExpiredError";
    }
}
exports.TokenExpiredError = TokenExpiredError;
class JsonWebTokenError extends Error {
    constructor() {
        super(...arguments);
        this.errName = "JsonWebTokenError";
    }
}
exports.JsonWebTokenError = JsonWebTokenError;
class RegistrationError extends Error {
    constructor() {
        super(...arguments);
        this.errName = "RegistrationError";
    }
}
exports.RegistrationError = RegistrationError;
class LoginError extends Error {
    constructor() {
        super(...arguments);
        this.errName = "LoginError";
    }
}
exports.LoginError = LoginError;
class ValidationError extends Error {
    constructor() {
        super(...arguments);
        this.errName = "ValidationError";
    }
}
exports.ValidationError = ValidationError;
class BuyCurrencyError extends Error {
    constructor() {
        super(...arguments);
        this.errName = "BuyCurrencyError";
    }
}
exports.BuyCurrencyError = BuyCurrencyError;
class BuyAllInError extends Error {
    constructor() {
        super(...arguments);
        this.errName = "BuyAllInError";
    }
}
exports.BuyAllInError = BuyAllInError;
class ActualCoinsError extends Error {
    constructor() {
        super(...arguments);
        this.errName = "ActualCoinsError";
    }
}
exports.ActualCoinsError = ActualCoinsError;
class DataPortfolioError extends Error {
    constructor() {
        super(...arguments);
        this.errName = "DataPortfolioError";
    }
}
exports.DataPortfolioError = DataPortfolioError;
class StatisticsCursError extends Error {
    constructor() {
        super(...arguments);
        this.errName = "StatisticsCursError";
    }
}
exports.StatisticsCursError = StatisticsCursError;
class WhoAmIError extends Error {
    constructor() {
        super(...arguments);
        this.errName = "WhoAmIError";
    }
}
exports.WhoAmIError = WhoAmIError;
class QuantityUsersError extends Error {
    constructor() {
        super(...arguments);
        this.errName = "QuantityUsersError";
    }
}
exports.QuantityUsersError = QuantityUsersError;
class BestCoursesError extends Error {
    constructor() {
        super(...arguments);
        this.errName = "BestCoursesError";
    }
}
exports.BestCoursesError = BestCoursesError;
class TelegramError extends Error {
    constructor() {
        super(...arguments);
        this.errName = "TelegramError";
    }
}
exports.TelegramError = TelegramError;
