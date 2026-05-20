import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getMockQuestions } from '@/utils/mock-questions';
import type { GenerateQuizRequest, GenerateQuizResponse, QuizQuestion } from '@/types';

const generateQuizSchema = z.object({
  topic: z.string().min(2).max(100),
  category: z.enum(['coding', 'science', 'movies', 'general', 'technology', 'history', 'sports', 'custom']),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  questionCount: z.number().min(1).max(20)
});

const geminiQuestionSchema = z.object({
  question: z.string(),
  options: z.array(z.string()).length(4),
  correctIndex: z.number().min(0).max(3),
  explanation: z.string()
});

const geminiResponseSchema = z.array(geminiQuestionSchema);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = generateQuizSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', isDemo: false },
        { status: 400 }
      );
    }

    const { topic, category, difficulty, questionCount } = result.data;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not set. Falling back to mock questions.');
      return useFallback(category, questionCount, difficulty, 'API key missing');
    }

    const prompt = `Generate exactly ${questionCount} ${difficulty} difficulty multiple choice questions about "${topic}" in the category of ${category}. Return ONLY a JSON array where each object has: "question" (string), "options" (array of exactly 4 strings), "correctIndex" (number 0-3), "explanation" (string, 1-2 sentences explaining the correct answer). Ensure questions are accurate, educational, and varied. Do not repeat questions. No markdown formatting, ONLY the raw JSON array.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API Error:', errorData);
      return useFallback(category, questionCount, difficulty, 'API request failed');
    }

    const data = await response.json();
    
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.error('Invalid Gemini API response structure', data);
      return useFallback(category, questionCount, difficulty, 'Invalid API response');
    }

    const responseText = data.candidates[0].content.parts[0].text;
    
    let parsedJson;
    try {
      parsedJson = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse Gemini response as JSON:', responseText);
      return useFallback(category, questionCount, difficulty, 'Failed to parse JSON');
    }

    const validationResult = geminiResponseSchema.safeParse(parsedJson);

    if (!validationResult.success) {
      console.error('Gemini response did not match schema:', validationResult.error);
      return useFallback(category, questionCount, difficulty, 'Invalid response format');
    }

    // Add unique IDs and metadata
    const questions: QuizQuestion[] = validationResult.data.map(q => ({
      ...q,
      options: q.options as [string, string, string, string],
      id: crypto.randomUUID(),
      category,
      difficulty
    }));

    // Ensure we have the requested number of questions
    if (questions.length < questionCount) {
       console.warn(`Gemini returned only ${questions.length} questions, padding with mocks.`);
       const missingCount = questionCount - questions.length;
       const mockFill = getMockQuestions(category, missingCount, difficulty);
       questions.push(...mockFill);
    } else if (questions.length > questionCount) {
        questions.length = questionCount; // Trim excess
    }

    const successResponse: GenerateQuizResponse = {
      questions,
      success: true,
      isDemo: false
    };

    return NextResponse.json(successResponse);

  } catch (error) {
    console.error('Generate Quiz Error:', error);
    // Determine a fallback strategy
    return NextResponse.json(
        { success: false, error: 'Internal server error', isDemo: false },
        { status: 500 }
    );
  }
}

function useFallback(category: any, count: number, difficulty: any, errorReason: string) {
  console.log(`Using mock fallback. Reason: ${errorReason}`);
  const mocks = getMockQuestions(category, count, difficulty);
  const response: GenerateQuizResponse = {
    questions: mocks,
    success: true,
    isDemo: true,
    error: `Using demo questions because AI generation failed (${errorReason}).`
  };
  return NextResponse.json(response);
}
