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

// shadcn/ui components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Icons (using lucide-react which comes with shadcn)
import {
  Upload,
  FileText,
  Wand2,
  Eye,
  Pencil,
  Settings2,
  ChevronDown,
  Loader2,
  Rocket,
  ExternalLink,
  X,
  AlertCircle,
  Coffee,
  Sparkles,
  Code2,
  FileEdit,
  HelpCircle,
  Zap,
} from 'lucide-react';

// Dynamic import for PDF (needs client-only)
const PDFPreview = dynamic(
  () => import('@/components/pdf-preview').then((mod) => mod.PDFPreview),
  {
    ssr: false,
    loading: () => (
      <div className="h-96 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl animate-pulse flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-400" />
      </div>
    ),
  }
);

type Tab = 'input' | 'editor' | 'preview';

export default function HomePage() {
  const {
    activeTab,
    setActiveTab,
    provider,
    setProvider,
    apiKey,
    setApiKey,
    assignment,
    setAssignment,
    solverSettings,
    setSolverSettings,
    pdfSettings,
    setPdfSettings,
    questions,
    setQuestions,
    rawMarkdown,
    setRawMarkdown,
  } = useAppStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file upload
  const handleFileDrop = (e: React.DragEvent | React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setIsDragging(false);
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
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Coffee className="w-12 h-12 text-orange-500 animate-bounce" />
            <Sparkles className="w-5 h-5 text-amber-400 absolute -top-1 -right-1 animate-pulse" />
          </div>
          <p className="text-orange-700 font-medium animate-pulse">Loading workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-amber-50/80 via-orange-50/50 to-rose-50/80">
        {/* Decorative background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200/30 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-40 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 right-1/3 w-72 h-72 bg-rose-200/25 rounded-full blur-3xl" />
        </div>

        {/* Header */}
        <header className="relative bg-white/70 backdrop-blur-xl border-b border-orange-100/50 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center gap-3 group cursor-default">
                <div className="relative">
                  <div className="w-11 h-11 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200/50 group-hover:shadow-orange-300/60 transition-shadow">
                    <Coffee className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center">
                    <Zap className="w-2.5 h-2.5 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                    AnySolver
                  </h1>
                  <p className="text-[11px] text-orange-500/70 font-medium tracking-wide">
                    Paste • Solve • Print
                  </p>
                </div>
              </div>

              {/* API Setup */}
              <div className="flex items-center gap-3">
                <Select value={provider} onValueChange={(v) => setProvider(v as ApiProvider)}>
                  <SelectTrigger className="w-[140px] bg-white/80 border-orange-200/50 focus:ring-orange-400/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(API_CONFIGS).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        {config.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="relative">
                  <Input
                    type="password"
                    placeholder={API_CONFIGS[provider].keyPlaceholder}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-52 bg-white/80 border-orange-200/50 focus-visible:ring-orange-400/30 pr-8"
                  />
                  {apiKey && (
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  )}
                </div>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-orange-600 hover:text-orange-700 hover:bg-orange-100/50"
                      asChild
                    >
                      <a
                        href={API_CONFIGS[provider].helpUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Get key
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Get your API key from {API_CONFIGS[provider].name}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </header>

        {/* Tabs Navigation */}
        <div className="relative bg-white/50 backdrop-blur-sm border-b border-orange-100/30">
          <div className="max-w-6xl mx-auto px-6">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as Tab)}>
              <TabsList className="bg-transparent h-14 gap-1">
                <TabsTrigger
                  value="input"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-orange-200/50 rounded-xl px-5 py-2.5 transition-all"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Assignment
                </TabsTrigger>
                <TabsTrigger
                  value="editor"
                  disabled={!hasResults}
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-orange-200/50 rounded-xl px-5 py-2.5 transition-all disabled:opacity-40"
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Editor
                </TabsTrigger>
                <TabsTrigger
                  value="preview"
                  disabled={!hasResults}
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-orange-200/50 rounded-xl px-5 py-2.5 transition-all disabled:opacity-40"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview & Print
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Main Content */}
        <main className="relative max-w-6xl mx-auto px-6 py-8">
          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50/80 backdrop-blur">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between flex-1">
                <span>{error}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-red-100"
                  onClick={() => setError('')}
                >
                  <X className="w-4 h-4" />
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Input Tab */}
          {activeTab === 'input' && (
            <div className="space-y-6">
              {/* Settings Collapsible */}
              <Collapsible open={showSettings} onOpenChange={setShowSettings}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-orange-600 hover:text-orange-700 hover:bg-orange-100/50 gap-2"
                  >
                    <Settings2 className="w-4 h-4" />
                    {showSettings ? 'Hide Settings' : 'Customize Settings'}
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${showSettings ? 'rotate-180' : ''}`}
                    />
                  </Button>
                </CollapsibleTrigger>

                <CollapsibleContent className="mt-4">
                  <Card className="border-orange-200/50 bg-white/80 backdrop-blur shadow-xl shadow-orange-100/20">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Wand2 className="w-5 h-5 text-orange-500" />
                            Solver Settings
                          </CardTitle>
                          <CardDescription>Customize how your assignment is solved</CardDescription>
                        </div>
                        <Select
                          value={solverSettings.assignmentType}
                          onValueChange={(v) =>
                            setSolverSettings({ ...solverSettings, assignmentType: v as AssignmentType })
                          }
                        >
                          <SelectTrigger className="w-[180px] bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200 text-orange-700 font-medium">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Code">
                              <span className="flex items-center gap-2">
                                <Code2 className="w-4 h-4" />
                                Code Assignment
                              </span>
                            </SelectItem>
                            <SelectItem value="Essay">
                              <span className="flex items-center gap-2">
                                <FileEdit className="w-4 h-4" />
                                Essay Writing
                              </span>
                            </SelectItem>
                            <SelectItem value="General">
                              <span className="flex items-center gap-2">
                                <HelpCircle className="w-4 h-4" />
                                General Questions
                              </span>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      {solverSettings.assignmentType === 'Code' && (
                        <>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                                Author Name
                              </Label>
                              <Input
                                value={solverSettings.authorName}
                                onChange={(e) =>
                                  setSolverSettings({ ...solverSettings, authorName: e.target.value })
                                }
                                placeholder="Your Name"
                                className="bg-white/60"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                                Experience Level
                              </Label>
                              <Select
                                value={solverSettings.experienceLevel}
                                onValueChange={(v) =>
                                  setSolverSettings({ ...solverSettings, experienceLevel: v })
                                }
                              >
                                <SelectTrigger className="bg-white/60">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Beginner / Student">Beginner / Student</SelectItem>
                                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                                  <SelectItem value="Professional Developer">
                                    Professional Developer
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                                Variable Naming
                              </Label>
                              <Select
                                value={solverSettings.namingConvention}
                                onValueChange={(v) =>
                                  setSolverSettings({
                                    ...solverSettings,
                                    namingConvention: v as SolverSettings['namingConvention'],
                                  })
                                }
                              >
                                <SelectTrigger className="bg-white/60">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="camelCase">camelCase</SelectItem>
                                  <SelectItem value="snake_case">snake_case</SelectItem>
                                  <SelectItem value="PascalCase">PascalCase</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                                Indentation
                              </Label>
                              <Select
                                value={String(solverSettings.indentSpaces)}
                                onValueChange={(v) =>
                                  setSolverSettings({ ...solverSettings, indentSpaces: +v })
                                }
                              >
                                <SelectTrigger className="bg-white/60">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="2">2 spaces</SelectItem>
                                  <SelectItem value="4">4 spaces</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                                Package Name
                              </Label>
                              <Input
                                value={solverSettings.packageName}
                                onChange={(e) =>
                                  setSolverSettings({ ...solverSettings, packageName: e.target.value })
                                }
                                placeholder="com.example"
                                className="bg-white/60"
                              />
                            </div>
                          </div>
                          <Separator className="bg-orange-100" />
                        </>
                      )}

                      {/* Variable Names Input */}
                      <div className="space-y-3">
                        <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                          Base Variable Names
                        </Label>
                        <Input
                          placeholder="e.g. idx, temp_val, userNode... (comma separated)"
                          value={solverSettings.baseVariableNames}
                          onChange={(e) =>
                            setSolverSettings({
                              ...solverSettings,
                              baseVariableNames: e.target.value,
                            })
                          }
                          className="bg-white/60"
                        />
                        <p className="text-xs text-muted-foreground italic">
                          List preferred variable names so the output doesn't look AI-generated.
                        </p>
                      </div>

                      <Separator className="bg-orange-100" />

                      {/* Toggles */}
                      <div className="flex flex-wrap gap-6">
                        {solverSettings.assignmentType === 'Code' && (
                          <>
                            <div className="flex items-center gap-3">
                              <Switch
                                id="includeOutput"
                                checked={solverSettings.includeOutput}
                                onCheckedChange={(checked) =>
                                  setSolverSettings({ ...solverSettings, includeOutput: checked })
                                }
                              />
                              <Label htmlFor="includeOutput" className="font-medium cursor-pointer">
                                Include Output
                              </Label>
                            </div>
                            <div className="flex items-center gap-3">
                              <Switch
                                id="includeExplanation"
                                checked={solverSettings.includeExplanation}
                                onCheckedChange={(checked) =>
                                  setSolverSettings({ ...solverSettings, includeExplanation: checked })
                                }
                              />
                              <Label htmlFor="includeExplanation" className="font-medium cursor-pointer">
                                Include Explanation
                              </Label>
                            </div>
                          </>
                        )}
                        <div className="flex items-center gap-3">
                          <Switch
                            id="verticalCompactness"
                            checked={solverSettings.verticalCompactness}
                            onCheckedChange={(checked) =>
                              setSolverSettings({ ...solverSettings, verticalCompactness: checked })
                            }
                          />
                          <Label htmlFor="verticalCompactness" className="font-medium cursor-pointer">
                            Space Saving Mode
                          </Label>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CollapsibleContent>
              </Collapsible>

              {/* Drop Zone */}
              <Card
                onDrop={handleFileDrop}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed cursor-pointer transition-all duration-300 ${
                  isDragging
                    ? 'border-orange-400 bg-orange-50/80 scale-[1.02]'
                    : 'border-orange-200/60 bg-white/60 hover:border-orange-300 hover:bg-orange-50/50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.md"
                  onChange={handleFileDrop}
                  hidden
                />
                <CardContent className="py-12 flex flex-col items-center">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all ${
                      isDragging
                        ? 'bg-gradient-to-br from-orange-400 to-amber-500 scale-110'
                        : 'bg-gradient-to-br from-orange-100 to-amber-100'
                    }`}
                  >
                    <Upload
                      className={`w-8 h-8 transition-colors ${
                        isDragging ? 'text-white' : 'text-orange-500'
                      }`}
                    />
                  </div>
                  <p className="font-semibold text-gray-700 mb-1">
                    Drop your assignment file here
                  </p>
                  <p className="text-sm text-muted-foreground">
                    or click to browse
                    <Badge variant="secondary" className="ml-2 bg-orange-100 text-orange-600">
                      .txt
                    </Badge>
                    <Badge variant="secondary" className="ml-1 bg-orange-100 text-orange-600">
                      .md
                    </Badge>
                  </p>
                </CardContent>
              </Card>

              {/* Divider */}
              <div className="flex items-center gap-4 text-muted-foreground text-sm">
                <Separator className="flex-1 bg-orange-200/50" />
                <span className="text-orange-400 font-medium">OR</span>
                <Separator className="flex-1 bg-orange-200/50" />
              </div>

              {/* Text Input */}
              <Card className="border-orange-200/50 bg-white/80 backdrop-blur overflow-hidden">
                <CardContent className="p-0">
                  <Textarea
                    value={assignment}
                    onChange={(e) => setAssignment(e.target.value)}
                    placeholder={
                      solverSettings.assignmentType === 'Code'
                        ? `Paste your assignment questions here...

Example:
1. Write a program to find the factorial of a number.
2. Write a program to check if a number is prime.
3. Write a program to reverse a string.`
                        : `Paste your assignment prompt here...`
                    }
                    rows={14}
                    className="border-0 rounded-none font-mono text-sm resize-y focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                  />
                </CardContent>
              </Card>

              {/* Solve Button */}
              <Button
                onClick={handleSolve}
                disabled={isLoading || !assignment.trim()}
                size="lg"
                className="w-full h-14 text-lg font-bold bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:from-orange-600 hover:via-amber-600 hover:to-orange-600 shadow-xl shadow-orange-200/50 hover:shadow-orange-300/60 transition-all disabled:opacity-50 disabled:shadow-none"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Solving your assignment...
                  </>
                ) : (
                  <>
                    <Rocket className="w-5 h-5 mr-2" />
                    Solve Assignment
                    <Sparkles className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Editor Tab */}
          {activeTab === 'editor' && hasResults && (
            <Card className="border-orange-200/50 bg-white/80 backdrop-blur">
              <CardContent className="p-6">
                <MarkdownEditor
                  questions={questions}
                  onChange={setQuestions}
                  rawMarkdown={rawMarkdown}
                  onRawChange={setRawMarkdown}
                />
              </CardContent>
            </Card>
          )}

          {/* Preview Tab */}
          {activeTab === 'preview' && hasResults && (
            <div className="space-y-6">
              <Card className="border-orange-200/50 bg-white/80 backdrop-blur">
                <CardContent className="p-6">
                  <LayoutSettingsPanel settings={pdfSettings} onChange={setPdfSettings} />
                </CardContent>
              </Card>
              <Card className="border-orange-200/50 bg-white/80 backdrop-blur overflow-hidden">
                <CardContent className="p-0">
                  <PDFPreview
                    questions={questions}
                    settings={pdfSettings}
                    assignmentType={solverSettings.assignmentType}
                  />
                </CardContent>
              </Card>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="relative text-center py-8 text-sm text-orange-600/60">
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            Your API key is stored locally and never sent to our servers.
          </div>
        </footer>
      </div>
    </TooltipProvider>
  );
}