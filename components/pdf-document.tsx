'use client';

import React from 'react';
import { SolvedQuestion, PDFLayoutSettings, AssignmentType } from '@/types';

interface PDFDocumentProps {
  questions: SolvedQuestion[];
  settings: PDFLayoutSettings;
  assignmentType?: AssignmentType;
}

function CodeWithLineNumbers({
  code,
  showLineNumbers,
  fontSize,
}: {
  code: string;
  showLineNumbers: boolean;
  fontSize: number;
}) {
  const lines = code.split('\n');

  if (!showLineNumbers) {
    return <>{code}</>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {lines.map((line, index) => (
        <div key={index} style={{ display: 'flex', flexDirection: 'row' }}>
          <span
            style={{
              color: '#9ca3af',
              marginRight: '8px',
              minWidth: '16px',
              textAlign: 'right',
              fontSize: `${fontSize - 2}px`,
              userSelect: 'none',
            }}
          >
            {index + 1}
          </span>
          <span style={{ flex: 1 }}>{line || ' '}</span>
        </div>
      ))}
    </div>
  );
}

function QuestionSideBySide({
  question,
  settings,
  assignmentType = 'Code',
}: {
  question: SolvedQuestion;
  settings: PDFLayoutSettings;
  assignmentType?: AssignmentType;
}) {
  const marginBottom = settings.spacingStyle === 'compact' ? '10px' : settings.spacingStyle === 'spacious' ? '30px' : '20px';
  const dividerMargin = settings.spacingStyle === 'compact' ? '10px' : '20px';

  return (
    <div
      style={{
        marginBottom,
        clear: 'both',
        pageBreakInside: 'auto',
      }}
    >
      <div
        style={{
          fontSize: `${settings.fontSize - 1}px`,
          color: '#333',
          marginBottom: `${settings.paragraphSpacing ?? 10}px`,
          lineHeight: settings.lineHeight ?? 1.4,
          whiteSpace: 'pre-wrap',
        }}
      >
        {question.problemStatement}
      </div>

      <div>
        
        {question.output && (
          <div
            style={{
              backgroundColor: '#ffffff',
              padding: settings.spacingStyle === 'compact' ? '6px' : '10px',
              borderRadius: '4px',
              fontFamily: 'Courier, monospace',
              fontSize: `${settings.fontSize - 2}px`,
              color: '#1a1a1a',
              border: '1px dashed #d1d5db',
              lineHeight: settings.lineHeight ?? 1.4,
              float: 'right',
              width: '40%',
              marginLeft: '15px',
              marginBottom: '10px',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
            }}
          >
            <div
              style={{
                fontSize: `${settings.fontSize - 1}px`,
                fontWeight: 'bold',
                color: settings.headingColor || '#c75000',
                marginBottom: '6px',
              }}
            >
              Output
            </div>
            <div>{question.output}</div>
            {settings.showExplanation && question.explanation && (
              <>
                <div
                  style={{
                    fontSize: `${settings.fontSize - 1}px`,
                    fontWeight: 'bold',
                    color: settings.headingColor || '#c75000',
                    marginBottom: '6px',
                    marginTop: '12px',
                  }}
                >
                  Explanation
                </div>
                <div
                  style={{
                    fontSize: `${settings.fontSize - 1}px`,
                    color: '#444',
                    lineHeight: settings.lineHeight ?? 1.4,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {question.explanation}
                </div>
              </>
            )}
          </div>
        )}

        
        <div>
          <div
            style={{
              fontSize: `${settings.fontSize - 1}px`,
              fontWeight: 'bold',
              color: settings.headingColor || '#c75000',
              marginBottom: '6px',
              marginTop: '10px',
            }}
          >
            {assignmentType === 'Code' ? 'Code' : 'Answer'}
          </div>
          <div
            style={{
              padding: settings.spacingStyle === 'compact' ? '2px' : '4px',
              fontFamily: 'Courier, monospace',
              fontSize: `${settings.fontSize - 2}px`,
              color: '#1a1a1a',
              lineHeight: settings.lineHeight ?? 1.4,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
            }}
          >
            <CodeWithLineNumbers
              code={question.code}
              showLineNumbers={settings.showLineNumbers}
              fontSize={settings.fontSize}
            />
          </div>
        </div>
      </div>

      <div
        style={{
          borderBottom: '1px solid #eee',
          marginTop: dividerMargin,
          marginBottom: dividerMargin,
          clear: 'both',
        }}
      />
    </div>
  );
}

function QuestionStacked({
  question,
  settings,
  assignmentType = 'Code',
}: {
  question: SolvedQuestion;
  settings: PDFLayoutSettings;
  assignmentType?: AssignmentType;
}) {
  const marginBottom = settings.spacingStyle === 'compact' ? '10px' : settings.spacingStyle === 'spacious' ? '30px' : '20px';
  const dividerMargin = settings.spacingStyle === 'compact' ? '10px' : '20px';

  return (
    <div
      style={{
        marginBottom,
        clear: 'both',
        pageBreakInside: 'auto',
      }}
    >
      <div
        style={{
          fontSize: `${settings.fontSize - 1}px`,
          color: '#333',
          marginBottom: `${settings.paragraphSpacing ?? 10}px`,
          lineHeight: settings.lineHeight ?? 1.4,
          whiteSpace: 'pre-wrap',
        }}
      >
        {question.problemStatement}
      </div>

      <div
        style={{
          fontSize: `${settings.fontSize - 1}px`,
          fontWeight: 'bold',
          color: settings.headingColor || '#c75000',
          marginBottom: '6px',
          marginTop: '10px',
        }}
      >
        {assignmentType === 'Code' ? 'Code' : 'Answer'}
      </div>
      <div
        style={{
          padding: settings.spacingStyle === 'compact' ? '2px' : '4px',
          fontFamily: 'Courier, monospace',
          fontSize: `${settings.fontSize - 2}px`,
          color: '#1a1a1a',
          lineHeight: settings.lineHeight ?? 1.4,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all',
        }}
      >
        <CodeWithLineNumbers
          code={question.code}
          showLineNumbers={settings.showLineNumbers}
          fontSize={settings.fontSize}
        />
      </div>

      {question.output && (
        <>
          <div
            style={{
              fontSize: `${settings.fontSize - 1}px`,
              fontWeight: 'bold',
              color: settings.headingColor || '#c75000',
              marginBottom: '6px',
              marginTop: '10px',
            }}
          >
            Output
          </div>
          <div
            style={{
              backgroundColor: '#ffffff',
              padding: settings.spacingStyle === 'compact' ? '6px' : '10px',
              borderRadius: '4px',
              fontFamily: 'Courier, monospace',
              fontSize: `${settings.fontSize - 2}px`,
              color: '#1a1a1a',
              border: '1px dashed #d1d5db',
              lineHeight: settings.lineHeight ?? 1.4,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
            }}
          >
            {question.output}
          </div>
        </>
      )}

      {settings.showExplanation && question.explanation && (
        <>
          <div
            style={{
              fontSize: `${settings.fontSize - 1}px`,
              fontWeight: 'bold',
              color: settings.headingColor || '#c75000',
              marginBottom: '6px',
              marginTop: '10px',
            }}
          >
            Explanation
          </div>
          <div
            style={{
              fontSize: `${settings.fontSize - 1}px`,
              color: '#444',
              lineHeight: settings.lineHeight ?? 1.4,
              whiteSpace: 'pre-wrap',
            }}
          >
            {question.explanation}
          </div>
        </>
      )}

      <div
        style={{
          borderBottom: '1px solid #eee',
          marginTop: dividerMargin,
          marginBottom: dividerMargin,
          clear: 'both',
        }}
      />
    </div>
  );
}

export const PDFDocument = React.forwardRef<HTMLDivElement, PDFDocumentProps>(
  ({ questions, settings, assignmentType = 'Code' }, ref) => {
    const QuestionComponent = settings.layoutStyle === 'side-by-side' ? QuestionSideBySide : QuestionStacked;

    
    const marginTopMm = Math.round((settings.pageMarginTop ?? 35) * 0.264583);
    const marginBottomMm = Math.round((settings.pageMarginBottom ?? 35) * 0.264583);
    const marginSideMm = Math.round((settings.pageMargin ?? 35) * 0.264583);

    return (
        <div ref={ref} className="pdf-document-root">
          {/*
            CRITICAL: Style tag MUST be inside the ref div so react-to-print
            includes it in the print iframe. @page margins are the ONLY way
            to get margins on every printed page (padding only affects first/last).
          */}
          <style
            dangerouslySetInnerHTML={{
              __html: `
                @page {
                  size: A4 portrait;
                  margin: ${marginTopMm}mm ${marginSideMm}mm ${marginBottomMm}mm ${marginSideMm}mm;
                }

                @media print {
                  *, *::before, *::after {
                    box-sizing: border-box;
                  }

                  html, body {
                    margin: 0 !important;
                    padding: 0 !important;
                    width: 100% !important;
                    height: auto !important;
                  }

                  * {
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                    color-adjust: exact !important;
                  }

                  .pdf-document-root {
                    margin: 0 !important;
                    padding: 0 !important;
                    width: 100% !important;
                    max-width: none !important;
                  }

                  
                  .pdf-content-wrapper {
                    padding: 0 !important;
                    margin: 0 !important;
                  }
                }

                @media screen {
                  .pdf-document-root {
                    width: 100%;
                    max-width: 210mm;
                    margin: 0 auto;
                    background-color: white;
                  }

                  .pdf-content-wrapper {
                    padding-top: ${settings.pageMarginTop ?? 35}px;
                    padding-bottom: ${settings.pageMarginBottom ?? 35}px;
                    padding-left: ${settings.pageMargin ?? 35}px;
                    padding-right: ${settings.pageMargin ?? 35}px;
                  }
                }
              `,
            }}
          />

          <div
            className="pdf-content-wrapper"
            style={{
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontSize: `${settings.fontSize}px`,
              backgroundColor: 'white',
            }}
          >
            
            {settings.headerText && (
              <div
                style={{
                  fontSize: '10px',
                  color: '#666',
                  marginBottom: '15px',
                  paddingBottom: '8px',
                  borderBottom: '1px solid #ddd',
                }}
              >
                {settings.headerText}
              </div>
            )}

            
            {questions.map((q) => (
              <QuestionComponent
                key={q.questionNumber}
                question={q}
                settings={settings}
                assignmentType={assignmentType}
              />
            ))}

            
            {settings.footerText && (
              <div
                style={{
                  paddingTop: '10px',
                  marginTop: '20px',
                  borderTop: '1px solid #ddd',
                  fontSize: '9px',
                  color: '#888',
                  textAlign: 'center',
                }}
              >
                {settings.footerText}
              </div>
            )}
          </div>
        </div>
    );
  }
);

PDFDocument.displayName = 'PDFDocument';