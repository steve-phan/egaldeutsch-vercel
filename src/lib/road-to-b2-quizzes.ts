export type RoadToB2QuizQuestion = {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
};

export type RoadToB2Quiz = {
  title: string;
  description: string;
  questions: RoadToB2QuizQuestion[];
};

type QuizConfig = {
  slug: string;
  chapter: number;
  topic: string;
  coreIdea: string;
  bestPractice: string;
  commonMistake: string;
};

const quizConfigs: QuizConfig[] = [
  {
    slug: "kapitel-1-was-bedeutet-b2-wirklich",
    chapter: 1,
    topic: "Was bedeutet B2 wirklich?",
    coreIdea: "B2 bedeutet, dass du deine Meinung klar begründen und längere Gedanken verständlich verbinden kannst.",
    bestPractice: "Formuliere eine eigene Meinung mit mindestens zwei Gründen und einem konkreten Beispiel.",
    commonMistake: "Nur einzelne Alltagssätze zu benutzen, ohne Argumente logisch zu verbinden.",
  },
  {
    slug: "kapitel-2-der-unterschied-zwischen-b1-und-b2",
    chapter: 2,
    topic: "Der Unterschied zwischen B1 und B2",
    coreIdea: "Auf B2 erklärst du nicht nur, was du meinst, sondern auch warum, unter welcher Bedingung und mit welcher Einschränkung.",
    bestPractice: "Vergleiche eine einfache B1-Antwort mit einer ausführlicheren B2-Version.",
    commonMistake: "B2 nur als mehr Grammatik zu verstehen und die Textstruktur zu vergessen.",
  },
  {
    slug: "kapitel-3-die-wichtigsten-grammatik-baustellen-auf-dem-weg-zu-b2",
    chapter: 3,
    topic: "Die wichtigsten Grammatik-Baustellen",
    coreIdea: "B2-Grammatik hilft dir, komplexere Beziehungen zwischen Ideen präzise auszudrücken.",
    bestPractice: "Sammle typische Fehler und schreibe jeden Satz korrekt mit einer kurzen Begründung neu.",
    commonMistake: "Viele Regeln passiv zu lesen, ohne eigene Beispielsätze zu bilden.",
  },
  {
    slug: "kapitel-4-satzbau-sicher-beherrschen",
    chapter: 4,
    topic: "Satzbau sicher beherrschen",
    coreIdea: "Sicherer Satzbau sorgt dafür, dass deine Aussagen auch bei längeren Sätzen verständlich bleiben.",
    bestPractice: "Baue kurze Sätze mit Konnektoren zu klaren Haupt- und Nebensatzstrukturen aus.",
    commonMistake: "Das Verb in Nebensätzen oder nach Vorfeld-Elementen falsch zu platzieren.",
  },
  {
    slug: "kapitel-5-wortschatz-aktiv-lernen",
    chapter: 5,
    topic: "Wortschatz aktiv lernen",
    coreIdea: "Aktiver Wortschatz ist Wortschatz, den du selbst schnell und korrekt verwenden kannst.",
    bestPractice: "Lerne Ausdrücke in kleinen Satzmustern und benutze sie direkt in eigenen Antworten.",
    commonMistake: "Wörter nur zu übersetzen, statt sie mit Kontext und Kollokationen zu lernen.",
  },
  {
    slug: "kapitel-6-nebensatze-mit-weil-dass-obwohl-wenn",
    chapter: 6,
    topic: "Nebensätze mit weil, dass, obwohl, wenn",
    coreIdea: "Nebensätze zeigen Gründe, Gegensätze, Bedingungen und Inhalte präzise an.",
    bestPractice: "Schreibe vier Sätze zum gleichen Thema, jeweils mit weil, dass, obwohl und wenn.",
    commonMistake: "Alle Konnektoren gleich zu behandeln und die Bedeutung des Nebensatzes zu ignorieren.",
  },
  {
    slug: "kapitel-7-relativsatze",
    chapter: 7,
    topic: "Relativsätze",
    coreIdea: "Relativsätze geben zusätzliche Informationen, ohne einen neuen Hauptsatz beginnen zu müssen.",
    bestPractice: "Verbinde zwei kurze Sätze zu einem präzisen Satz mit passendem Relativpronomen.",
    commonMistake: "Das Relativpronomen nur nach Genus zu wählen und den Kasus im Relativsatz zu vergessen.",
  },
  {
    slug: "kapitel-8-konjunktiv-ii",
    chapter: 8,
    topic: "Konjunktiv II",
    coreIdea: "Konjunktiv II macht Wünsche, höfliche Bitten und irreale Bedingungen sprachlich sauber.",
    bestPractice: "Formuliere direkte Aussagen höflicher oder hypothetischer mit würde, könnte, hätte oder wäre.",
    commonMistake: "Konjunktiv II nur mit würde zu bilden, obwohl feste Formen oft natürlicher klingen.",
  },
  {
    slug: "kapitel-9-passiv",
    chapter: 9,
    topic: "Passiv",
    coreIdea: "Passiv rückt den Vorgang oder das Ergebnis in den Vordergrund, nicht die handelnde Person.",
    bestPractice: "Wandle aktive Sätze in Vorgangspassiv und Zustandspassiv um und vergleiche die Wirkung.",
    commonMistake: "Passiv zu benutzen, obwohl die handelnde Person im Kontext wichtig ist.",
  },
  {
    slug: "kapitel-10-infinitiv-mit-zu",
    chapter: 10,
    topic: "Infinitiv mit zu",
    coreIdea: "Infinitivgruppen helfen dir, Absichten, Pläne und Bewertungen kompakt auszudrücken.",
    bestPractice: "Erweitere einfache Sätze mit zu-Infinitivgruppen wie um ... zu oder ohne ... zu.",
    commonMistake: "zu an die falsche Stelle zu setzen oder trennbare Verben falsch zu schreiben.",
  },
  {
    slug: "kapitel-11-prapositionen-und-kasus",
    chapter: 11,
    topic: "Präpositionen und Kasus",
    coreIdea: "Präpositionen steuern den Kasus und verändern dadurch die Form von Artikeln und Adjektiven.",
    bestPractice: "Lerne Präpositionen in festen Mini-Phrasen wie mit dem, für den oder wegen des.",
    commonMistake: "Präpositionen isoliert zu lernen und den dazugehörigen Kasus nicht mitzuspeichern.",
  },
  {
    slug: "kapitel-12-verben-mit-prapositionen",
    chapter: 12,
    topic: "Verben mit Präpositionen",
    coreIdea: "Viele B2-Verben brauchen eine feste Präposition, damit die Aussage natürlich klingt.",
    bestPractice: "Lerne Verb, Präposition und Beispiel zusammen: sich interessieren für, warten auf, teilnehmen an.",
    commonMistake: "Die Präposition aus der Muttersprache direkt zu übersetzen.",
  },
  {
    slug: "kapitel-13-personliche-und-formelle-e-mails",
    chapter: 13,
    topic: "Persönliche und formelle E-Mails",
    coreIdea: "B2-E-Mails brauchen einen passenden Ton, klare Absätze und eine erkennbare Absicht.",
    bestPractice: "Markiere Anrede, Anlass, Hauptteil, Bitte und Schlussformel in deiner E-Mail.",
    commonMistake: "Formelle und informelle Sprache zu mischen.",
  },
  {
    slug: "kapitel-14-meinung-schreiben",
    chapter: 14,
    topic: "Meinung schreiben",
    coreIdea: "Eine gute Meinung besteht aus Position, Begründung, Beispiel und kurzer Schlussfolgerung.",
    bestPractice: "Nutze eine einfache Vier-Schritt-Struktur: Meinung, Grund, Beispiel, Fazit.",
    commonMistake: "Viele Behauptungen aufzuzählen, ohne sie zu begründen.",
  },
  {
    slug: "kapitel-15-beschwerdebrief",
    chapter: 15,
    topic: "Beschwerdebrief",
    coreIdea: "Ein Beschwerdebrief ist sachlich, konkret und nennt eine klare Erwartung.",
    bestPractice: "Beschreibe Problem, Datum, Folge und gewünschte Lösung in getrennten Absätzen.",
    commonMistake: "Zu emotional zu schreiben und keine konkrete Lösung zu fordern.",
  },
  {
    slug: "kapitel-16-bewerbung-und-berufliche-e-mails",
    chapter: 16,
    topic: "Bewerbung und berufliche E-Mails",
    coreIdea: "Berufliche Texte müssen höflich, präzise und zielorientiert formuliert sein.",
    bestPractice: "Verbinde Qualifikation, Motivation und konkrete Bitte in einer klaren Struktur.",
    commonMistake: "Zu allgemein zu schreiben und keine relevanten Details zu nennen.",
  },
  {
    slug: "kapitel-17-vorstellungsgesprach-auf-b2-niveau",
    chapter: 17,
    topic: "Vorstellungsgespräch auf B2-Niveau",
    coreIdea: "Im Vorstellungsgespräch erklärst du Erfahrungen, Stärken und Ziele mit konkreten Beispielen.",
    bestPractice: "Bereite Antworten mit Situation, Aufgabe, Handlung und Ergebnis vor.",
    commonMistake: "Nur Adjektive wie motiviert oder flexibel zu nennen, ohne Beispiel.",
  },
  {
    slug: "kapitel-18-meinung-aussern-und-diskutieren-auf-b2-niveau",
    chapter: 18,
    topic: "Meinung äußern und diskutieren",
    coreIdea: "Diskutieren auf B2 heißt, die eigene Position zu vertreten und auf andere Argumente zu reagieren.",
    bestPractice: "Übe Redemittel für Zustimmung, Widerspruch, Einschränkung und Nachfrage.",
    commonMistake: "Nur die eigene Meinung zu wiederholen und nicht auf den Gesprächspartner einzugehen.",
  },
  {
    slug: "kapitel-19-vor-und-nachteile-strukturiert-erklaren",
    chapter: 19,
    topic: "Vor- und Nachteile strukturiert erklären",
    coreIdea: "Vor- und Nachteile wirken überzeugend, wenn sie geordnet, gewichtet und mit Beispielen gestützt sind.",
    bestPractice: "Sortiere Argumente nach Wichtigkeit und leite jeden Punkt mit einem Redemittel ein.",
    commonMistake: "Vorteile und Nachteile durcheinander zu nennen.",
  },
  {
    slug: "kapitel-20-einen-meinungstext-schreiben",
    chapter: 20,
    topic: "Einen Meinungstext schreiben",
    coreIdea: "Ein Meinungstext braucht Einleitung, Hauptteil mit Argumenten und ein klares Fazit.",
    bestPractice: "Plane zuerst die Argumentstruktur, bevor du mit dem Schreiben beginnst.",
    commonMistake: "Ohne Plan loszuschreiben und am Ende keinen klaren roten Faden zu haben.",
  },
  {
    slug: "kapitel-21-einen-formellen-brief-sicher-schreiben",
    chapter: 21,
    topic: "Einen formellen Brief sicher schreiben",
    coreIdea: "Formelle Briefe leben von Höflichkeit, Präzision und standardisierten Formulierungen.",
    bestPractice: "Nutze feste Bausteine für Anlass, Bezug, Bitte, Frist und Schluss.",
    commonMistake: "Umgangssprache oder zu direkte Forderungen zu verwenden.",
  },
  {
    slug: "kapitel-22-horen-auf-b2-niveau-trainieren",
    chapter: 22,
    topic: "Hören auf B2-Niveau trainieren",
    coreIdea: "B2-Hören verlangt, Hauptaussagen, Details und Sprecherabsichten zu erkennen.",
    bestPractice: "Höre zuerst global, dann gezielt nach Zahlen, Gründen, Meinungen und Kontrasten.",
    commonMistake: "Bei einem unbekannten Wort stehenzubleiben und den Rest zu verpassen.",
  },
  {
    slug: "kapitel-23-lesen-auf-b2-niveau-trainieren",
    chapter: 23,
    topic: "Lesen auf B2-Niveau trainieren",
    coreIdea: "B2-Lesen kombiniert globales Verstehen mit gezielter Suche nach Informationen.",
    bestPractice: "Überfliege zuerst Titel, Absätze und Schlüsselwörter, bevor du Detailfragen löst.",
    commonMistake: "Den Text Wort für Wort zu übersetzen, bevor du die Aufgabe verstanden hast.",
  },
  {
    slug: "kapitel-24-wortschatz-aktiv-aufbauen-und-benutzen",
    chapter: 24,
    topic: "Wortschatz aktiv aufbauen und benutzen",
    coreIdea: "Wortschatz wächst schneller, wenn du Wörter thematisch und in typischen Verbindungen lernst.",
    bestPractice: "Erstelle Themenfelder mit Nomen-Verb-Verbindungen und eigenen Beispielsätzen.",
    commonMistake: "Lange Wortlisten zu sammeln, ohne sie in Texten oder Gesprächen zu benutzen.",
  },
  {
    slug: "kapitel-25-wortschatz-in-schreiben-und-sprechen-aktivieren",
    chapter: 25,
    topic: "Wortschatz aktivieren",
    coreIdea: "Aktivieren heißt, neue Wörter bewusst in Schreiben und Sprechen einzubauen.",
    bestPractice: "Wähle fünf neue Ausdrücke und verwende sie in einer kurzen Antwort zum Kapitelthema.",
    commonMistake: "Neue Wörter nur wiederzuerkennen, aber sie nie selbst zu produzieren.",
  },
  {
    slug: "kapitel-26-prufungstraining-und-zeitmanagement",
    chapter: 26,
    topic: "Prüfungstraining und Zeitmanagement",
    coreIdea: "Gutes Zeitmanagement verhindert, dass du in der Prüfung an einer Aufgabe hängenbleibst.",
    bestPractice: "Trainiere Aufgaben mit Timer und notiere danach, wo du Zeit verloren hast.",
    commonMistake: "Nur Inhalte zu üben und die echte Prüfungszeit nicht zu simulieren.",
  },
  {
    slug: "kapitel-27-modelltest-training-fur-schreiben-und-sprechen",
    chapter: 27,
    topic: "Modelltest-Training",
    coreIdea: "Modelltests zeigen dir, ob du Wissen unter Prüfungsbedingungen abrufen kannst.",
    bestPractice: "Bearbeite einen Modelltest, analysiere Fehler und wiederhole gezielt die schwachen Aufgaben.",
    commonMistake: "Modelltests nur zu lösen, ohne die Fehler danach systematisch auszuwerten.",
  },
  {
    slug: "kapitel-28-haufige-b2-prufungsthemen-und-musterantworten",
    chapter: 28,
    topic: "Häufige B2-Prüfungsthemen",
    coreIdea: "Typische Themen helfen dir, Argumente und Wortschatz schneller zu aktivieren.",
    bestPractice: "Sammle pro Thema drei Argumente, zwei Beispiele und fünf starke Ausdrücke.",
    commonMistake: "Musterantworten auswendig zu lernen, statt flexible Bausteine zu trainieren.",
  },
  {
    slug: "kapitel-29-die-letzten-14-tage-vor-der-b2-prufung",
    chapter: 29,
    topic: "Die letzten 14 Tage",
    coreIdea: "Kurz vor der Prüfung brauchst du Wiederholung, Simulation und mentale Ruhe statt neues Chaos.",
    bestPractice: "Plane feste Wiederholungsblöcke und mindestens eine realistische Prüfungssimulation.",
    commonMistake: "In den letzten Tagen zu viele neue Themen zu beginnen.",
  },
  {
    slug: "kapitel-30-abschluss-dein-personlicher-b2-plan",
    chapter: 30,
    topic: "Dein persönlicher B2-Plan",
    coreIdea: "Ein persönlicher Plan verbindet Ziele, Routinen und konkrete nächste Schritte.",
    bestPractice: "Definiere drei Wochenziele und jeweils eine messbare Aufgabe pro Sprachfertigkeit.",
    commonMistake: "Ein großes Ziel zu notieren, aber keine kleine tägliche Handlung festzulegen.",
  },
];

const quizzes: Record<string, RoadToB2Quiz> = Object.fromEntries(
  quizConfigs.map((config) => [
    config.slug,
    {
      title: `Kapitel-${config.chapter}-Check: ${config.topic}`,
      description:
        "Beantworte drei kurze Fragen, bevor du zum nächsten Kapitel gehst.",
      questions: [
        {
          question: `Was ist die wichtigste Idee in „${config.topic}“?`,
          options: [
            config.coreIdea,
            "B2 erreicht man vor allem, indem man möglichst viele einzelne Regeln auswendig lernt.",
            "Für B2 reicht es, bekannte Wörter schneller zu lesen.",
          ],
          answerIndex: 0,
          explanation: config.coreIdea,
        },
        {
          question: "Welche Übung passt am besten zu diesem Kapitel?",
          options: [
            "Nur die Überschrift lesen und direkt zum nächsten Kapitel springen.",
            config.bestPractice,
            "Eine lange Wortliste abschreiben, ohne eigene Sätze zu bilden.",
          ],
          answerIndex: 1,
          explanation: config.bestPractice,
        },
        {
          question: "Was solltest du bei diesem Thema vermeiden?",
          options: [
            "Eigene Beispiele zu bilden und sie laut zu sprechen.",
            "Den Inhalt in kleinen Schritten zu wiederholen.",
            config.commonMistake,
          ],
          answerIndex: 2,
          explanation: config.commonMistake,
        },
      ],
    },
  ]),
);

export function getRoadToB2Quiz(slug: string) {
  return quizzes[slug] || null;
}
