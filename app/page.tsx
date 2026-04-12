'use client';

import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { API_CONFIGS } from '@/lib/api-config';
import { MarkdownEditor } from '@/components/markdown-editor';
import { LayoutSettingsPanel } from '@/components/layout-settings-panel';
import {
  ApiProvider,
  SolverSettings,
  PDFLayoutSettings,
  SolvedQuestion,
  SolveRequest,
  SolveResponse,
  AssignmentType,
} from '@/types';
import { useAppStore } from '@/lib/store';

// Dynamic import for PDF (needs client-only)
const PDFPreview = dynamic(
  () => import('@/components/pdf-preview').then((mod) => mod.PDFPreview),
  { ssr: false, loading: () => <div className="h-96 bg-gray-100 rounded-lg animate-pulse" /> }
);

type Tab = 'input' | 'editor' | 'preview';



export default function HomePage() {
  const {
    activeTab, setActiveTab,
    provider, setProvider,
    apiKey, setApiKey,
    assignment, setAssignment,
    solverSettings, setSolverSettings,
    pdfSettings, setPdfSettings,
    questions, setQuestions,
    rawMarkdown, setRawMarkdown
  } = useAppStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file upload
  const handleFileDrop = (e: React.DragEvent | React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = 'dataTransfer' in e ? e.dataTransfer?.files[0] : e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setAssignment(event.target?.result as string);
      reader.readAsText(file);
    }
  };

  // Solve assignment
  const handleSolve = async () => {
    if (!apiKey.trim()) {
      setError('Please enter your API key');
      return;
    }
    if (!assignment.trim()) {
      setError('Please enter or upload an assignment');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const request: SolveRequest = {
        assignment,
        provider,
        apiKey,
        settings: solverSettings,
      };

      const res = await fetch('/api/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      const data: SolveResponse = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to solve assignment');
      }

      setQuestions(data.questions);
      setRawMarkdown(data.rawMarkdown);
      setActiveTab('editor');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const hasResults = questions.length > 0;

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-500 font-medium">Loading workspace state...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">☕</span>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AnySolver</h1>
                <p className="text-xs text-gray-500">Paste. Solve. Print.</p>
              </div>
            </div>

            {/* API Setup */}
            <div className="flex items-center gap-3">
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value as ApiProvider)}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white"
              >
                {Object.entries(API_CONFIGS).map(([key, config]) => (
                  <option key={key} value={key}>
                    {config.name}
                  </option>
                ))}
              </select>
              <input
                type="password"
                placeholder={API_CONFIGS[provider].keyPlaceholder}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-48 px-3 py-2 text-sm border border-gray-200 rounded-lg"
              />
              <a
                href={API_CONFIGS[provider].helpUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-orange-600 hover:underline whitespace-nowrap"
              >
                Get key ↗
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4">
          <nav className="flex gap-1">
            {[
              { id: 'input', label: '📝 Assignment', enabled: true },
              { id: 'editor', label: '✏️ Editor', enabled: hasResults },
              { id: 'preview', label: '👁️ Preview & Print', enabled: hasResults },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => tab.enabled && setActiveTab(tab.id as Tab)}
                disabled={!tab.enabled}
                className={`px-5 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-orange-600 border-b-2 border-orange-600'
                    : tab.enabled
                    ? 'text-gray-600 hover:text-gray-900'
                    : 'text-gray-300 cursor-not-allowed'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Error Banner */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex justify-between items-center">
            <span className="text-red-700 text-sm">⚠️ {error}</span>
            <button onClick={() => setError('')} className="text-red-500 hover:text-red-700">
              ×
            </button>
          </div>
        )}

        {/* Input Tab */}
        {activeTab === 'input' && (
          <div className="space-y-5">
            {/* Settings Toggle */}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="text-sm text-gray-600 hover:text-orange-600 flex items-center gap-1"
            >
              ⚙️ {showSettings ? 'Hide Settings' : 'Show Settings'}
            </button>

            {showSettings && (
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800 text-sm">Solver Settings</h3>
                  <select
                    value={solverSettings.assignmentType}
                    onChange={(e) =>
                      setSolverSettings({ ...solverSettings, assignmentType: e.target.value as AssignmentType })
                    }
                    className="px-3 py-1.5 text-sm border font-medium rounded-lg bg-orange-50 text-orange-700 border-orange-200"
                  >
                    <option value="Code">Code Assignment</option>
                    <option value="Essay">Essay Writing</option>
                    <option value="General">General Questions</option>
                  </select>
                </div>
                
                {solverSettings.assignmentType === 'Code' && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 pb-4 border-b border-gray-100">
                    <div>
                      <label className="text-xs text-gray-500">Author Name</label>
                      <input
                        type="text"
                        value={solverSettings.authorName}
                        onChange={(e) =>
                          setSolverSettings({ ...solverSettings, authorName: e.target.value })
                        }
                        placeholder="Your Name"
                        className="w-full mt-1 px-3 py-2 text-sm border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Experience Level</label>
                      <select
                        value={solverSettings.experienceLevel}
                        onChange={(e) =>
                          setSolverSettings({
                            ...solverSettings,
                            experienceLevel: e.target.value,
                          })
                        }
                        className="w-full mt-1 px-3 py-2 text-sm border rounded-lg"
                      >
                        <option value="Beginner / Student">Beginner / Student</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Professional Developer">Professional Developer</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Variable Naming</label>
                      <select
                        value={solverSettings.namingConvention}
                        onChange={(e) =>
                          setSolverSettings({
                            ...solverSettings,
                            namingConvention: e.target.value as SolverSettings['namingConvention'],
                          })
                        }
                        className="w-full mt-1 px-3 py-2 text-sm border rounded-lg"
                      >
                        <option value="camelCase">camelCase</option>
                        <option value="snake_case">snake_case</option>
                        <option value="PascalCase">PascalCase</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Indent</label>
                      <select
                        value={solverSettings.indentSpaces}
                        onChange={(e) =>
                          setSolverSettings({ ...solverSettings, indentSpaces: +e.target.value })
                        }
                        className="w-full mt-1 px-3 py-2 text-sm border rounded-lg"
                      >
                        <option value={2}>2 spaces</option>
                        <option value={4}>4 spaces</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Package</label>
                      <input
                        type="text"
                        value={solverSettings.packageName}
                        onChange={(e) =>
                          setSolverSettings({ ...solverSettings, packageName: e.target.value })
                        }
                        placeholder="com.example"
                        className="w-full mt-1 px-3 py-2 text-sm border rounded-lg"
                      />
                    </div>
                  </div>
                )}

                {/* Variable Names Input */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Base Variable Names</label>
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="e.g. idx, temp_val, userNode... (comma separated)"
                      value={solverSettings.baseVariableNames}
                      onChange={(e) => setSolverSettings({
                        ...solverSettings,
                        baseVariableNames: e.target.value
                      })}
                      className="w-full px-3 py-2 text-sm border rounded-lg"
                    />
                    <p className="text-xs text-gray-400 italic mt-1 pb-2">
                       List preferred variable names so the output doesn't look AI-generated.
                    </p>
                  </div>
                </div>

                {solverSettings.assignmentType === 'Code' && (
                  <div className="flex gap-6 mt-4 pt-4 border-t border-gray-100">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={solverSettings.includeOutput}
                        onChange={(e) =>
                          setSolverSettings({ ...solverSettings, includeOutput: e.target.checked })
                        }
                        className="accent-orange-600"
                      />
                      Include Output
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={solverSettings.includeExplanation}
                        onChange={(e) =>
                          setSolverSettings({
                            ...solverSettings,
                            includeExplanation: e.target.checked,
                          })
                        }
                        className="accent-orange-600"
                      />
                      Include Explanation
                    </label>
                  </div>
                )}
              </div>
            )}

            {/* Drop Zone */}
            <div
              onDrop={handleFileDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.md"
                onChange={handleFileDrop}
                hidden
              />
              <div className="text-4xl mb-3">📄</div>
              <p className="font-medium text-gray-700">Drop your assignment file here</p>
              <p className="text-sm text-gray-400 mt-1">or click to browse (.txt, .md)</p>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 text-gray-400 text-xs">
              <div className="flex-1 h-px bg-gray-200" />
              OR
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Text Input */}
            <textarea
              value={assignment}
              onChange={(e) => setAssignment(e.target.value)}
              placeholder={solverSettings.assignmentType === 'Code' ? `Paste your assignment questions here...

Example:
1. Write a program to find the factorial of a number.
2. Write a program to check if a number is prime.
3. Write a program to reverse a string.` : `Paste your assignment prompt here...`}
              rows={12}
              className="w-full p-4 border border-gray-200 rounded-xl font-mono text-sm resize-y focus:outline-none focus:border-orange-400"
            />

            {/* Solve Button */}
            <button
              onClick={handleSolve}
              disabled={isLoading || !assignment.trim()}
              className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Solving...
                </>
              ) : (
                <>🚀 Solve Assignment</>
              )}
            </button>
          </div>
        )}

        {/* Editor Tab */}
        {activeTab === 'editor' && hasResults && (
          <MarkdownEditor
            questions={questions}
            onChange={setQuestions}
            rawMarkdown={rawMarkdown}
            onRawChange={setRawMarkdown}
          />
        )}

        {/* Preview Tab */}
        {activeTab === 'preview' && hasResults && (
          <div className="space-y-6">
            <LayoutSettingsPanel settings={pdfSettings} onChange={setPdfSettings} />
            <PDFPreview questions={questions} settings={pdfSettings} assignmentType={solverSettings.assignmentType} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-gray-400">
        Your API key is stored locally and never sent to our servers.
      </footer>
    </div>
  );
}
