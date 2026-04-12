'use client';

import { PDFLayoutSettings, LayoutStyle, SpacingStyle } from '@/types';

interface LayoutSettingsPanelProps {
  settings: PDFLayoutSettings;
  onChange: (settings: PDFLayoutSettings) => void;
}

export function LayoutSettingsPanel({ settings, onChange }: LayoutSettingsPanelProps) {
  const updateSetting = <K extends keyof PDFLayoutSettings>(
    key: K,
    value: PDFLayoutSettings[K]
  ) => {
    onChange({ ...settings, [key]: value });
  };

  const applyEcoPreset = () => {
    onChange({
      ...settings,
      layoutStyle: 'stacked',
      spacingStyle: 'compact',
      paragraphSpacing: 6,
      fontSize: 8,
      lineHeight: 1.1,
      pageMargin: 15,
    });
  };

  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
      <div className="bg-slate-50 px-5 py-4 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-slate-800 text-sm">PDF Layout & Typography</h3>
          <p className="text-xs text-slate-500 mt-0.5">Customize output to save printer ink and paper.</p>
        </div>
        <button
          onClick={applyEcoPreset}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-100 hover:bg-emerald-200 rounded-md transition-colors"
          title="Instantly compress everything to save max paper and ink"
        >
          <span>🌱</span> Max Paper Saver
        </button>
      </div>

      <div className="p-5 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Structure Section */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Structure</h4>
            
            {/* Layout Style */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700" title="Choose how the final code and output are arranged on the page">Layout Engine</label>
              <div className="flex gap-2">
                {(['side-by-side', 'stacked', 'compact'] as LayoutStyle[]).map((style) => (
                  <button
                    key={style}
                    onClick={() => updateSetting('layoutStyle', style)}
                    className={`flex-1 py-1.5 px-2 text-xs rounded-md border transition-all ${
                      settings.layoutStyle === style
                        ? 'bg-slate-800 text-white border-slate-800 shadow-sm'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {style === 'side-by-side' ? '◧ Side' : style === 'stacked' ? '▤ Stack' : '▣ Compact'}
                  </button>
                ))}
              </div>
            </div>

            {/* Block Spacing */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700" title="Adjust the padding inside the code and output blocks">Block Padding</label>
              <div className="flex gap-2">
                {(['compact', 'normal', 'spacious'] as SpacingStyle[]).map((style) => (
                  <button
                    key={style}
                    onClick={() => updateSetting('spacingStyle', style)}
                    className={`flex-1 py-1.5 px-2 text-xs rounded-md border transition-all ${
                      settings.spacingStyle === style
                        ? 'bg-slate-800 text-white border-slate-800 shadow-sm'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {style.charAt(0).toUpperCase() + style.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 pt-2">
              <label className="flex items-center gap-2 cursor-pointer bg-slate-50 p-2 rounded border border-slate-100" title="Show line numbers on the left side of the code block">
                <input
                  type="checkbox"
                  checked={settings.showLineNumbers}
                  onChange={(e) => updateSetting('showLineNumbers', e.target.checked)}
                  className="w-4 h-4 rounded text-slate-800 focus:ring-slate-800"
                />
                <span className="text-xs font-medium text-slate-600">Line Nums</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer bg-slate-50 p-2 rounded border border-slate-100" title="Show page numbers at the bottom right of the PDF">
                <input
                  type="checkbox"
                  checked={settings.showPageNumbers}
                  onChange={(e) => updateSetting('showPageNumbers', e.target.checked)}
                  className="w-4 h-4 rounded text-slate-800 focus:ring-slate-800"
                />
                <span className="text-xs font-medium text-slate-600">Page Nums</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer bg-slate-50 p-2 rounded border border-slate-100 col-span-2" title="Include the AI explanation in the generated PDF">
                <input
                  type="checkbox"
                  checked={settings.showExplanation}
                  onChange={(e) => updateSetting('showExplanation', e.target.checked)}
                  className="w-4 h-4 rounded text-slate-800 focus:ring-slate-800"
                />
                <span className="text-xs font-medium text-slate-600">Print Explanation</span>
              </label>
            </div>
          </div>

          {/* Density & Typography Section */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Density & Typography</h4>

            {/* Page Margin Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-medium text-slate-700" title="Adjust the white space around the edges of the absolute page boundary">Page Margin</label>
                <span className="text-[10px] font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">{settings.pageMargin}pt</span>
              </div>
              <input
                type="range"
                min={10}
                max={60}
                step={5}
                value={settings.pageMargin}
                onChange={(e) => updateSetting('pageMargin', parseInt(e.target.value))}
                className="w-full accent-slate-800 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Font Size Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-medium text-slate-700" title="Adjust the core text sizing of the entire PDF body">Font Size</label>
                <span className="text-[10px] font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">{settings.fontSize}pt</span>
              </div>
              <input
                type="range"
                min={7}
                max={16}
                step={1}
                value={settings.fontSize}
                onChange={(e) => updateSetting('fontSize', parseInt(e.target.value))}
                className="w-full accent-slate-800 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Line Height Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-medium text-slate-700" title="Change the vertical spacing between individual lines of text">Line Height</label>
                <span className="text-[10px] font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">{settings.lineHeight.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min={1.0}
                max={2.0}
                step={0.1}
                value={settings.lineHeight}
                onChange={(e) => updateSetting('lineHeight', parseFloat(e.target.value))}
                className="w-full accent-slate-800 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Para Spacing Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-medium text-slate-700" title="Change the distance separating different paragraphs and headings">Para Spacing</label>
                <span className="text-[10px] font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">{settings.paragraphSpacing}pt</span>
              </div>
              <input
                type="range"
                min={4}
                max={32}
                step={2}
                value={settings.paragraphSpacing}
                onChange={(e) => updateSetting('paragraphSpacing', parseInt(e.target.value))}
                className="w-full accent-slate-800 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Header / Footer */}
        <div className="grid grid-cols-2 gap-4 pt-5 border-t border-slate-100">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600" title="Title or course name displayed at the top of every generated page">Header Text</label>
            <input
              type="text"
              placeholder="e.g. CS101 Final Assignment"
              value={settings.headerText}
              onChange={(e) => updateSetting('headerText', e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-slate-800 focus:border-slate-800 transition-shadow"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600" title="Your name, roll metadata, or info displayed at the bottom of every page">Footer Text</label>
            <input
              type="text"
              placeholder="e.g. John Doe - ID: 123456"
              value={settings.footerText}
              onChange={(e) => updateSetting('footerText', e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-slate-800 focus:border-slate-800 transition-shadow"
            />
          </div>
          <div className="space-y-1.5 col-span-2">
            <label className="text-xs font-medium text-slate-600" title="Change the highlight color used for section headings like 'Code' and 'Output'">Heading Color</label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={settings.headingColor}
                onChange={(e) => updateSetting('headingColor', e.target.value)}
                className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer"
              />
              <span className="text-xs font-mono text-slate-500 uppercase">{settings.headingColor}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
