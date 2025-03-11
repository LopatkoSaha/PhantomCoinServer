import { ILlm } from "./mistlslLlm";

class FakeLlm implements ILlm {
  
    init () {
      console.log("LLM Fake подключена");
    };
  
    async askModel (message: string) {
      try {
        const response = message.split("").reverse().join("");
        return response;
      } catch (error) {
        throw error;
      }
    };
  }
  
  export const fakeLlm = new FakeLlm();