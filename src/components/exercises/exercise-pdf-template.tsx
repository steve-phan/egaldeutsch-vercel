import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { QuizQuestion } from '@/types/quiz';

// Define styles
const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#334155',
    backgroundColor: '#FFFFFF',
  },
  header: {
    marginBottom: 30,
    borderBottom: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  brandContainer: {
    flexDirection: 'column',
  },
  brand: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  url: {
    fontSize: 9,
    color: '#E30010',
    fontWeight: 'bold',
    marginTop: 2,
  },
  meta: {
    fontSize: 10,
    color: '#64748B',
    textAlign: 'right',
  },
  titleContainer: {
    marginBottom: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#0F172A',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: 'medium',
  },
  questionContainer: {
    marginBottom: 20,
    paddingLeft: 5,
  },
  questionHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  questionNum: {
    fontSize: 12,
    fontWeight: 'bold',
    width: 25,
    color: '#0F172A',
  },
  questionText: {
    fontSize: 12,
    fontWeight: 'bold',
    flex: 1,
    color: '#0F172A',
    lineHeight: 1.4,
  },
  optionsContainer: {
    marginLeft: 25,
  },
  option: {
    fontSize: 11,
    marginBottom: 6,
    color: '#475569',
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 12,
    height: 12,
    border: 1,
    borderColor: '#CBD5E1',
    marginRight: 8,
    borderRadius: 2,
  },
  fillLine: {
    borderBottom: 1,
    borderBottomColor: '#94A3B8',
    width: 150,
    marginTop: 10,
    marginLeft: 25,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 50,
    right: 50,
    textAlign: 'center',
    fontSize: 9,
    color: '#94A3B8',
    borderTop: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 15,
  },
  answerKeyHeader: {
    marginTop: 20,
    paddingTop: 30,
    borderTop: 2,
    borderTopColor: '#F1F5F9',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#0F172A',
  },
  answerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  answerItem: {
    width: '48%',
    marginBottom: 15,
    paddingRight: '2%',
  },
  answerRow: {
    flexDirection: 'row',
    marginBottom: 4,
    alignItems: 'center',
  },
  answerLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    width: 25,
    color: '#0F172A',
  },
  answerText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#E30010',
  },
  explanation: {
    fontSize: 9,
    color: '#64748B',
    marginLeft: 25,
    lineHeight: 1.4,
  }
});

interface Props {
  questions: QuizQuestion[];
  category: string;
  level: string;
}

export const ExercisePDFTemplate = ({ questions, category, level }: Props) => (
  <Document title={`EgalDeutsch - ${category} ${level}`}>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.brandContainer}>
          <Text style={styles.brand}>EgalDeutsch</Text>
          <Text style={styles.url}>https://egaldeutsch.com</Text>
        </View>
        <View>
          <Text style={styles.meta}>Übungsmaterial</Text>
          <Text style={styles.meta}>{new Date().toLocaleDateString('de-DE')}</Text>
        </View>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>
          {category.includes(' ') 
            ? category 
            : category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
        </Text>
        <Text style={styles.subtitle}>Level: {level} • {questions.length} Aufgaben</Text>
      </View>

      {/* Questions */}
      {questions.map((q, index) => (
        <View key={q.id} style={styles.questionContainer} wrap={false}>
          <View style={styles.questionHeader}>
            <Text style={styles.questionNum}>{index + 1}.</Text>
            <Text style={styles.questionText}>{q.prompt_de}</Text>
          </View>
          
          {q.options && q.options.length > 0 ? (
            <View style={styles.optionsContainer}>
              {q.options.map((opt, i) => (
                <View key={i} style={styles.option}>
                  <View style={styles.checkbox} />
                  <Text>{opt}</Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.fillLine} />
          )}
        </View>
      ))}

      {/* Answer Key on New Page */}
      <View break>
        <Text style={styles.answerKeyHeader}>Lösungsschlüssel (Answer Key)</Text>
        <View style={styles.answerGrid}>
          {questions.map((q, index) => (
            <View key={q.id} style={styles.answerItem} wrap={false}>
              <View style={styles.answerRow}>
                <Text style={styles.answerLabel}>{index + 1}.</Text>
                <Text style={styles.answerText}>{q.correct_answer}</Text>
              </View>
              <Text style={styles.explanation}>{q.explanation_de}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Footer */}
      <Text style={styles.footer} fixed>
        EgalDeutsch - Deine Plattform für einfaches Deutschlernen • https://egaldeutsch.com
      </Text>
    </Page>
  </Document>
);
