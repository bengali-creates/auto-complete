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

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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
  Sparkles,
  Code2,
  FileEdit,
  HelpCircle,
  Zap,
  Terminal,
} from 'lucide-react';
import { GridScan } from '@/components/ui/gridScan';
import { PillNav, PillNavItem } from '@/components/ui/pillNav';

const PDFPreview = dynamic(
  () => import('@/components/pdf-preview').then((mod) => mod.PDFPreview),
  {
    ssr: false,
    loading: () => (
      <div className="h-96 rounded-2xl animate-pulse flex items-center justify-center bg-[#0f0f0f] border border-white/5">
        <Loader2 className="w-8 h-8 animate-spin text-violet-400" />
      </div>
    ),
  }
);

type Tab = 'input' | 'editor' | 'preview';


function BentoCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`relative bg-white/[0.03] border border-white/[0.07] rounded-2xl backdrop-blur-sm overflow-hidden ${className}`}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      {children}
    </div>
  );
}

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

  useEffect(() => { setMounted(true); }, []);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileDrop = (e: React.DragEvent | React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = 'dataTransfer' in e ? e.dataTransfer?.files[0] : e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setAssignment(ev.target?.result as string);
      reader.readAsText(file);
    }
  };

  const handleSolve = async () => {
    if (!apiKey.trim()) return setError('Please enter your API key');
    if (!assignment.trim()) return setError('Please enter or upload an assignment');

    setIsLoading(true);
    setError('');

    try {
      const request: SolveRequest = { assignment, provider, apiKey, settings: solverSettings };
      const res = await fetch('/api/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });
      const data: SolveResponse = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to solve assignment');
      setQuestions(data.questions);
      setRawMarkdown(data.rawMarkdown);
      setAssignment(''); // Clear the input after successful solve
      setActiveTab('editor');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const hasResults = questions.length > 0;

  const navItems: PillNavItem[] = [
    { id: 'input', label: 'Assignment', icon: <FileText className="w-3.5 h-3.5" /> },
    { id: 'editor', label: 'Editor', icon: <Pencil className="w-3.5 h-3.5" />, disabled: !hasResults },
    { id: 'preview', label: 'Preview & Print', icon: <Eye className="w-3.5 h-3.5" />, disabled: !hasResults },
  ];

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
            <Terminal className="w-6 h-6 text-violet-400 animate-pulse" />
          </div>
          <p className="text-white/40 text-sm font-mono tracking-wider animate-pulse">initializing workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen text-white relative">

        
        <div
          className="fixed inset-0 pointer-events-none"
          style={{ zIndex: 0 }}
          aria-hidden="true"
        >
          <GridScan
            sensitivity={0.55}
            lineThickness={1}
            linesColor="#2F293A"
            gridScale={0.1}
            scanColor="#FF9FFC"
            scanOpacity={0.4}
            enablePost
            bloomIntensity={0.6}
            chromaticAberration={0.002}
            noiseIntensity={0.01}
          />
        </div>

        
        <div className="relative" style={{ zIndex: 1 }}>

          
          <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#080808]/80 backdrop-blur-xl">
            <div className="w-full mx-auto px-6 h-16 flex items-center justify-between">
              
              <div className="w-full flex">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-900/40">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-white text-base tracking-tight">AnySolver</span>
                <span className="hidden sm:block text-white/20 text-xs font-mono border border-white/10 rounded px-1.5 py-0.5">
                  AI
                </span>
              </div>
<div className="sticky top-16 z-40 border-b border-white/[0.04] bg-[#080808]/60 backdrop-blur-lg">
            <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
              <PillNav items={navItems} active={activeTab as Tab} onChange={(t) => setActiveTab(t as Tab)} />
              {hasResults && (
                <Badge
                  variant="outline"
                  className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 text-[10px] font-mono"
                >
                  {questions.length} question{questions.length !== 1 ? 's' : ''} solved
                </Badge>
              )}
            </div>
          </div>
          </div>
              
              <div className="flex items-center gap-2">
                <Select value={provider} onValueChange={(v) => setProvider(v as ApiProvider)}>
                  <SelectTrigger className="h-9 w-[140px] bg-white/5 border-white/10 text-white/80 text-xs focus:ring-violet-500/30 hover:bg-white/8 transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111] border-white/10 text-white z-[200]">
                    {Object.entries(API_CONFIGS).map(([key, config]) => (
                      <SelectItem key={key} value={key} className="text-white/80 focus:bg-white/10 focus:text-white">
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
                    className="h-9 w-48 bg-white/5 border-white/10 text-white placeholder:text-white/25 text-xs focus-visible:ring-violet-500/30 focus-visible:border-violet-500/40 pr-7"
                  />
                  {apiKey && (
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  )}
                </div>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 px-3 text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 border-white/10 text-xs"
                      asChild
                    >
                      <a href={API_CONFIGS[provider].helpUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-3.5 h-3.5 mr-1" />
                        Get key
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-[#1a1a1a] border-white/10 text-white text-xs z-[300]">
                    Get your API key from {API_CONFIGS[provider].name}
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </header>

         

          
          <main className="max-w-6xl mx-auto px-6 py-8">
            
            {error && (
              <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1">{error}</span>
                <button onClick={() => setError('')} className="text-red-400 hover:text-red-200 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            
            {activeTab === 'input' && (
              <div className="space-y-5">

                {/* ── Settings collapsible ──
                    FIX: Do NOT use asChild on CollapsibleTrigger with a <button>.
                    CollapsibleTrigger already renders a button — just style it directly. */}
                <Collapsible open={showSettings} onOpenChange={setShowSettings}>
                  <CollapsibleTrigger className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors group outline-none">
                    <Settings2 className="w-4 h-4 group-hover:text-violet-400 transition-colors" />
                    {showSettings ? 'Hide Settings' : 'Customize Settings'}
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${showSettings ? 'rotate-180' : ''}`}
                    />
                  </CollapsibleTrigger>

                  <CollapsibleContent className="mt-4">
                    <BentoCard>
                      <div className="p-5">
                        
                        <div className="flex items-center justify-between mb-5">
                          <div className="flex items-center gap-2">
                            <Wand2 className="w-4 h-4 text-violet-400" />
                            <span className="text-sm font-semibold text-white">Solver Settings</span>
                            <span className="text-xs text-white/30">Customize how your assignment is solved</span>
                          </div>
                          <Select
                            value={solverSettings.assignmentType}
                            onValueChange={(v) => setSolverSettings({ ...solverSettings, assignmentType: v as AssignmentType })}
                          >
                            <SelectTrigger className="w-[170px] h-8 bg-violet-500/10 border-violet-500/20 text-violet-300 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[#111] border-white/10 text-white z-[200]">
                              <SelectItem value="Code" className="text-white/80 focus:bg-white/10 focus:text-white">
                                <span className="flex items-center gap-2"><Code2 className="w-3.5 h-3.5" /> Code Assignment</span>
                              </SelectItem>
                              <SelectItem value="Essay" className="text-white/80 focus:bg-white/10 focus:text-white">
                                <span className="flex items-center gap-2"><FileEdit className="w-3.5 h-3.5" /> Essay Writing</span>
                              </SelectItem>
                              <SelectItem value="General" className="text-white/80 focus:bg-white/10 focus:text-white">
                                <span className="flex items-center gap-2"><HelpCircle className="w-3.5 h-3.5" /> General Questions</span>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {solverSettings.assignmentType === 'Code' && (
                          <>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-5">
                              {[
                                {
                                  label: 'Author Name',
                                  content: (
                                    <Input
                                      value={solverSettings.authorName}
                                      onChange={(e) => setSolverSettings({ ...solverSettings, authorName: e.target.value })}
                                      placeholder="Your Name"
                                      className="h-8 bg-white/5 border-white/10 text-white placeholder:text-white/20 text-xs focus-visible:ring-violet-500/30"
                                    />
                                  ),
                                },
                                {
                                  label: 'Experience Level',
                                  content: (
                                    <Select
                                      value={solverSettings.experienceLevel}
                                      onValueChange={(v) => setSolverSettings({ ...solverSettings, experienceLevel: v })}
                                    >
                                      <SelectTrigger className="h-8 bg-white/5 border-white/10 text-white/70 text-xs">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent className="bg-[#111] border-white/10 text-white z-[200]">
                                        <SelectItem value="Beginner / Student" className="text-white/80 focus:bg-white/10 focus:text-white text-xs">Beginner / Student</SelectItem>
                                        <SelectItem value="Intermediate" className="text-white/80 focus:bg-white/10 focus:text-white text-xs">Intermediate</SelectItem>
                                        <SelectItem value="Professional Developer" className="text-white/80 focus:bg-white/10 focus:text-white text-xs">Professional</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  ),
                                },
                                {
                                  label: 'Variable Naming',
                                  content: (
                                    <Select
                                      value={solverSettings.namingConvention}
                                      onValueChange={(v) => setSolverSettings({ ...solverSettings, namingConvention: v as SolverSettings['namingConvention'] })}
                                    >
                                      <SelectTrigger className="h-8 bg-white/5 border-white/10 text-white/70 text-xs">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent className="bg-[#111] border-white/10 text-white z-[200]">
                                        <SelectItem value="camelCase" className="text-white/80 focus:bg-white/10 focus:text-white text-xs">camelCase</SelectItem>
                                        <SelectItem value="snake_case" className="text-white/80 focus:bg-white/10 focus:text-white text-xs">snake_case</SelectItem>
                                        <SelectItem value="PascalCase" className="text-white/80 focus:bg-white/10 focus:text-white text-xs">PascalCase</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  ),
                                },
                                {
                                  label: 'Indentation',
                                  content: (
                                    <Select
                                      value={String(solverSettings.indentSpaces)}
                                      onValueChange={(v) => setSolverSettings({ ...solverSettings, indentSpaces: +v })}
                                    >
                                      <SelectTrigger className="h-8 bg-white/5 border-white/10 text-white/70 text-xs">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent className="bg-[#111] border-white/10 text-white z-[200]">
                                        <SelectItem value="2" className="text-white/80 focus:bg-white/10 focus:text-white text-xs">2 spaces</SelectItem>
                                        <SelectItem value="4" className="text-white/80 focus:bg-white/10 focus:text-white text-xs">4 spaces</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  ),
                                },
                                {
                                  label: 'Package Name',
                                  content: (
                                    <Input
                                      value={solverSettings.packageName}
                                      onChange={(e) => setSolverSettings({ ...solverSettings, packageName: e.target.value })}
                                      placeholder="com.example"
                                      className="h-8 bg-white/5 border-white/10 text-white placeholder:text-white/20 text-xs focus-visible:ring-violet-500/30"
                                    />
                                  ),
                                },
                              ].map((field) => (
                                <div key={field.label} className="space-y-1.5">
                                  <Label className="text-[10px] font-medium text-white/30 uppercase tracking-wider">
                                    {field.label}
                                  </Label>
                                  {field.content}
                                </div>
                              ))}
                            </div>
                            <Separator className="bg-white/5 mb-5" />
                          </>
                        )}

                        
                        <div className="space-y-2 mb-5">
                          <Label className="text-[10px] font-medium text-white/30 uppercase tracking-wider">
                            Base Variable Names
                          </Label>
                          <Input
                            placeholder="e.g. idx, temp_val, userNode... (comma separated)"
                            value={solverSettings.baseVariableNames}
                            onChange={(e) => setSolverSettings({ ...solverSettings, baseVariableNames: e.target.value })}
                            className="h-8 bg-white/5 border-white/10 text-white placeholder:text-white/20 text-xs focus-visible:ring-violet-500/30"
                          />
                          <p className="text-[10px] text-white/20 italic">
                            List preferred variable names so the output doesn't look AI-generated.
                          </p>
                        </div>

                        <Separator className="bg-white/5 mb-5" />

                        
                        <div className="flex flex-wrap gap-5">
                          {solverSettings.assignmentType === 'Code' && (
                            <>
                              {[
                                { id: 'includeOutput', label: 'Include Output', checked: solverSettings.includeOutput, key: 'includeOutput' },
                                { id: 'includeExplanation', label: 'Include Explanation', checked: solverSettings.includeExplanation, key: 'includeExplanation' },
                              ].map((toggle) => (
                                <div key={toggle.id} className="flex items-center gap-2.5">
                                  <Switch
                                    id={toggle.id}
                                    checked={toggle.checked}
                                    onCheckedChange={(checked) => setSolverSettings({ ...solverSettings, [toggle.key]: checked })}
                                    className="data-[state=checked]:bg-violet-500"
                                  />
                                  <Label htmlFor={toggle.id} className="text-xs text-white/60 cursor-pointer">{toggle.label}</Label>
                                </div>
                              ))}
                            </>
                          )}
                          <div className="flex items-center gap-2.5">
                            <Switch
                              id="verticalCompactness"
                              checked={solverSettings.verticalCompactness}
                              onCheckedChange={(checked) => setSolverSettings({ ...solverSettings, verticalCompactness: checked })}
                              className="data-[state=checked]:bg-violet-500"
                            />
                            <Label htmlFor="verticalCompactness" className="text-xs text-white/60 cursor-pointer">Space Saving Mode</Label>
                          </div>
                        </div>
                      </div>
                    </BentoCard>
                  </CollapsibleContent>
                </Collapsible>

                
                <BentoCard
                  className={`cursor-pointer transition-all duration-300 ${
                    isDragging
                      ? 'border-violet-500/50 bg-violet-500/5 scale-[1.01]'
                      : 'hover:border-white/15 hover:bg-white/[0.04]'
                  }`}
                >
                  <div
                    onDrop={handleFileDrop}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onClick={() => fileInputRef.current?.click()}
                    className="py-8 flex flex-col items-center"
                  >
                    <input ref={fileInputRef} type="file" accept=".txt,.md" onChange={handleFileDrop} hidden />
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-all ${
                        isDragging
                          ? 'bg-violet-500/20 border border-violet-500/30 scale-110'
                          : 'bg-white/5 border border-white/8'
                      }`}
                    >
                      <Upload className={`w-5 h-5 transition-colors ${isDragging ? 'text-violet-400' : 'text-white/30'}`} />
                    </div>
                    <p className="text-sm font-medium text-white/70 mb-1">Drop your assignment file here</p>
                    <p className="text-xs text-white/30 flex items-center gap-1.5">
                      or click to browse
                      <Badge variant="outline" className="border-white/10 text-white/30 text-[10px] font-mono px-1.5 py-0">
                        .txt
                      </Badge>
                      <Badge variant="outline" className="border-white/10 text-white/30 text-[10px] font-mono px-1.5 py-0">
                        .md
                      </Badge>
                    </p>
                  </div>
                </BentoCard>

                
                <div className="flex items-center gap-4 text-white/15 text-xs">
                  <div className="flex-1 h-px bg-white/8" />
                  <span className="font-mono text-white/25">OR</span>
                  <div className="flex-1 h-px bg-white/8" />
                </div>

                
                <BentoCard>
                  
                  <ScrollArea className="h-56 w-full rounded-2xl">
                    <Textarea
                      value={assignment}
                      onChange={(e) => setAssignment(e.target.value)}
                      placeholder={
                        solverSettings.assignmentType === 'Code'
                          ? `Paste your assignment questions here...\n\nExample:\n1. Write a program to find the factorial of a number.\n2. Write a program to check if a number is prime.\n3. Write a program to reverse a string.`
                          : `Paste your assignment prompt here...`
                      }
                      className="min-h-56 border-0 rounded-none font-mono text-sm resize-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-white/80 placeholder:text-white/15 p-5"
                    />
                  </ScrollArea>
                </BentoCard>

                
                <button
                  onClick={handleSolve}
                  disabled={isLoading || !assignment.trim()}
                  className="group w-full py-3.5 relative overflow-hidden rounded-xl font-semibold text-sm transition-all duration-200
                    bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500
                    disabled:opacity-40 disabled:cursor-not-allowed
                    shadow-xl shadow-violet-900/40 hover:shadow-violet-900/60
                    active:scale-[0.99]"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Solving your assignment...
                      </>
                    ) : (
                      <>
                        <Rocket className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                        Solve Assignment
                        <Sparkles className="w-3.5 h-3.5 opacity-70" />
                      </>
                    )}
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                </button>
              </div>
            )}

            
            {activeTab === 'editor' && hasResults && (
              <BentoCard>
                <div className="p-6">
                  <MarkdownEditor
                    questions={questions}
                    onChange={setQuestions}
                    rawMarkdown={rawMarkdown}
                    onRawChange={setRawMarkdown}
                  />
                </div>
              </BentoCard>
            )}

            
            {activeTab === 'preview' && hasResults && (
              <div className="space-y-5">
                <BentoCard>
                  <div className="p-5">
                    <LayoutSettingsPanel settings={pdfSettings} onChange={setPdfSettings} />
                  </div>
                </BentoCard>
                <BentoCard className="overflow-hidden">
                  <PDFPreview
                    questions={questions}
                    settings={pdfSettings}
                    assignmentType={solverSettings.assignmentType}
                  />
                </BentoCard>
              </div>
            )}
          </main>

          
          <footer className="border-t border-white/[0.04] py-6 text-center">
            <div className="flex items-center justify-center gap-2 text-xs text-white/20">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              Your API key is stored locally and never sent to our servers.
            </div>
          </footer>

        </div>
      </div>
    </TooltipProvider>
  );
}