'use client';

import { useState } from 'react';
import { SolvedQuestion } from '@/types';

interface MarkdownEditorProps {
  questions: SolvedQuestion[];
  onChange: (questions: SolvedQuestion[]) => void;
  rawMarkdown: string;
  onRawChange: (md: string) => void;
}

export function MarkdownEditor({
  questions,
  onChange,
  rawMarkdown,
  onRawChange,
}: MarkdownEditorProps) {
  const [mode, setMode] = useState<'visual' | 'raw'>('visual');
  const [activeQuestion, setActiveQuestion] = useState(0);

  const updateQuestion = (index: number, field: keyof SolvedQuestion, value: string | number) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  if (mode === 'raw') {
    return (
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">Raw Markdown</h3>
          <button
            onClick={() => setMode('visual')}
            className="text-sm text-orange-600 hover:text-orange-700"
          >
            Switch to Visual Editor
          </button>
        </div>
        <textarea
          value={rawMarkdown}
          onChange={(e) => onRawChange(e.target.value)}
          className="w-full h-[500px] p-4 font-mono text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400 resize-none"
          placeholder="Markdown content..."
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mode Toggle */}
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-gray-800">Visual Editor</h3>
        <button
          onClick={() => setMode('raw')}
          className="text-sm text-orange-600 hover:text-orange-700"
        >
          Switch to Raw Markdown
        </button>
      </div>

      {/* Question Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {questions.map((q, index) => (
          <button
            key={index}
            onClick={() => setActiveQuestion(index)}
            className={`px-4 py-2 text-sm rounded-lg whitespace-nowrap transition-colors ${
              activeQuestion === index
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Q{q.questionNumber}
          </button>
        ))}
      </div>

      {/* Active Question Editor */}
      {questions[activeQuestion] && (
        <div className="space-y-4 bg-white border border-gray-200 rounded-xl p-5">


          {/* Problem Statement */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
              Problem Statement
            </label>
            <textarea
              value={questions[activeQuestion].problemStatement}
              onChange={(e) => updateQuestion(activeQuestion, 'problemStatement', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400 resize-none"
            />
          </div>

          {/* Code Editor */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
              Java Code
            </label>
            <div className="relative">
              <textarea
                value={questions[activeQuestion].code}
                onChange={(e) => updateQuestion(activeQuestion, 'code', e.target.value)}
                rows={15}
                className="w-full px-4 py-3 font-mono text-sm bg-gray-900 text-green-400 border border-gray-700 rounded-lg focus:outline-none focus:border-orange-400 resize-y"
                spellCheck={false}
              />
              <div className="absolute top-2 right-2 text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
                Java
              </div>
            </div>
          </div>

          {/* Output */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
              Output
            </label>
            <textarea
              value={questions[activeQuestion].output || ''}
              onChange={(e) => updateQuestion(activeQuestion, 'output', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 font-mono text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400 resize-none"
              placeholder="Program output..."
            />
          </div>

          {/* Explanation */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
              Explanation (Optional)
            </label>
            <textarea
              value={questions[activeQuestion].explanation || ''}
              onChange={(e) => updateQuestion(activeQuestion, 'explanation', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400 resize-none"
              placeholder="Brief explanation of the logic..."
            />
          </div>
        </div>
      )}
    </div>
  );
}
