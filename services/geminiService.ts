import { GoogleGenAI, Type } from "@google/genai";
import { Question, Subject, Proficiency, SimulationMode } from "../types";

// Initialize Gemini Client
// Note: In a production environment, these calls should be proxied through a backend to protect the API Key.
// For this V1 MVP client-side demo, we use the env var directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = "gemini-2.5-flash";

export const generateQuestions = async (
  subject: Subject,
  count: number,
  proficiency: Proficiency,
  mode: SimulationMode = SimulationMode.STANDARD
): Promise<Question[]> => {
  
  // Adjust prompt difficulty based on user weakness/strength
  let focusInstruction = "";
  if (proficiency === Proficiency.LOW) {
    focusInstruction = "Foque em conceitos fundamentais e questões de nível fácil a médio para construir base.";
  } else if (proficiency === Proficiency.HIGH) {
    focusInstruction = "Foque em questões de nível difícil e desafiador, exigindo raciocínio complexo.";
  } else {
    focusInstruction = "Misture questões de nível médio e difícil.";
  }

  // Adjust explanation detail based on mode
  let explanationInstruction = "Uma explicação didática e sucinta da solução.";
  if (mode === SimulationMode.PRACTICE) {
    explanationInstruction = `
      Uma explicação EXTREMAMENTE DETALHADA e EDUCATIVA.
      A explicação DEVE conter:
      1. O conceito chave da Matriz de Referência do ENEM abordado.
      2. A resolução passo a passo da alternativa correta.
      3. Uma análise de POR QUE cada alternativa incorreta está errada (ex: 'A alternativa A está incorreta porque...').
      4. Dicas de estudo relacionadas ao tema.
    `;
  }

  const prompt = `
    Atue como um especialista no ENEM (Exame Nacional do Ensino Médio) do Brasil.
    
    Gere ${count} questões inéditas mas baseadas no estilo oficial do ENEM sobre a área: ${subject}.
    ${focusInstruction}
    
    As questões devem ter:
    1. Um enunciado contextualizado (estilo ENEM).
    2. 5 alternativas.
    3. ${explanationInstruction}
    
    Retorne APENAS um JSON válido.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              topic: { type: Type.STRING, description: "O tópico específico da matéria (ex: Geometria Plana)" },
              statement: { type: Type.STRING, description: "O texto da questão" },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "Array com exatamente 5 alternativas de texto"
              },
              correctIndex: { type: Type.INTEGER, description: "O índice (0-4) da resposta correta" },
              explanation: { type: Type.STRING, description: "Explicação detalhada da solução (Markdown permitido)" }
            },
            required: ["topic", "statement", "options", "correctIndex", "explanation"]
          }
        }
      }
    });

    const rawText = response.text;
    if (!rawText) throw new Error("No content generated");

    const data = JSON.parse(rawText);
    
    // Map to our Question interface and add IDs
    return data.map((q: any, index: number) => ({
      id: `gen-${Date.now()}-${index}`,
      subject: subject,
      topic: q.topic,
      statement: q.statement,
      options: q.options,
      correctIndex: q.correctIndex,
      explanation: q.explanation
    }));

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Falha ao gerar o simulado. Tente novamente.");
  }
};