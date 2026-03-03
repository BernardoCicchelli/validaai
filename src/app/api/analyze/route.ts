import { GoogleGenAI, Type } from '@google/genai';
import { NextResponse } from 'next/server';
import type { ValidAIResponse } from '@/types/api';

// Initialize the SDK. It automatically picks up GEMINI_API_KEY from the environment.
const ai = new GoogleGenAI({});

export async function POST(req: Request) {
    try {
        const { idea } = await req.json();

        if (!idea || typeof idea !== 'string') {
            return NextResponse.json(
                { error: 'Valid idea text is required' },
                { status: 400 }
            );
        }

        const prompt = `
      You are ValidAI, an expert strategic diagnostic engine. Your job is to evaluate product ideas before execution using structured frameworks of problem-market fit and risk analysis.
      
      You must perform a highly critical, non-optimistic analysis of the following product idea.
      Identify blind spots. Do not use generic compliments.
      
      The Idea:
      "${idea}"
      
      Provide your analysis strictly matching the JSON schema provided.
      The keys must remain in English, but the textual values (reasoning, risks, blind spots) must be in the same language as the Idea.
    `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        score: {
                            type: Type.INTEGER,
                            description: "Overall viability score from 0 to 100. Be critical.",
                        },
                        problem_clarity: {
                            type: Type.OBJECT,
                            properties: {
                                score: { type: Type.INTEGER, description: "0-100" },
                                reasoning: { type: Type.STRING, description: "Short, critical analysis of how clear the problem is." }
                            },
                            required: ["score", "reasoning"]
                        },
                        icp_definition: {
                            type: Type.OBJECT,
                            properties: {
                                score: { type: Type.INTEGER, description: "0-100" },
                                reasoning: { type: Type.STRING }
                            },
                            required: ["score", "reasoning"]
                        },
                        market_saturation: {
                            type: Type.OBJECT,
                            properties: {
                                score: { type: Type.INTEGER, description: "0-100. Lower means more saturated/worse." },
                                reasoning: { type: Type.STRING }
                            },
                            required: ["score", "reasoning"]
                        },
                        differentiation: {
                            type: Type.OBJECT,
                            properties: {
                                score: { type: Type.INTEGER, description: "0-100" },
                                reasoning: { type: Type.STRING }
                            },
                            required: ["score", "reasoning"]
                        },
                        strategic_risks: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: "List of 2 to 4 major strategic risks."
                        },
                        blind_spots: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: "List of 2 to 4 things the founder is likely ignoring or assuming."
                        },
                        confidence: {
                            type: Type.STRING,
                            enum: ["low", "medium", "high"],
                            description: "Your confidence in this evaluation."
                        }
                    },
                    required: [
                        "score",
                        "problem_clarity",
                        "icp_definition",
                        "market_saturation",
                        "differentiation",
                        "strategic_risks",
                        "blind_spots",
                        "confidence"
                    ]
                }
            }
        });

        if (!response.text) {
            throw new Error("No text returned from Gemini");
        }

        // Log token usage to the terminal
        console.log('\n--- 📊 Gemini Token Usage ---');
        console.log('Prompt Tokens:', response.usageMetadata?.promptTokenCount);
        console.log('Candidates Tokens:', response.usageMetadata?.candidatesTokenCount);
        console.log('Total Tokens:', response.usageMetadata?.totalTokenCount);
        console.log('-------------------------------\n');

        const jsonResult = JSON.parse(response.text) as ValidAIResponse;

        return NextResponse.json(jsonResult);
    } catch (error) {
        console.error('Error in ValidAI analysis:', error);
        return NextResponse.json(
            { error: 'Failed to analyze idea' },
            { status: 500 }
        );
    }
}
