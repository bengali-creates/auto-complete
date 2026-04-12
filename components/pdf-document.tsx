'use client';

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';
import { SolvedQuestion, PDFLayoutSettings, AssignmentType } from '@/types';


const getStyles = (settings: PDFLayoutSettings) =>
  StyleSheet.create({
    page: {
      padding: settings.pageMargin ?? 35,
      fontFamily: 'Helvetica',
      fontSize: settings.fontSize,
    },
    header: {
      fontSize: 10,
      color: '#666',
      marginBottom: 15,
      paddingBottom: 8,
      borderBottom: '1px solid #ddd',
    },
    footer: {
      position: 'absolute',
      bottom: 20,
      left: 35,
      right: 35,
      fontSize: 9,
      color: '#888',
      textAlign: 'center',
    },
    questionContainer: {
      marginBottom: settings.spacingStyle === 'compact' ? 10 : settings.spacingStyle === 'spacious' ? 30 : 20,
    },
    questionTitle: {
      display: 'none',
    },
    problemStatement: {
      fontSize: settings.fontSize - 1,
      color: '#333',
      marginBottom: settings.paragraphSpacing ?? 10,
      lineHeight: settings.lineHeight ?? 1.4,
    },
    sectionLabel: {
      fontSize: settings.fontSize - 1,
      fontWeight: 'bold',
      color: settings.headingColor || '#c75000',
      marginBottom: 6,
      marginTop: 10,
    },
    codeBlock: {
      padding: settings.spacingStyle === 'compact' ? 2 : 4,
      fontFamily: 'Courier',
      fontSize: settings.fontSize - 2,
      color: '#1a1a1a',
      lineHeight: settings.lineHeight ?? 1.4,
    },
    outputBlock: {
      backgroundColor: '#ffffff',
      padding: settings.spacingStyle === 'compact' ? 6 : 10,
      borderRadius: 4,
      fontFamily: 'Courier',
      fontSize: settings.fontSize - 2,
      color: '#1a1a1a',
      border: '1px dashed #d1d5db',
      lineHeight: settings.lineHeight ?? 1.4,
    },
    explanation: {
      fontSize: settings.fontSize - 1,
      color: '#444',
      lineHeight: settings.lineHeight ?? 1.4,
    },
    // Side-by-side layout
    sideBySideContainer: {
      flexDirection: 'row',
      gap: settings.spacingStyle === 'compact' ? 8 : 16,
    },
    sideBySideColumn: {
      flex: 1,
    },
    divider: {
      borderBottom: '1px solid #eee',
      marginTop: settings.spacingStyle === 'compact' ? 10 : 20,
      marginBottom: settings.spacingStyle === 'compact' ? 10 : 20,
    },
    lineNumber: {
      color: '#6c7086',
      marginRight: 10,
      minWidth: 20,
      textAlign: 'right',
    },
    codeLine: {
      flexDirection: 'row',
    },
  });

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
    return <Text>{code}</Text>;
  }

  return (
    <View>
      {lines.map((line, index) => (
        <View key={index} style={{ flexDirection: 'row' }}>
          <Text style={{ color: '#9ca3af', marginRight: 8, minWidth: 16, textAlign: 'right', fontSize: fontSize - 2 }}>
            {index + 1}
          </Text>
          <Text style={{ flex: 1 }}>{line || ' '}</Text>
        </View>
      ))}
    </View>
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
  const styles = getStyles(settings);

  return (
    <View style={styles.questionContainer} wrap={true}>
      <Text style={styles.problemStatement}>{question.problemStatement}</Text>

      <View style={styles.sideBySideContainer}>
        {/* Code Column */}
        <View style={styles.sideBySideColumn}>
          <Text style={styles.sectionLabel}>{assignmentType === 'Code' ? 'Code' : 'Answer'}</Text>
          <View style={styles.codeBlock}>
            <CodeWithLineNumbers
              code={question.code}
              showLineNumbers={settings.showLineNumbers}
              fontSize={settings.fontSize}
            />
          </View>
        </View>

        {/* Output Column */}
        {question.output && (
          <View style={styles.sideBySideColumn}>
            <Text style={styles.sectionLabel}>Output</Text>
            <View style={styles.outputBlock}>
              <Text>{question.output}</Text>
            </View>
            {settings.showExplanation && question.explanation && (
              <>
                <Text style={[styles.sectionLabel, { marginTop: 12 }]}>Explanation</Text>
                <Text style={styles.explanation}>{question.explanation}</Text>
              </>
            )}
          </View>
        )}
      </View>

      <View style={styles.divider} />
    </View>
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
  const styles = getStyles(settings);

  return (
    <View style={styles.questionContainer} wrap={true}>
      <Text style={styles.problemStatement}>{question.problemStatement}</Text>

      <Text style={styles.sectionLabel}>{assignmentType === 'Code' ? 'Code' : 'Answer'}</Text>
      <View style={styles.codeBlock}>
        <CodeWithLineNumbers
          code={question.code}
          showLineNumbers={settings.showLineNumbers}
          fontSize={settings.fontSize}
        />
      </View>

      {question.output && (
        <>
          <Text style={styles.sectionLabel}>Output</Text>
          <View style={styles.outputBlock}>
            <Text>{question.output}</Text>
          </View>
        </>
      )}

      {settings.showExplanation && question.explanation && (
        <>
          <Text style={styles.sectionLabel}>Explanation</Text>
          <Text style={styles.explanation}>{question.explanation}</Text>
        </>
      )}

      <View style={styles.divider} />
    </View>
  );
}

export function PDFDocument({ questions, settings, assignmentType = 'Code' }: PDFDocumentProps) {
  const styles = getStyles(settings);
  const QuestionComponent = settings.layoutStyle === 'side-by-side' ? QuestionSideBySide : QuestionStacked;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        {settings.headerText && (
          <View style={styles.header}>
            <Text>{settings.headerText}</Text>
          </View>
        )}

        {/* Questions */}
        {questions.map((q) => (
          <QuestionComponent key={q.questionNumber} question={q} settings={settings} assignmentType={assignmentType} />
        ))}

        {/* Footer with page numbers */}
        {(settings.footerText || settings.showPageNumbers) && (
          <View style={styles.footer} fixed>
            <Text>
              {settings.footerText}
              {settings.showPageNumbers && (
                <Text render={({ pageNumber, totalPages }) => ` | Page ${pageNumber} of ${totalPages}`} />
              )}
            </Text>
          </View>
        )}
      </Page>
    </Document>
  );
}
