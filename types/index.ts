export type ApiProvider = 'gemini' | 'groq' | 'together';

export type NamingConvention = 'camelCase' | 'snake_case' | 'PascalCase';

export type LayoutStyle = 'side-by-side' | 'stacked' | 'compact';

export type SpacingStyle = 'compact' | 'normal' | 'spacious';

export type AssignmentType = 'Code' | 'Essay' | 'General';

export interface ApiConfig {
  name: string;
  baseUrl: string;
  model: string;
  keyPlaceholder: string;
  helpUrl: string;
}

export interface SolverSettings {
  assignmentType: AssignmentType;
  baseVariableNames: string;
  
  // Code specific
  authorName: string;
  namingConvention: NamingConvention;
  indentSpaces: number;
  packageName: string;
  experienceLevel: string;
  includeOutput: boolean;
  includeExplanation: boolean;
  verticalCompactness: boolean;
}

export interface PDFLayoutSettings {
  layoutStyle: LayoutStyle;
  spacingStyle: SpacingStyle;
  paragraphSpacing: number;
  fontSize: number;
  lineHeight: number;
  pageMargin: number;
  pageMarginTop: number;
  pageMarginBottom: number;
  showLineNumbers: boolean;
  showPageNumbers: boolean;
  headerText: string;
  footerText: string;
  headingColor: string;
  showExplanation: boolean;
}

export interface SolvedQuestion {
  questionNumber: number;
  problemStatement: string;
  code: string;
  output?: string;
  explanation?: string;
}

export interface SolveRequest {
  assignment: string;
  provider: ApiProvider;
  apiKey: string;
  settings: SolverSettings;
}

export interface SolveResponse {
  success: boolean;
  questions: SolvedQuestion[];
  rawMarkdown: string;
  error?: string;
}
