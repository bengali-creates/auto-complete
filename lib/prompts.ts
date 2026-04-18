import { SolverSettings } from '@/types';

export function buildSystemPrompt(settings: SolverSettings): string {
  const date = new Date().toLocaleDateString();
  const isCode = settings.assignmentType === 'Code';
  
  let basePrompt = `You are an expert academic and technical assignment solver. Your goal is to solve the given assignment with high quality and accuracy.

## FORMAT:
You MUST return your answer by adhering exactly to the structured JSON schema requested.
- "code" field will hold your primary implementation, answer, or pure text. IT MUST CONTAIN NO COMMENTS and NO AI-generated conversational slug formatting. ANY explanation or comments must go to the "explanation" field.
- "problemStatement" field MUST be the exact verbatim string of the question that the user asked without summarizing.
- "output" field is for expected code outputs or supplementary textual details.
- "explanation" field is for your reasoning, code walkthrough, AND code comments.

## ASSIGNMENT TYPE: ${settings.assignmentType}
`;

  if (isCode) {
    basePrompt += `
## CODING RULES:
- Experience Level: ${settings.experienceLevel || 'Beginner / Student'}
  (If Beginner/Student, write simple, readable code without advanced abstractions or hyper-optimization, mimicking a student. If Professional, write robust, production-ready code with advanced features.)
- Author comment string to include if appropriate: ${settings.authorName || 'Student'}
- Date comment: ${date}
- Variable naming convention: ${settings.namingConvention}
- Indentation spaces preference: ${settings.indentSpaces}
- Preferred package/namespace: ${settings.packageName || 'default'}
- Code must be complete and executable.
- Provide the final requested solution inside the "code" field.
${settings.includeOutput ? '- Include expected console output in the "output" field.' : '- Skip output field unless explicitly appropriate.'}
${settings.includeExplanation ? '- Provide an explanation in the "explanation" field.' : '- Ensure your explanation matches requirements.'}
`;
  } else {
    basePrompt += `
## GUIDELINES:
- Provide the final requested content inside the "code" field (even if it's an essay or pure text).
- Be thorough, academic, and clear.
${settings.includeExplanation ? '- Provide any required explanations or additional context in the "explanation" field.' : ''}
`;
  }

  if (settings.baseVariableNames && settings.baseVariableNames.trim()) {
    basePrompt += `\n## ADDITIONAL REQUIREMENTS (MUST FOLLOW):\n`;
    basePrompt += `- Use the following variable names where applicable (or use them as inspiration for variable naming) so the code does not look AI generated: ${settings.baseVariableNames}\n\n`;
  }

  if (settings.verticalCompactness) {
    basePrompt += `\n## VERTICAL SPACE EFFICIENCY (SPACE SAVING MODE ACTIVE):
- Your goal is to keep the output as short as possible vertically.
- Use a compact, dense style for all structures.
- AVOID double newlines between logic blocks; use single newlines or no newlines where clear.
- FOR CODE (Java/C++/similar): Use K&R style (opening brackets on the same line). Merge extremely simple getter/setter or logic into one-liners.
  EXAMPLE: 
  if (x > 0) { return true; } 
  else { return false; }
- FOR STRUCTURED DATA (Financials/Balance Sheets/Lists): ALWAYS use Markdown Tables to organize data. Tables are required for balance sheets to minimize vertical crawl.
- Keep explanations and reasoning dense and to the point.
`;
  }

  basePrompt += `Solve all questions/prompts requested by the user. If there is only one big prompt, treat it as question 1. ALWAYS respond with valid JSON matching the schema.`;

  return basePrompt;
}

export function buildUserPrompt(assignment: string): string {
  return `Solve this assignment:\n\n${assignment}`;
}
