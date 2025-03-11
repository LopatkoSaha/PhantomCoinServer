export interface ILlm  {
    init: () => void,
    askModel: (ask: string) => Promise<string>, 
  };
  
  class MistralLlm implements ILlm {
  
    init () {
      console.log("LLM Mistral подключена");
    };
  
    async askModel (message: string) {
      try {
        const response = await fetch('http://localhost:11434/api/generate', {
          method: 'POST',
          body: JSON.stringify({
            model: 'mistral',
            prompt: message,
            stream: false
          }),
          headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        return data;
      } catch (error) {
        throw error;
      }
    };
  }
  
  export const mistralLlm = new MistralLlm();
  