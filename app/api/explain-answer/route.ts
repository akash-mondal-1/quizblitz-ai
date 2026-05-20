import { NextResponse } from 'next/server';
import { z } from 'zod';
import type { ExplainAnswerRequest, ExplainAnswerResponse } from '@/types';

const explainAnswerSchema = z.object({
  question: z.string(),
  correctAnswer: z.string(),
  userAnswer: z.string()
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = explainAnswerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data' },
        { status: 400 }
      );
    }

    const { question, correctAnswer, userAnswer } = result.data;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return useFallback(correctAnswer);
    }

    const prompt = `The quiz question was: "${question}". The correct answer is: "${correctAnswer}". The user answered: "${userAnswer}". Explain in exactly 1-2 concise sentences why the correct answer is right. Be educational and clear. Do not repeat the question.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!response.ok) {
      return useFallback(correctAnswer);
    }

    const data = await response.json();
    
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      return useFallback(correctAnswer);
    }

    const explanation = data.candidates[0].content.parts[0].text.trim();

    const successResponse: ExplainAnswerResponse = {
      explanation,
      success: true
    };

    return NextResponse.json(successResponse);

  } catch (error) {
    console.error('Explain Answer Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function useFallback(correctAnswer: string) {
  const response: ExplainAnswerResponse = {
    explanation: `The correct answer is "${correctAnswer}". This is a fundamental concept in this topic area.`,
    success: true
  };
  return NextResponse.json(response);
}
