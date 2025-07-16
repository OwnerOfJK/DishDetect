import { NextRequest, NextResponse } from 'next/server';

const MAX_CAPACITY = {
  large: 14,
  medium: 16,
  small: 20
};

export async function POST(request: NextRequest) {
  try {

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const { predictions }: { predictions: Array<{ class: string; confidence: number }> } = await request.json();

    const largeItems = ['l_plate', 'l_bowl'];
    const mediumItems = ['m_plate', 'm_bowl', 'm_cup', 'tea_cup'];
    const smallItems = ['s_plate', 's_bowl', 's_cup', 'glass'];

    const maxCapacity = {
      large: MAX_CAPACITY.large,
      medium: MAX_CAPACITY.medium,
      small: MAX_CAPACITY.small
    };

    let largeCounts = 0;
    let mediumCounts = 0;
    let smallCounts = 0;

    predictions.forEach(pred => {
      if (largeItems.includes(pred.class)) {
        largeCounts++;
      } else if (mediumItems.includes(pred.class)) {
        mediumCounts++;
      } else if (smallItems.includes(pred.class)) {
        smallCounts++;
      }
    });

    const largePercentage = (largeCounts / maxCapacity.large) * 100;
    const mediumPercentage = (mediumCounts / maxCapacity.medium) * 100;
    const smallPercentage = (smallCounts / maxCapacity.small) * 100;

    const overallFillPercentage = Math.round((largePercentage * 0.5 + mediumPercentage * 0.3 + smallPercentage * 0.2) * 100) / 100;

    const prompt = `
      The dishwasher has remaining capacity in three compartments:  
      - Large: Large plate and large bowl. There are ${MAX_CAPACITY.large - largeCounts} slots left
      - Medium: Medium plate, medium cup, medium bowl and a tea cup. There are ${MAX_CAPACITY.medium - mediumCounts} slots left
      - Small: Small plate, small bowl, small cup and a glass. There are ${MAX_CAPACITY.small - smallCounts} slots left

      Based on this, suggest what types of items the user could add before starting a wash.

      Be brief, helpful and respond without any formatting. No more than 50 tokens.
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
    const resultText = data.choices[0].message.content.trim();


    return NextResponse.json({ fillPercentage });
  } catch (error) {
    console.error('Error estimating fill:', error);
    return NextResponse.json(
      { error: 'Failed to estimate fill percentage' },
      { status: 500 }
    );
  }
}