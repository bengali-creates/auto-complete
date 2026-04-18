'use client';

import { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { PDFDocument } from './pdf-document';
import { SolvedQuestion, PDFLayoutSettings, AssignmentType } from '@/types';

interface PDFPreviewProps {
  questions: SolvedQuestion[];
  settings: PDFLayoutSettings;
  assignmentType?: AssignmentType;
}

export function PDFPreview({ questions, settings, assignmentType = 'Code' }: PDFPreviewProps) {
  const componentRef = useRef<HTMLDivElement>(null);
  const [isPrinting, setIsPrinting] = useState(false);

  // Convert px to mm (1px ≈ 0.264583mm at 96dpi)
  const pxToMm = (px: number) => Math.round(px * 0.264583);
  
  const marginTopMm = pxToMm(settings.pageMarginTop ?? 35);
  const marginBottomMm = pxToMm(settings.pageMarginBottom ?? 35);
  const marginSideMm = pxToMm(settings.pageMargin ?? 35);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: assignmentType === 'Code' ? 'code-assignment' : 'assignment',
    onBeforePrint: () => {
      setIsPrinting(true);
      return Promise.resolve();
    },
    onAfterPrint: () => {
      setIsPrinting(false);
    },
    // CRITICAL: This pageStyle is injected into the print iframe
    // It MUST define @page margins to apply to ALL printed pages
    pageStyle: `
      @page {
        size: A4 portrait;
        margin: ${marginTopMm}mm ${marginSideMm}mm ${marginBottomMm}mm ${marginSideMm}mm;
      }
      
      @media print {
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
          height: auto !important;
          overflow: visible !important;
        }
        
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        
        .pdf-document-root {
          width: 100% !important;
          max-width: none !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        
        .pdf-content-wrapper {
          padding: 0 !important;
          margin: 0 !important;
        }
      }
    `,
  });

  return (
    <div className="space-y-4">
      {/* Action Buttons */}
      <div className="flex gap-3 items-center">
        <button
          onClick={() => handlePrint()}
          disabled={isPrinting}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium disabled:opacity-50"
        >
          {isPrinting ? 'Preparing...' : '⬇️ Export to PDF / Print'}
        </button>
        <span className="text-sm text-gray-500">
          Margins: Top {marginTopMm}mm, Bottom {marginBottomMm}mm, Sides {marginSideMm}mm
        </span>
      </div>

      {/* Visual A4 Page Container */}
      <div className="flex justify-center bg-gray-200 p-8 rounded-lg overflow-y-auto max-h-[800px]">
        {/* Aspect Ratio A4 (210x297mm) approximate visual scale */}
        <div className="bg-white shadow-2xl rounded-sm w-full max-w-[210mm] min-h-[297mm]">
          <PDFDocument
            ref={componentRef}
            questions={questions}
            settings={settings}
            assignmentType={assignmentType}
          />
        </div>
      </div>
    </div>
  );
}