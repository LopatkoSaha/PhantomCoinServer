export const startPeriod = "01-01-2024";

export const coinSettigs = [
  {
    name: "btc",
    closeCourse: 30,
    volatile: 20,
    splash: 5,
    splashFactor: 10,
  },
  {
    name: "eth",
    closeCourse: 20,
    volatile: 20,
    splash: 5,
    splashFactor: 10,
  },
  {
    name: "dog",
    closeCourse: 40,
    volatile: 20,
    splash: 5,
    splashFactor: 10,
  },
  {
    name: "iks",
    closeCourse: 50,
    volatile: 20,
    splash: 5,
    splashFactor: 10,
  },
  {
    name: "lol",
    closeCourse: 5,
    volatile: 20,
    splash: 5,
    splashFactor: 10,
  },
  {
    name: "kek",
    closeCourse: 15,
    volatile: 20,
    splash: 5,
    splashFactor: 10,
  },
  {
    name: "ali",
    closeCourse: 22,
    volatile: 20,
    splash: 5,
    splashFactor: 10,
  },
] as const;

export function generateCurrentCourse(currentCourse: number, coinName: typeof coinSettigs[number]["name"]) {
  const coin = coinSettigs.find((item) => item.name === coinName)!;
  const [topLimit, bottomLimit] = calculateLimits( currentCourse, coin.volatile, coin.splash, coin.splashFactor);
  return getRandomNumberBetween(bottomLimit, topLimit);
}

export function getRandomNumberBetween(bottom: number, top: number) {
  return bottom + Math.random() * (top - bottom);
}

export function calculateLimits (currentCourse: number, volatile: number, splash: number, splashFactor: number) {
  const isSplash = Math.random() * 100 < splash;
  const currentVolatile = isSplash ? volatile * splashFactor : volatile;
  let topLimit = currentCourse * (1 + currentVolatile/100);
  let bottomLimit = currentCourse * (1 - currentVolatile/100);
  if (bottomLimit <= 0) {
    bottomLimit = 1;
    if (topLimit < 1) topLimit = 1;
  };
    
  return [topLimit, bottomLimit];
}
