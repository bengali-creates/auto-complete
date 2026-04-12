import { NextRequest, NextResponse } from 'next/server';
import { SolveRequest, SolveResponse } from '@/types';
import { buildSystemPrompt, buildUserPrompt } from '@/lib/prompts';
import { solveProblem } from '@/lib/api-clients';

export async function POST(request: NextRequest): Promise<NextResponse<SolveResponse>> {
  try {
    const body: SolveRequest = await request.json();
    const { assignment, provider, apiKey, settings } = body;

    if (!assignment?.trim()) {
      return NextResponse.json(
        { success: false, questions: [], rawMarkdown: '', error: 'Assignment is required' },
        { status: 400 }
      );
    }

    if (!apiKey?.trim()) {
      return NextResponse.json(
        { success: false, questions: [], rawMarkdown: '', error: 'API key is required' },
        { status: 400 }
      );
    }

    const systemPrompt = buildSystemPrompt(settings);
    const userPrompt = buildUserPrompt(assignment);

    const result = await solveProblem(provider, apiKey, systemPrompt, userPrompt);

    // Generate markdown from structured data
    const rawMarkdown = generateMarkdown(result.questions, settings);

    return NextResponse.json({
      success: true,
      questions: result.questions,
      rawMarkdown,
    });
  } catch (error) {
    console.error('[API/Solve] Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, questions: [], rawMarkdown: '', error: message },
      { status: 500 }
    );
  }
}

function generateMarkdown(
  questions: SolveResponse['questions'],
  settings: SolveRequest['settings']
): string {
  const isCode = settings.assignmentType === 'Code';
  const codeLang = 'java'; // Or default to whatever the prompt asks.

  return questions
    .map((q) => {
      let md = `**Problem:** ${q.problemStatement}\n\n`;
      
      if (isCode) {
        md += `### Code\n\`\`\`${codeLang}\n${q.code}\n\`\`\`\n\n`;
      } else {
        md += `### Answer\n\n${q.code}\n\n`;
      }
      
      if (q.output && isCode) {
        md += `### Output\n\`\`\`\n${q.output}\n\`\`\`\n\n`;
      } else if (q.output && !isCode) {
        md += `### Additional Details\n\n${q.output}\n\n`;
      }
      
      if (q.explanation && settings.includeExplanation) {
        md += `### Explanation\n${q.explanation}\n\n`;
      }
      
      md += '---\n\n';
      return md;
    })
    .join('');
}
