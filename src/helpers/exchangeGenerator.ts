export const exchangeGenerator = (prev: number, defaultNum = 2) => {
    if (!prev) {
      return defaultNum;
    }
    const operation = Math.random() - 0.5;
    const rate = prev + operation * 10;
    return Math.floor(rate) < 1 ? 1 : Math.floor(rate);
  };