import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  ApiProvider,
  SolverSettings,
  PDFLayoutSettings,
  SolvedQuestion,
} from '@/types';

type Tab = 'input' | 'editor' | 'preview';

interface AppState {
  activeTab: Tab;
  provider: ApiProvider;
  apiKey: string;
  assignment: string;
  solverSettings: SolverSettings;
  pdfSettings: PDFLayoutSettings;
  questions: SolvedQuestion[];
  rawMarkdown: string;
  
  // Actions
  setActiveTab: (tab: Tab) => void;
  setProvider: (provider: ApiProvider) => void;
  setApiKey: (key: string) => void;
  setAssignment: (assignment: string) => void;
  setSolverSettings: (settings: SolverSettings) => void;
  setPdfSettings: (settings: PDFLayoutSettings) => void;
  setQuestions: (questions: SolvedQuestion[]) => void;
  setRawMarkdown: (md: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      activeTab: 'input',
      provider: 'gemini',
      apiKey: '',
      assignment: '',
      solverSettings: {
        assignmentType: 'Code',
        baseVariableNames: '',
        authorName: '',
        namingConvention: 'camelCase',
        indentSpaces: 4,
        packageName: '',
        experienceLevel: 'Beginner / Student',
        includeOutput: true,
        includeExplanation: false,
      },
      pdfSettings: {
        layoutStyle: 'stacked',
        spacingStyle: 'normal',
        paragraphSpacing: 12,
        fontSize: 10,
        lineHeight: 1.4,
        pageMargin: 35,
        showLineNumbers: true,
        showPageNumbers: true,
        headerText: '',
        footerText: '',
        headingColor: '#c75000',
        showExplanation: false,
      },
      questions: [],
      rawMarkdown: '',

      setActiveTab: (activeTab) => set({ activeTab }),
      setProvider: (provider) => set({ provider }),
      setApiKey: (apiKey) => set({ apiKey }),
      setAssignment: (assignment) => set({ assignment }),
      setSolverSettings: (solverSettings) => set({ solverSettings }),
      setPdfSettings: (pdfSettings) => set({ pdfSettings }),
      setQuestions: (questions) => set({ questions }),
      setRawMarkdown: (rawMarkdown) => set({ rawMarkdown }),
    }),
    {
      name: 'anysolver-storage',
      // We only persist specific fields to avoid persisting huge generated states forever if we don't want, 
      // but the user explicitly requested persisting the generated state and assignment so they survive refreshes.
      // So we persist everything.
    }
  )
);
