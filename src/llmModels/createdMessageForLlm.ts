export const createdMessageForLlm = (nameCoin: string, interval: string) => {
    const text = `Напиши прогноз, как будто бы ты опытный криптовалютчик, для криптовалюты под названием ${nameCoin}, на период ${interval} дней. Твой ответ ответ должен быть в меру лаконичен и на русском языке, в долларах, ответ начинай со слов мой прогноз, учитывай что сегодня ${new Date().getDate()}.`
    return text;
}