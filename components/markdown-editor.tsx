'use client';

import { useState } from 'react';
import { SolvedQuestion } from '@/types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Code2, AlignLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MarkdownEditorProps {
  questions: SolvedQuestion[];
  onChange: (questions: SolvedQuestion[]) => void;
  rawMarkdown: string;
  onRawChange: (md: string) => void;
}

export function MarkdownEditor({ questions, onChange, rawMarkdown, onRawChange }: MarkdownEditorProps) {
  const [mode, setMode] = useState<'visual' | 'raw'>('visual');
  const [activeQuestion, setActiveQuestion] = useState(0);

  const updateQuestion = (index: number, field: keyof SolvedQuestion, value: string | number) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  /* ── RAW MODE ──────────────────────────────────────────────────── */
  if (mode === 'raw') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-violet-500 rounded-full" />
            <h3 className="text-sm font-bold text-white">Raw Markdown</h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMode('visual')}
            className="h-8 text-xs text-violet-400 border-violet-600/30 bg-violet-950/30
              hover:bg-violet-950/60 hover:border-violet-500/50 hover:text-violet-300 gap-1.5"
          >
            <AlignLeft className="w-3 h-3" /> Visual Editor
          </Button>
        </div>

        <Textarea
          value={rawMarkdown}
          onChange={(e) => onRawChange(e.target.value)}
          className="h-[500px] font-mono text-xs bg-zinc-950 border-zinc-800 text-zinc-300
            placeholder:text-zinc-700 focus-visible:ring-violet-500/30 focus-visible:border-violet-500/30
            resize-none rounded-xl"
          placeholder="Markdown content..."
        />
      </div>
    );
  }

  /* ── VISUAL MODE ───────────────────────────────────────────────── */
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-1 h-4 bg-violet-500 rounded-full" />
          <h3 className="text-sm font-bold text-white">Visual Editor</h3>
          <Badge
            variant="outline"
            className="border-zinc-700 text-zinc-500 text-[10px] font-mono px-1.5 py-0 bg-zinc-900"
          >
            {questions.length}q
          </Badge>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setMode('raw')}
          className="h-8 text-xs text-zinc-400 border-zinc-700 bg-zinc-900
            hover:bg-zinc-800 hover:border-zinc-600 hover:text-zinc-200 gap-1.5"
        >
          <Code2 className="w-3 h-3" /> Raw Markdown
        </Button>
      </div>

      {/* Question tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {questions.map((q, index) => (
          <button
            key={index}
            onClick={() => setActiveQuestion(index)}
            className={cn(
              'flex-shrink-0 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150',
              activeQuestion === index
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/50 border border-violet-500/40'
                : 'text-zinc-500 hover:text-zinc-200 border border-zinc-800 bg-zinc-900 hover:border-zinc-700 hover:bg-zinc-800',
            )}
          >
            Q{q.questionNumber}
          </button>
        ))}
      </div>

      {/* Active question card */}
      {questions[activeQuestion] && (
        <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl shadow-black/40">
          {/* Card header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-800/80 bg-zinc-900/40">
            <div className="w-7 h-7 rounded-lg bg-violet-600/20 border border-violet-600/30 flex items-center justify-center shrink-0">
              <span className="text-[11px] font-bold text-violet-400">{questions[activeQuestion].questionNumber}</span>
            </div>
            <span className="text-xs text-zinc-600 font-mono">question_{activeQuestion + 1}</span>
            <div className="ml-auto flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-zinc-700" />
              <span className="w-2 h-2 rounded-full bg-zinc-700" />
              <span className="w-2 h-2 rounded-full bg-zinc-700" />
            </div>
          </div>

          <div className="px-5 py-5 space-y-5">
            {/* Problem Statement */}
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Problem Statement
              </Label>
              <Textarea
                value={questions[activeQuestion].problemStatement}
                onChange={(e) => updateQuestion(activeQuestion, 'problemStatement', e.target.value)}
                rows={2}
                className="text-sm bg-zinc-900 border-zinc-700/60 text-zinc-200 placeholder:text-zinc-700
                  focus-visible:ring-violet-500/30 focus-visible:border-violet-500/40 resize-none rounded-xl transition-colors"
              />
            </div>

            <Separator className="bg-zinc-800/60" />

            {/* Code Editor */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  Java Code
                </Label>
                <Badge
                  variant="outline"
                  className="text-[9px] font-mono text-emerald-400 border-emerald-700/30 bg-emerald-950/30 px-1.5 py-0"
                >
                  Java
                </Badge>
              </div>

              {/* Code area with line numbers */}
              <div className="relative rounded-xl overflow-hidden border border-zinc-800 bg-[#0a0a0a] shadow-inner">
                {/* Top bar */}
                <div className="flex items-center gap-1.5 px-4 py-2 bg-zinc-900/80 border-b border-zinc-800">
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                  <span className="ml-3 text-[10px] font-mono text-zinc-600">Solution.java</span>
                </div>

                <div className="relative flex">
                  {/* Line numbers */}
                  <div className="select-none w-10 shrink-0 border-r border-zinc-800/60 bg-zinc-900/20 flex flex-col items-end pt-3 pb-3 px-2.5 pointer-events-none">
                    {Array.from({ length: Math.min(15, questions[activeQuestion].code.split('\n').length) }).map((_, i) => (
                      <span key={i} className="text-[9px] font-mono text-zinc-700 leading-5">{i + 1}</span>
                    ))}
                  </div>
                  {/* Textarea */}
                  <textarea
                    value={questions[activeQuestion].code}
                    onChange={(e) => updateQuestion(activeQuestion, 'code', e.target.value)}
                    rows={15}
                    className="flex-1 px-4 py-3 font-mono text-xs bg-transparent text-emerald-400
                      placeholder:text-zinc-700 resize-y outline-none caret-violet-400
                      focus:ring-0 border-0"
                    spellCheck={false}
                  />
                </div>
              </div>
            </div>

            <Separator className="bg-zinc-800/60" />

            {/* Output */}
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Output</Label>
              <Textarea
                value={questions[activeQuestion].output || ''}
                onChange={(e) => updateQuestion(activeQuestion, 'output', e.target.value)}
                rows={4}
                className="font-mono text-xs bg-zinc-900 border-zinc-700/60 text-zinc-400
                  placeholder:text-zinc-700 focus-visible:ring-violet-500/30 focus-visible:border-violet-500/40
                  resize-none rounded-xl transition-colors"
                placeholder="Program output..."
              />
            </div>

            {/* Explanation */}
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Explanation{' '}
                <span className="normal-case text-zinc-700 font-normal">(optional)</span>
              </Label>
              <Textarea
                value={questions[activeQuestion].explanation || ''}
                onChange={(e) => updateQuestion(activeQuestion, 'explanation', e.target.value)}
                rows={3}
                className="text-sm bg-zinc-900 border-zinc-700/60 text-zinc-300
                  placeholder:text-zinc-700 focus-visible:ring-violet-500/30 focus-visible:border-violet-500/40
                  resize-none rounded-xl transition-colors"
                placeholder="Brief explanation of the logic..."
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}