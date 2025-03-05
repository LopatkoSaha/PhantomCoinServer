import { secretKeyDeepSeek } from "../config/config";


import OpenAI from "openai";

const openai = new OpenAI({
        baseURL: 'https://api.deepseek.com/chat/completions',
        apiKey: secretKeyDeepSeek
});

export async function deepSeek(message: string) {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: message }],
    model: "deepseek-chat",
  });
  console.log("completion", completion);
  console.log(completion.choices[0].message.content);
  return completion.choices[0].message.content;
}







// interface DeepSeekResponse {
//   choices: Array<{
//     message: {
//       content: string;
//     };
//   }>;
// }

// export const deepSeek = async (message: string): Promise<string> => {
//   try {
//     const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${secretKeyDeepSeek}`,
//       },
//       body: JSON.stringify({
//         model: "deepseek-chat",
//         messages: [{ role: "user", content: message }],
//         stream: false,
//       }),
//     });
    
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data: DeepSeekResponse = await response.json();

//     if (!data.choices || !data.choices[0] || !data.choices[0].message) {
//       throw new Error("Invalid response structure from DeepSeek API");
//     }

//     return data.choices[0].message.content;
//   } catch (error) {
//     console.error("Error in deepSeek function:", error);
//     throw error; // или вернуть сообщение об ошибке, если это уместно
//   }
// };