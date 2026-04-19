'use client';

import { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { PDFDocument } from './pdf-document';
import { SolvedQuestion, PDFLayoutSettings, AssignmentType } from '@/types';
import { Button } from './ui/button';

interface PDFPreviewProps {
  questions: SolvedQuestion[];
  settings: PDFLayoutSettings;
  assignmentType?: AssignmentType;
}

export function PDFPreview({ questions, settings, assignmentType = 'Code' }: PDFPreviewProps) {
  const componentRef = useRef<HTMLDivElement>(null);
  const [isPrinting, setIsPrinting] = useState(false);

  
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
    <div className="space-y-4 ">
      
      <div className="flex flex-col items-center">
        <Button
          onClick={() => handlePrint()}
          disabled={isPrinting}
          variant="default"
          className="px-4 py-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium disabled:opacity-50"
        >
          {isPrinting ? 'Preparing...' : '⬇️ Export to PDF / Print'}
        </Button>
       <div className="flex items-start gap-2 bg-amber-50 border border-amber-300 text-amber-800 text-sm rounded-lg px-4 py-2.5">
          <span className="text-base mt-0.5">⚠️</span>
          <span>
            <strong>Important:</strong> In the print dialog that opens, set{' '}
            <strong>Margins → Default</strong>. This ensures your custom margins
            ({marginSideMm}mm sides, {marginTopMm}mm top, {marginBottomMm}mm bottom)
            are applied correctly on every page. If left on "None", the
            browser does not add any margins.
          </span>
        </div>
      </div>

      
      <div className="flex justify-center  p-2 rounded-lg overflow-y-auto max-h-[800px]">
        
        <div className=" shadow-2xl rounded-sm w-full max-w-[210mm] min-h-[297mm]">
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