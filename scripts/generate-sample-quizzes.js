/**
 * Sample data generator for Explanation Quiz system
 * Use this to quickly add test data to your MongoDB
 *
 * Usage:
 * 1. Run this file: node scripts/generate-sample-quizzes.js
 * 2. Or call the endpoint manually with curl/Postman
 */

const sampleQuizzes = [
  {
    title: "Phrasal Verbs - Lesson 1",
    question: "Felix wollte seinen Augen nicht ___",
    context: ": Sein Fahrrad war weg!",
    category: "phrasen",
    options: [
      {
        text: "trauen",
        explanation:
          "seinen Augen nicht trauen: Das bedeutet, dass man etwas so Unglaubliches oder Schockierendes sieht, dass man denkt, man halluziniert oder sieht nicht richtig. (Không tin vào mắt mình).",
        isCorrect: true,
        commonMistake: "",
      },
      {
        text: "vertrauen",
        explanation:
          "Man benutzt „vertrauen" eher für Personen oder Institutionen (Ich vertraue meinem besten Freund). Man kann zwar seinem Bauchgefühl vertrauen, aber bei den Augen sagt man in dieser festen Redewendung immer „trauen".",
        isCorrect: false,
        commonMistake:
          "Viele Lerner verwechseln „trauen" und „vertrauen", aber in dieser Redewendung ist nur „trauen" korrekt.",
      },
      {
        text: "verlassen",
        explanation:
          "„Sich auf jemanden verlassen" bedeutet „tin tưởng/dựa dẫm vào ai đó". Man kann sagen: „Ich kann mich auf meine Augen verlassen" (Mắt tôi vẫn còn tinh tường), aber das passt nicht in diesen negativen Kontext des Schocks.",
        isCorrect: false,
        commonMistake:
          "Obwohl „sich verlassen auf" auch mit Wahrnehmung zu tun haben kann, passt es nicht in diese Situation, wo es um Ungläubigkeit geht.",
      },
    ],
  },
  {
    title: "German Adjectives - Colors",
    question: "Das Auto ist ___",
    context: "Die farbe ist sehr hell.",
    category: "vocab",
    options: [
      {
        text: "blau",
        explanation:
          "Blau (blue) ist eine Farbe. Das Adjektiv beschreibt hier die Farbe des Autos.",
        isCorrect: false,
        commonMistake:
          "Nicht alle Adjektive, die eine Eigenschaft beschreiben, sind hier korrekt.",
      },
      {
        text: "rot",
        explanation:
          "Rot (red) ist eine Farbe. Es könnte theoretisch passen, aber die Kontextanase hilft hier.",
        isCorrect: false,
        commonMistake: "Der Kontext ist wichtig - es geht um 'hell' (bright).",
      },
      {
        text: "hell",
        explanation:
          "Hell bedeutet 'bright' oder 'light'. Das ist genau das richtige Wort für die Frage, da der Kontext spricht und die Farbe auch hell ist.",
        isCorrect: true,
        commonMistake: "",
      },
    ],
  },
  {
    title: "Grammar - Dative Case",
    question: "Ich gebe ___ (mein Freund) ein Buch.",
    context: "Personalne Dative use.",
    category: "grammar",
    options: [
      {
        text: "meinen Freund",
        explanation:
          "Das ist die Akkusativform. Wir brauchen den Dativ, weil das Verb 'geben' den indirekten Objekts im Dativ erfordert.",
        isCorrect: false,
        commonMistake:
          "Das ist ein häufiger Fehler - Lerner verwechseln oft Akkusativ und Dativ.",
      },
      {
        text: "meinem Freund",
        explanation:
          "Das ist die Dativform (mein → meinem, Freund → Freund). Das Verb 'geben' braucht Dativ für das indirekte Objekt.",
        isCorrect: true,
        commonMistake: "",
      },
      {
        text: "meines Freunds",
        explanation:
          "Das ist die Genitivform. Sie wird für 'von' verwendet, nicht für 'geben'.",
        isCorrect: false,
        commonMistake:
          "Genitivformen werden oft verwechselt, aber 'geben' braucht hier Dativ.",
      },
    ],
  },
];

// Script to add sample data
if (typeof window === "undefined") {
  // Node.js environment
  (async () => {
    try {
      for (const quiz of sampleQuizzes) {
        const response = await fetch("http://localhost:3000/api/explanation-quiz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(quiz),
        });

        if (response.ok) {
          const created = await response.json();
          console.log(`✓ Created: ${quiz.title}`);
        } else {
          console.error(`✗ Failed to create: ${quiz.title}`);
        }
      }
    } catch (err) {
      console.error("Error:", err);
    }
  })();
}

export { sampleQuizzes };
