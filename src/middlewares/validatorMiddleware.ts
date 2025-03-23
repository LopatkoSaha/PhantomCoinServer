import { Request, Response, NextFunction } from "express";

import { configCoins } from "../../config/config";

const currencyNames = Object.keys(configCoins).concat("usd");

export function validateBody (rules: Record<string, (keyof typeof conditions)[]>) {
    return function (req: Request, res: any, next: NextFunction) {
        const errors: any[] = [];
        Object.entries(rules).forEach(([filedName, validators]) => {
            const value = req.body[filedName];
            validators.map((validator) => conditions[validator](value))
                .filter((item) => item)
                .forEach((error) => {
                    errors.push({
                        filedName,
                        error,
                    });
                });
        });
        if(errors.length > 0) {
            res.status(400).send({ message: JSON.stringify(errors) });
        }else{
            next();
        }
    }

}

const conditions = {
    required: (value: any): string | null => { 
        if(value === undefined) {
            return "is required";
        }
        return null;
    },

    noNegativeNumber: (value: any): string | null => {
        if(typeof value !== "number" || value < 0) {
            return `expect ${value} mast be positive number`;
        }
        return null;
    },

    isCurrencyName: (value: any): string | null => {
        if(!currencyNames.includes(value)) {
            return `expect ${value} one of ${currencyNames.join()}`;
        }
        return null;
    },

    isExistingName: (value: Record<string, number>): string | null => {
        const allKeysValid = Object.keys(value).every(key => currencyNames.includes(key));
        const allValueValid = Object.values(value).map((item) => +item).every(val => !Number.isNaN(val));
        if(!allKeysValid) {
            return `❌ expect ${Object.keys(value)}, one of ${currencyNames.join()}`;
        }
        if(!allValueValid) {
            return `❌ expect ${Object.values(value)}, must be numbers}`;
        }
        return null;
    }
}