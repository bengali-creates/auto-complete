'use client';

import { useState, useEffect } from 'react';
import { PDFDownloadLink, PDFViewer, BlobProvider } from '@react-pdf/renderer';
import { PDFDocument } from './pdf-document';
import { SolvedQuestion, PDFLayoutSettings, AssignmentType } from '@/types';

interface PDFPreviewProps {
  questions: SolvedQuestion[];
  settings: PDFLayoutSettings;
  assignmentType?: AssignmentType;
}

export function PDFPreview({ questions, settings, assignmentType = 'Code' }: PDFPreviewProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
        <div className="text-gray-500">Loading PDF preview...</div>
      </div>
    );
  }

  const document = <PDFDocument questions={questions} settings={settings} assignmentType={assignmentType} />;

  return (
    <div className="space-y-4">
      {/* Action Buttons */}
      <div className="flex gap-3">
        <PDFDownloadLink
          document={document}
          fileName={assignmentType === 'Code' ? "code-assignment.pdf" : "assignment.pdf"}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
        >
          {({ loading }) => (loading ? 'Generating...' : '⬇️ Download PDF')}
        </PDFDownloadLink>

        <BlobProvider document={document}>
          {({ url, loading }) => (
            <button
              onClick={() => {
                if (url) {
                  const printWindow = window.open(url, '_blank');
                  printWindow?.addEventListener('load', () => {
                    printWindow.print();
                  });
                }
              }}
              disabled={loading}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors font-medium disabled:opacity-50"
            >
              {loading ? 'Preparing...' : '🖨️ Print'}
            </button>
          )}
        </BlobProvider>
      </div>

      {/* PDF Viewer */}
      <div className="border border-gray-200 rounded-lg overflow-hidden shadow-lg">
        <PDFViewer width="100%" height={600} showToolbar={false}>
          {document}
        </PDFViewer>
      </div>
    </div>
  );
}
