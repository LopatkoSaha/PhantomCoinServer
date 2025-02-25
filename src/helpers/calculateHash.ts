import crypto from 'crypto';

export function calculateHash(
    wallet_id: number,
    currency_sell: string,
    currency_buy: string,
    value_sell: number,
    value_buy: number,
    prevHash: string | null,
): string {
    const value_sell_fix = typeof value_sell === "string" ? parseFloat(value_sell).toFixed(2) : value_sell.toFixed(2);
    const value_buy_fix = typeof value_buy === "string" ? parseFloat(value_buy).toFixed(2) : value_buy.toFixed(2);
    return crypto.createHash('sha256')
        .update(`
            ${wallet_id}${currency_sell}${currency_buy}${value_sell_fix}${value_buy_fix}${prevHash || ""}`)
        .digest('hex');
}
