export const appPort = 3500;
export const allowOrigin = "http://localhost:3000";
export const wsPort = 8008;
export const wsPath = "/connectWS";
export const jsonSecretKey = "phantom_coin";
export const jsonExpiresIn = "24h";

export const configCoins = {
  btc: 2,
  eth: 2,
  dog: 2,
  ali: 1,
  lol: 3,
};

type TWallet = Record<string, number>;

export const configWallet = Object.keys(configCoins).reduce((acc, item) => {
  acc[item] = 0;
  return acc;
}, {usd: 1000} as TWallet)
