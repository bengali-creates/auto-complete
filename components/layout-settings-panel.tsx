'use client';

import { PDFLayoutSettings, LayoutStyle, SpacingStyle } from '@/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface LayoutSettingsPanelProps {
  settings: PDFLayoutSettings;
  onChange: (settings: PDFLayoutSettings) => void;
}


function DarkSlider({
  min, max, step, value, onChange, label, display, title,
}: {
  min: number; max: number; step: number; value: number;
  onChange: (v: number) => void; label: string; display: string; title?: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label
          className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest"
          title={title}
        >
          {label}
        </Label>
        <span className="text-[10px] font-mono bg-zinc-900 border border-zinc-700/60 px-2 py-0.5 rounded-md text-violet-300 font-semibold tabular-nums">
          {display}
        </span>
      </div>
      <div className="relative h-6 flex items-center group">
        
        <div className="absolute inset-x-0 h-[4px] bg-zinc-800 rounded-full overflow-hidden border border-zinc-700/40">
          <div
            className="absolute left-0 top-0 h-full rounded-full transition-all duration-100"
            style={{
              width: `${pct}%`,
              background: 'linear-gradient(90deg, #7c3aed, #6366f1)',
              boxShadow: '0 0 8px rgba(139, 92, 246, 0.6)',
            }}
          />
        </div>
        
        <input
          type="range"
          min={min} max={max} step={step} value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-6"
          style={{ zIndex: 2 }}
        />
        
        <div
          className="absolute w-4 h-4 rounded-full pointer-events-none transition-all duration-100 group-hover:scale-110"
          style={{
            left: `calc(${pct}% - 8px)`,
            background: 'white',
            boxShadow: '0 0 0 2px rgba(139, 92, 246, 0.8), 0 2px 8px rgba(0,0,0,0.6)',
          }}
        />
      </div>
    </div>
  );
}


function SegmentGroup<T extends string>({
  options, value, onChange, renderLabel,
}: {
  options: T[]; value: T; onChange: (v: T) => void; renderLabel: (v: T) => string;
}) {
  return (
    <div className="flex gap-1 bg-zinc-900/80 border border-zinc-800 rounded-lg p-1">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={cn(
            'flex-1 py-1.5 px-2 text-[11px] font-semibold rounded-md transition-all duration-150',
            value === opt
              ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/50 border border-violet-500/50'
              : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800',
          )}
        >
          {renderLabel(opt)}
        </button>
      ))}
    </div>
  );
}


function CheckToggle({
  checked, onChange, label, title, wide = false,
}: {
  checked: boolean; onChange: (v: boolean) => void; label: string; title?: string; wide?: boolean;
}) {
  return (
    <label
      title={title}
      className={cn(
        'flex items-center gap-2.5 cursor-pointer rounded-lg px-3 py-2.5 transition-all duration-150 border select-none',
        checked
          ? 'bg-violet-950/60 border-violet-600/40 text-violet-200'
          : 'bg-zinc-900/60 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300',
        wide && 'col-span-2',
      )}
    >
      
      <div className={cn(
        'w-4 h-4 rounded border-[1.5px] flex items-center justify-center shrink-0 transition-all duration-150',
        checked ? 'bg-violet-600 border-violet-500' : 'border-zinc-600 bg-zinc-900',
      )}>
        {checked && (
          <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 12 12" fill="none">
            <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <span className="text-[11px] font-medium">{label}</span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only" />
    </label>
  );
}


function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="w-1 h-3.5 bg-violet-500 rounded-full" />
      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.12em]">{children}</p>
    </div>
  );
}


function PanelCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn(
      'bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-4 backdrop-blur-sm',
      'shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]',
      className
    )}>
      {children}
    </div>
  );
}


export function LayoutSettingsPanel({ settings, onChange }: LayoutSettingsPanelProps) {
  const update = <K extends keyof PDFLayoutSettings>(key: K, value: PDFLayoutSettings[K]) =>
    onChange({ ...settings, [key]: value });

  const applyEcoPreset = () =>
    onChange({
      ...settings,
      layoutStyle: 'stacked',
      spacingStyle: 'compact',
      paragraphSpacing: 6,
      fontSize: 8,
      lineHeight: 1.1,
      pageMargin: 15,
      pageMarginTop: 15,
      pageMarginBottom: 15,
    });

  return (
    <div className="space-y-5">
      
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight">PDF Layout & Typography</h3>
          <p className="text-[11px] text-zinc-500 mt-0.5">Customize output to save printer ink and paper.</p>
        </div>
        <Button
          onClick={applyEcoPreset}
          size="sm"
          variant="outline"
          className="h-8 text-[11px] font-semibold text-emerald-400 bg-emerald-950/40 border-emerald-700/30
            hover:bg-emerald-950/70 hover:border-emerald-600/50 hover:text-emerald-300
            shadow-none gap-1.5 transition-all duration-150"
        >
          <span>🌱</span> Max Paper Saver
        </Button>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

        
        <PanelCard>
          <SectionTitle>Structure</SectionTitle>
          <div className="space-y-3.5">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest" title="How code and output are arranged">
                Layout Engine
              </Label>
              <SegmentGroup
                options={['side-by-side', 'stacked', 'compact'] as LayoutStyle[]}
                value={settings.layoutStyle}
                onChange={(v) => update('layoutStyle', v)}
                renderLabel={(v) => v === 'side-by-side' ? '◧ Side' : v === 'stacked' ? '▤ Stack' : '▣ Compact'}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest" title="Padding inside code and output blocks">
                Block Padding
              </Label>
              <SegmentGroup
                options={['compact', 'normal', 'spacious'] as SpacingStyle[]}
                value={settings.spacingStyle}
                onChange={(v) => update('spacingStyle', v)}
                renderLabel={(v) => v.charAt(0).toUpperCase() + v.slice(1)}
              />
            </div>

            <Separator className="bg-zinc-800/60 my-1" />

            <div className="grid grid-cols-2 gap-2">
              <CheckToggle
                checked={settings.showLineNumbers}
                onChange={(v) => update('showLineNumbers', v)}
                label="Line Nums"
                title="Show line numbers on the code block"
              />
              <CheckToggle
                checked={settings.showPageNumbers}
                onChange={(v) => update('showPageNumbers', v)}
                label="Page Nums"
                title="Show page numbers at the bottom"
              />
              <CheckToggle
                checked={settings.showExplanation}
                onChange={(v) => update('showExplanation', v)}
                label="Print Explanation"
                title="Include the AI explanation in the PDF"
                wide
              />
            </div>
          </div>
        </PanelCard>

        
        <PanelCard>
          <SectionTitle>Density & Typography</SectionTitle>
          <div className="space-y-4">
            <DarkSlider min={10} max={60} step={5} value={settings.pageMargin}
              onChange={(v) => update('pageMargin', v)}
              label="Side Margins" display={`${settings.pageMargin}pt`}
              title="White space on left/right edges" />
            <DarkSlider min={0} max={100} step={5} value={settings.pageMarginTop}
              onChange={(v) => update('pageMarginTop', v)}
              label="Top Margin" display={`${settings.pageMarginTop}pt`}
              title="White space at the top of every page" />
            <DarkSlider min={0} max={100} step={5} value={settings.pageMarginBottom}
              onChange={(v) => update('pageMarginBottom', v)}
              label="Bottom Margin" display={`${settings.pageMarginBottom}pt`}
              title="White space at the bottom of every page" />
            <DarkSlider min={7} max={16} step={1} value={settings.fontSize}
              onChange={(v) => update('fontSize', v)}
              label="Font Size" display={`${settings.fontSize}pt`}
              title="Core text sizing" />
            <DarkSlider min={1.0} max={2.0} step={0.1} value={settings.lineHeight}
              onChange={(v) => update('lineHeight', v)}
              label="Line Height" display={settings.lineHeight.toFixed(1)}
              title="Vertical spacing between lines" />
            <DarkSlider min={4} max={32} step={2} value={settings.paragraphSpacing}
              onChange={(v) => update('paragraphSpacing', v)}
              label="Para Spacing" display={`${settings.paragraphSpacing}pt`}
              title="Distance between paragraphs and headings" />
          </div>
        </PanelCard>

        
        <PanelCard className="md:col-span-2">
          <SectionTitle>Header & Footer</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest" title="Title on every page">
                Header Text
              </Label>
              <Input
                placeholder="e.g. CS101 Final Assignment"
                value={settings.headerText}
                onChange={(e) => update('headerText', e.target.value)}
                className="h-9 text-xs bg-zinc-900 border-zinc-700/60 text-white placeholder:text-zinc-600
                  focus-visible:ring-violet-500/40 focus-visible:border-violet-500/50 transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest" title="Info at page bottom">
                Footer Text
              </Label>
              <Input
                placeholder="e.g. John Doe — ID: 123456"
                value={settings.footerText}
                onChange={(e) => update('footerText', e.target.value)}
                className="h-9 text-xs bg-zinc-900 border-zinc-700/60 text-white placeholder:text-zinc-600
                  focus-visible:ring-violet-500/40 focus-visible:border-violet-500/50 transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest" title="Heading highlight color">
                Heading Color
              </Label>
              <div className="flex items-center gap-2.5 h-9 bg-zinc-900 border border-zinc-700/60 rounded-md px-2.5 cursor-pointer hover:border-zinc-600 transition-colors">
                <input
                  type="color"
                  value={settings.headingColor}
                  onChange={(e) => update('headingColor', e.target.value)}
                  className="w-5 h-5 rounded cursor-pointer bg-transparent border-0 p-0"
                />
                <span className="text-[10px] font-mono text-zinc-400 flex-1">{settings.headingColor.toUpperCase()}</span>
                <div
                  className="w-4 h-4 rounded border border-zinc-700"
                  style={{ backgroundColor: settings.headingColor }}
                />
              </div>
            </div>
          </div>
        </PanelCard>
      </div>
    </div>
  );
}