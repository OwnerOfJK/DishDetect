import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { predictions }: { predictions: Array<{ class: string; confidence: number }> } = await request.json();
    
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const prompt = `
You are given the following prediction output listing dishes inside a dishwasher.

Detected items:
${predictions.map((pred) => `- ${pred.class} (confidence: ${(pred.confidence * 100).toFixed(1)}%)`).join('\n')}

Your task is to estimate the fill percentage of the dishwasher based on the number and type of detected dishes.

💡 The dishwasher has three separate compartments: one for large items, one for medium items, and one for small items. Each compartment has its own maximum capacity, and must be evaluated separately.

**Dish categories:**
- Large items (max 10): l_plate, l_bowl
- Medium items (max 12): m_plate, m_bowl, m_cup
- Small items (max 16): s_plate, s_bowl, s_cup, tea_cup, glass

**Instructions:**
1. From the JSON, count how many items of each category were detected.
2. Compute the fill percentage for each category as: "fill = (detected items / max capacity) * 100"
3. Compute the **overall fill percentage** by averaging the three fill percentages.
   - If a category has **zero detected items**, count it as "0%" filled.
4. Output **only the final overall fill percentage**, rounded to two decimal places. Do not return any explanation or intermediate steps.

⚠️ Do not convert items between size categories. They are physically loaded into separate compartments and must be evaluated independently.
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 50,
        temperature: 0.1
      })
    });

    if (!response.ok) {
      throw new Error('OpenAI API request failed');
    }

    const data = await response.json();
    const fillPercentage = parseInt(data.choices[0].message.content.trim());
    
    if (isNaN(fillPercentage) || fillPercentage < 0 || fillPercentage > 100) {
      return NextResponse.json(
        { error: 'Invalid fill percentage response from OpenAI' },
        { status: 500 }
      );
    }

    return NextResponse.json({ fillPercentage });
  } catch (error) {
    console.error('Error estimating fill:', error);
    return NextResponse.json(
      { error: 'Failed to estimate fill percentage' },
      { status: 500 }
    );
  }
}