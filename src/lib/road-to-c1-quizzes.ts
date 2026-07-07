export type RoadToC1QuizQuestion = {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
};

export type RoadToC1Quiz = {
  title: string;
  description: string;
  questions: RoadToC1QuizQuestion[];
};

const quizzes: Record<string, RoadToC1Quiz> = {
  "kapitel-1-was-bedeutet-c1-wirklich": {
    title: "Kapitel-Check: Was bedeutet C1?",
    description:
      "Prüfe, ob du den Unterschied zwischen Fehlerfreiheit und C1-Kommunikation verstanden hast.",
    questions: [
      {
        question: "Was beschreibt C1 am besten?",
        options: [
          "Man macht gar keine Fehler mehr.",
          "Man kann komplexe Gedanken klar und angemessen ausdrücken.",
          "Man kennt jedes deutsche Wort.",
        ],
        answerIndex: 1,
        explanation:
          "C1 bedeutet nicht Perfektion, sondern klare, strukturierte und differenzierte Kommunikation.",
      },
      {
        question: "Welche Formulierung klingt eher nach C1?",
        options: [
          "Ich finde Homeoffice gut.",
          "Homeoffice ist gut, weil praktisch.",
          "Homeoffice bietet vor allem deshalb Vorteile, weil Beschäftigte flexibler arbeiten können.",
        ],
        answerIndex: 2,
        explanation:
          "Die dritte Antwort ist präziser, begründet klar und nutzt eine reifere Satzstruktur.",
      },
      {
        question: "Welcher Bereich ist für C1 besonders wichtig?",
        options: [
          "Nur Grammatikregeln auswendig lernen.",
          "Gedanken strukturieren und sprachlich variieren.",
          "Immer möglichst lange Sätze benutzen.",
        ],
        answerIndex: 1,
        explanation:
          "C1 lebt von Struktur, Präzision, aktivem Wortschatz und Flexibilität.",
      },
    ],
  },
  "kapitel-2-der-unterschied-zwischen-b2-und-c1": {
    title: "Kapitel-Check: B2 oder C1?",
    description:
      "Erkenne, welche Formulierungen reifer, präziser und prüfungsnäher wirken.",
    questions: [
      {
        question: "Welche Aussage ist stärker auf C1-Niveau?",
        options: [
          "Viele Leute haben Stress.",
          "Beruflicher Stress stellt für viele Beschäftigte eine erhebliche Belastung dar.",
          "Stress ist schlecht.",
        ],
        answerIndex: 1,
        explanation:
          "Diese Antwort nutzt Bildungssprache und formuliert die Aussage präziser.",
      },
      {
        question: "Was ist ein typischer Schritt von B2 zu C1?",
        options: [
          "Von einfachen Meinungen zu differenzierten Positionen.",
          "Von langen Texten zu sehr kurzen Antworten.",
          "Von Grammatik zu gar keiner Grammatik.",
        ],
        answerIndex: 0,
        explanation:
          "C1 verlangt, dass du Vorteile, Nachteile, Bedingungen und Einschränkungen ausdrücken kannst.",
      },
      {
        question: "Welche Formulierung ist zu allgemein für C1?",
        options: [
          "Meiner Ansicht nach gehört der Klimaschutz zu den zentralen Herausforderungen.",
          "Klimaschutz ist wichtig.",
          "Es spricht vieles dafür, stärker in Klimaschutz zu investieren.",
        ],
        answerIndex: 1,
        explanation:
          "Die Aussage ist verständlich, aber für C1 zu kurz und wenig differenziert.",
      },
    ],
  },
  "kapitel-3-dein-6-stunden-lernsystem": {
    title: "Kapitel-Check: Lernsystem",
    description:
      "Teste, ob du aus sechs Stunden Lernen wirklich ein System machst.",
    questions: [
      {
        question: "Warum sind drei Blöcke à zwei Stunden sinnvoll?",
        options: [
          "Weil man dadurch Lesen, Output und Wiederholung trennen kann.",
          "Weil man sechs Stunden ohne Pause lernen sollte.",
          "Weil Grammatik dadurch unwichtig wird.",
        ],
        answerIndex: 0,
        explanation:
          "Getrennte Blöcke verhindern Überforderung und geben jedem Skill einen klaren Platz.",
      },
      {
        question: "Was ist beim Lesen auf C1 besonders wichtig?",
        options: [
          "Jedes unbekannte Wort sofort übersetzen.",
          "Zuerst den roten Faden und die Struktur verstehen.",
          "Nur einfache Texte lesen.",
        ],
        answerIndex: 1,
        explanation:
          "C1-Lesen beginnt global. Details kommen erst nach Thema, Struktur und Hauptaussage.",
      },
      {
        question: "Welche Aktivität macht Wortschatz aktiv?",
        options: [
          "Eine Liste einmal ansehen.",
          "Ausdrücke in eigenen Sätzen und Vorträgen verwenden.",
          "Nur Übersetzungen sammeln.",
        ],
        answerIndex: 1,
        explanation:
          "Aktiver Wortschatz entsteht durch Produktion: schreiben, sprechen, wiederholen.",
      },
    ],
  },
  "kapitel-4-der-aktive-c1-wortschatz": {
    title: "Kapitel-Check: Aktiver Wortschatz",
    description:
      "Übe den Unterschied zwischen passivem Wissen und echter Verwendung.",
    questions: [
      {
        question: "Was ist ein aktiver Ausdruck?",
        options: [
          "Ein Wort, das du irgendwo gesehen hast.",
          "Ein Ausdruck, den du korrekt in eigenen Sätzen nutzen kannst.",
          "Ein Wort, das du nur übersetzen kannst.",
        ],
        answerIndex: 1,
        explanation:
          "Aktiv bedeutet: Du kannst den Ausdruck beim Schreiben oder Sprechen abrufen.",
      },
      {
        question: "Welche Notiz ist am hilfreichsten?",
        options: [
          "Maßnahme = measure",
          "eine Maßnahme ergreifen + eigener Beispielsatz",
          "Maßnahme",
        ],
        answerIndex: 1,
        explanation:
          "C1-Wortschatz sollte als Verbindung mit Kontext gelernt werden.",
      },
      {
        question: "Was solltest du mit neuen Ausdrücken tun?",
        options: [
          "Sie sammeln und nie wieder ansehen.",
          "Sie täglich in einem Satz, Text oder Vortrag benutzen.",
          "Sie nur farbig markieren.",
        ],
        answerIndex: 1,
        explanation:
          "Wiederholte Anwendung macht aus passivem Material aktive Sprache.",
      },
    ],
  },
  "kapitel-5-erste-c1-redemittel": {
    title: "Kapitel-Check: Redemittel",
    description:
      "Wähle passende Redemittel für Meinung, Argument, Gegenargument und Schluss.",
    questions: [
      {
        question: "Welches Redemittel führt eine eigene Meinung ein?",
        options: [
          "Meiner Ansicht nach …",
          "Andererseits darf man nicht außer Acht lassen, dass …",
          "Zusammenfassend lässt sich sagen, dass …",
        ],
        answerIndex: 0,
        explanation:
          "Mit „Meiner Ansicht nach“ positionierst du dich klar und angemessen.",
      },
      {
        question: "Welches Redemittel passt zu einem Gegenargument?",
        options: [
          "Ein zentraler Aspekt ist …",
          "Dem lässt sich entgegenhalten, dass …",
          "Daraus lässt sich schließen, dass …",
        ],
        answerIndex: 1,
        explanation:
          "Diese Formulierung zeigt, dass du die andere Seite einbeziehst.",
      },
      {
        question: "Was ist beim Lernen von Redemitteln wichtig?",
        options: [
          "Nur die Liste auswendig lernen.",
          "Jedes Redemittel in eigenen Themen verwenden.",
          "Immer möglichst komplizierte Redemittel benutzen.",
        ],
        answerIndex: 1,
        explanation:
          "Redemittel werden erst dann nützlich, wenn du sie flexibel anwenden kannst.",
      },
    ],
  },
  "kapitel-6-tagesaufgabe-fur-heute": {
    title: "Kapitel-Check: Tagesaufgabe",
    description:
      "Prüfe, ob deine Tagesaufgabe Input, Schreiben und Sprechen verbindet.",
    questions: [
      {
        question: "Warum ist Homeoffice ein gutes C1-Thema?",
        options: [
          "Weil man Vorteile, Nachteile und gesellschaftliche Veränderungen diskutieren kann.",
          "Weil es nur eine richtige Meinung dazu gibt.",
          "Weil man keine Argumente braucht.",
        ],
        answerIndex: 0,
        explanation:
          "Das Thema erlaubt differenzierte Argumentation, Beispiele und eine eigene Position.",
      },
      {
        question: "Was sollte dein Schreibtext enthalten?",
        options: [
          "Nur eine Meinung ohne Begründung.",
          "Eine klare Struktur und mehrere gelernte Ausdrücke.",
          "Nur einzelne Sätze aus der Wortschatzliste.",
        ],
        answerIndex: 1,
        explanation:
          "C1-Schreiben verbindet Struktur, Wortschatz und logische Argumente.",
      },
      {
        question: "Was ist eine gute Sprechstruktur?",
        options: [
          "Einleitung, Vorteile, Nachteile, eigene Meinung, Schluss.",
          "Meinung, Meinung, Meinung.",
          "Nur Beispiele ohne Schluss.",
        ],
        answerIndex: 0,
        explanation:
          "Diese Struktur hilft dir, ruhig und prüfungsnah zu sprechen.",
      },
    ],
  },
  "kapitel-7-deine-tagliche-fehlerliste": {
    title: "Kapitel-Check: Fehlerliste",
    description:
      "Teste, ob du Fehler nicht nur sammelst, sondern wirklich verwandelst.",
    questions: [
      {
        question: "Was gehört in eine gute Fehlerliste?",
        options: [
          "Fehler, Korrektur, Regel und ein neuer Beispielsatz.",
          "Nur der Fehler.",
          "Nur eine Übersetzung.",
        ],
        answerIndex: 0,
        explanation:
          "Nur mit Korrektur, Regel und Anwendung lernst du nachhaltig.",
      },
      {
        question: "Welche Korrektur ist richtig?",
        options: [
          "Ich interessiere mich über Politik.",
          "Ich interessiere mich für Politik.",
          "Ich interessiere mich an Politik.",
        ],
        answerIndex: 1,
        explanation:
          "Es heißt: sich interessieren für + Akkusativ.",
      },
      {
        question: "Was solltest du nach dem Notieren eines Fehlers tun?",
        options: [
          "Den Fehler vergessen.",
          "Den Fehler in den nächsten Tagen aktiv vermeiden und neue Sätze bilden.",
          "Nur die Tabelle schöner formatieren.",
        ],
        answerIndex: 1,
        explanation:
          "Fehleranalyse wirkt erst durch Wiederholung und aktive Korrektur.",
      },
    ],
  },
};

export function getRoadToC1Quiz(slug: string) {
  return quizzes[slug] || null;
}
