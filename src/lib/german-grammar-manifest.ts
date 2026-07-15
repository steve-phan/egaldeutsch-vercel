export type GrammarLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type GrammarChapterStatus = "published" | "scaffold" | "planned";

export interface GrammarChapterPlan {
  order: number;
  slug: string;
  title: string;
  description: string;
  level: GrammarLevel;
  part: string;
  unit: string;
  status: GrammarChapterStatus;
  spiralTopic?: string;
  isReview?: boolean;
}

const A1_PART = "A1 Foundations";
const A2_PART = "A2 Everyday Grammar";
const B1_PART = "B1 Independent Grammar";
const B2_PART = "B2 Upper-Intermediate Grammar";
const C1_PART = "C1 Advanced Grammar";
const C2_PART = "C2 Mastery Grammar";

function plan(
  order: number,
  slug: string,
  title: string,
  description: string,
  level: GrammarLevel,
  part: string,
  unit: string,
  status: GrammarChapterStatus,
  extras: Partial<Pick<GrammarChapterPlan, "spiralTopic" | "isReview">> = {},
): GrammarChapterPlan {
  return { order, slug, title, description, level, part, unit, status, ...extras };
}

export const GERMAN_GRAMMAR_MANIFEST: GrammarChapterPlan[] = [
  // ── A1 Foundations (31) ──────────────────────────────────────────
  plan(1, "kapitel-1-grammar-terminology-and-german-sentence-basics", "Grammatikbegriffe und deutsche Satzgrundlagen", "Baue ein klares Modell für deutsche Sätze: Wortarten, Subjekt, Verb, Objekt, Hauptsatz und Verbklammer.", "A1", A1_PART, "introduction", "published", { spiralTopic: "sentence-structure" }),
  plan(2, "a1-02-words-phrases-clauses-and-sentences", "Wörter, Wortgruppen, Sätze und Teilsätze", "So baut Deutsch Bedeutung von einzelnen Wörtern bis zum vollständigen Satz auf.", "A1", A1_PART, "introduction", "published"),
  plan(3, "a1-03-parts-of-speech-overview", "Wortarten im Deutschen — Überblick", "Nomen, Verben, Adjektive, Pronomen, Artikel, Präpositionen und Konjunktionen auf A1-Niveau.", "A1", A1_PART, "introduction", "published"),
  plan(4, "kapitel-2-nouns-gender-and-plural-basics", "Nomen, Genus und Plural — Grundlagen", "Verstehe, warum jedes deutsche Nomen ein Genus, einen Artikel und eine Pluralform braucht.", "A1", A1_PART, "nouns-and-articles", "published", { spiralTopic: "gender" }),
  plan(5, "a1-05-gender-by-suffix-and-meaning", "Genus erkennen — Endungen und Bedeutung", "Praktische Regeln für der, die und das anhand häufiger Endungen.", "A1", A1_PART, "nouns-and-articles", "published", { spiralTopic: "gender" }),
  plan(6, "a1-06-plural-patterns-and-umlaut", "Pluralmuster und Umlaut", "Regelmäßige und unregelmäßige Pluralformen mit Artikelwechsel.", "A1", A1_PART, "nouns-and-articles", "published", { spiralTopic: "gender" }),
  plan(7, "a1-07-compound-nouns-and-nominalisation-intro", "Komposita — erste Schritte", "Einfache zusammengesetzte Nomen lesen und bilden mit Fugenelementen.", "A1", A1_PART, "nouns-and-articles", "published"),
  plan(8, "kapitel-3-articles-and-the-nominative-case", "Artikel und der Nominativ", "Benutze der, die, das, ein, eine und kein korrekt als Subjekt und nach sein.", "A1", A1_PART, "nouns-and-articles", "published", { spiralTopic: "cases" }),
  plan(9, "a1-09-possessive-and-demonstrative-articles", "Possessiv- und Demonstrativartikel", "mein, dein, dieser und jeder im Nominativ.", "A1", A1_PART, "nouns-and-articles", "published"),
  plan(10, "kapitel-4-present-tense-verbs", "Präsens — Verben in der Gegenwart", "Konjugiere regelmäßige und wichtige unregelmäßige Verben im Präsens.", "A1", A1_PART, "present-tense", "published", { spiralTopic: "verbs" }),
  plan(11, "a1-11-stem-changing-and-irregular-present", "Stammvokalwechsel und unregelmäßiges Präsens", "fahren, lesen, sein, haben und Verben auf -eln/-ern.", "A1", A1_PART, "present-tense", "published", { spiralTopic: "verbs" }),
  plan(12, "a1-12-sein-haben-werden", "sein, haben und werden", "Die drei wichtigsten A1-Verben in allen Personen.", "A1", A1_PART, "present-tense", "published"),
  plan(13, "a1-13-modal-verbs-koennen-muessen", "Modalverben: können und müssen", "Fähigkeit und Pflicht im deutschen Alltag ausdrücken.", "A1", A1_PART, "present-tense", "published", { spiralTopic: "modals" }),
  plan(14, "kapitel-5-accusative-objects-and-basic-word-order", "Akkusativobjekte und grundlegende Wortstellung", "Direkte Objekte im Akkusativ, Verb an Position 2 und die erste Verbklammer.", "A1", A1_PART, "nominative-and-accusative", "published", { spiralTopic: "cases" }),
  plan(15, "a1-15-personal-pronouns-nominative-accusative", "Personalpronomen im Nominativ und Akkusativ", "ich/mich, du/dich, er/ihn und Pluralformen.", "A1", A1_PART, "nominative-and-accusative", "published"),
  plan(16, "a1-16-accusative-prepositions", "Akkusativpräpositionen", "durch, für, gegen, ohne, um und zeitliche Akkusativausdrücke.", "A1", A1_PART, "nominative-and-accusative", "published", { spiralTopic: "prepositions" }),
  plan(17, "a1-17-verb-second-and-sentence-bracket-intro", "Verb an Position 2 und die Satzklammer", "Warum das finite Verb auf Position 2 bleibt und wo der Rest hin kommt.", "A1", A1_PART, "sentence-basics", "published", { spiralTopic: "word-order" }),
  plan(18, "kapitel-6-questions-negation-and-everyday-patterns", "Fragen, Verneinung und Alltagsmuster", "Ja-/Nein-Fragen, W-Fragen, nicht und kein in echten Alltagssätzen.", "A1", A1_PART, "questions-and-negation", "published"),
  plan(19, "a1-19-negation-nicht-and-kein", "Verneinung mit nicht und kein", "Position von nicht und wann kein statt ein steht.", "A1", A1_PART, "questions-and-negation", "published"),
  plan(20, "a1-20-coordinating-conjunctions", "Nebenordnende Konjunktionen", "und, aber, oder, denn und sondern ohne Verbverschiebung.", "A1", A1_PART, "sentence-basics", "published"),
  plan(21, "a1-21-imperative-and-polite-requests", "Imperativ und höfliche Bitten", "Komm!, Gehen Sie bitte … und Abschwächung mit bitte und mal.", "A1", A1_PART, "questions-and-negation", "published"),
  plan(22, "a1-22-numbers-time-and-dates", "Zahlen, Uhrzeit und Datum", "Ordnungszahlen, Uhrzeit und Kalenderausdrücke.", "A1", A1_PART, "everyday", "published"),
  plan(23, "a1-23-spoken-vs-written-german", "Gesprochenes und geschriebenes Deutsch auf A1", "Kontraktionen, Füllwörter und einfacher formeller Register.", "A1", A1_PART, "register", "published"),
  plan(24, "a1-24-german-for-everyday-life", "Deutsch für den Alltag — A1", "Sich vorstellen, einkaufen, Termine und Smalltalk.", "A1", A1_PART, "everyday", "published"),
  plan(25, "a1-25-german-at-work-basics", "Deutsch im Beruf — A1-Grundlagen", "Einfache Arbeitssprache, E-Mails und Terminplanung.", "A1", A1_PART, "work", "published"),
  plan(26, "a1-26-german-for-software-engineers-a1", "Deutsch für Software Engineers — A1", "Tickets, Bugs, Deployments und Standup-Phrasen.", "A1", A1_PART, "software", "published"),
  plan(27, "a1-27-common-a1-errors", "Typische A1-Fehler", "Häufige Fehler bei Wortstellung, Artikeln und Verbendungen.", "A1", A1_PART, "common-errors", "published"),
  plan(28, "a1-28-review-unit-1", "A1 Review — Einheit 1", "Wiederholung der Kapitel 1–14: Sätze, Genus, Artikel und Präsens.", "A1", A1_PART, "review", "published", { isReview: true }),
  plan(29, "a1-29-review-unit-2", "A1 Review — Einheit 2", "Wiederholung der Kapitel 15–27: Akkusativ, Fragen, Verneinung und Register.", "A1", A1_PART, "review", "published", { isReview: true }),
  plan(30, "a1-30-placement-and-level-test", "A1 Einstufungs- und Niveautest", "Diagnostischer Test zur Bestätigung des A1-Niveaus vor A2.", "A1", A1_PART, "tests", "published", { isReview: true }),
  plan(31, "a1-31-grammar-terminology-reference", "A1 Grammatikbegriffe — Schnellreferenz", "Kurzreferenz für das Nomen, das Verb, der Kasus und mehr.", "A1", A1_PART, "reference", "published"),

  // ── A2 Everyday Grammar (31) ─────────────────────────────────────
  plan(32, "kapitel-7-the-dative-case-and-dative-verbs", "Der Dativ und Dativverben", "Benutze den Dativ für Empfänger, Mitspieler und viele Alltagsverben.", "A2", A2_PART, "dative", "published", { spiralTopic: "cases" }),
  plan(33, "a2-02-dative-prepositions", "Dativpräpositionen", "Benutze aus, bei, mit, nach, seit, von und zu sicher im Dativ.", "A2", A2_PART, "dative", "published", { spiralTopic: "prepositions" }),
  plan(34, "a2-03-personal-pronouns-dative", "Personalpronomen im Dativ", "Benutze mir, dir, ihm, ihr, uns, euch und ihnen in echten Sätzen.", "A2", A2_PART, "dative", "published"),
  plan(35, "kapitel-8-two-way-prepositions", "Wechselpräpositionen — Wo oder wohin?", "Wähle Dativ für Position und Akkusativ für Richtung nach an, auf, in, über, unter, vor, hinter, neben, zwischen.", "A2", A2_PART, "two-way-prepositions", "published", { spiralTopic: "prepositions" }),
  plan(36, "a2-05-dative-and-accusative-object-order", "Reihenfolge von Dativ- und Akkusativobjekten", "Ordne Dativ- und Akkusativobjekte richtig: Ich gebe dir das Buch.", "A2", A2_PART, "word-order", "published", { spiralTopic: "word-order" }),
  plan(37, "kapitel-9-perfect-tense-with-haben-and-sein", "Das Perfekt mit haben und sein", "Erzähle Alltagserlebnisse im Perfekt und wähle sicher zwischen haben und sein.", "A2", A2_PART, "perfect-tense", "published", { spiralTopic: "tenses" }),
  plan(38, "a2-07-partizip-ii-regular-and-irregular", "Partizip II — regelmäßig und unregelmäßig", "Bilde ge-…-t, ge-…-en und Partizipien ohne ge- sicher.", "A2", A2_PART, "perfect-tense", "published", { spiralTopic: "tenses" }),
  plan(39, "a2-08-separable-verbs-in-perfekt", "Trennbare Verben im Perfekt", "Bilde Perfekt mit angefangen, eingeloggt und korrekter Satzstellung.", "A2", A2_PART, "perfect-tense", "published", { spiralTopic: "separable-verbs" }),
  plan(40, "kapitel-10-separable-and-reflexive-verbs", "Trennbare und reflexive Verben", "Position von Präfixen, reflexive Pronomen und Satzklammern im Alltag.", "A2", A2_PART, "separable-verbs", "published", { spiralTopic: "separable-verbs" }),
  plan(41, "a2-10-reflexive-verbs-accusative-dative", "Reflexive Verben — Akkusativ und Dativ", "Benutze sich freuen auf, sich anmelden und wechselseitige Bedeutung korrekt.", "A2", A2_PART, "reflexive-verbs", "published"),
  plan(42, "a2-11-comparison-comparative-superlative", "Vergleich — Komparativ und Superlativ", "Benutze größer, am besten, so … wie und als im Vergleich.", "A2", A2_PART, "adjectives", "published"),
  plan(43, "kapitel-11-adjective-endings-introduction", "Adjektivendungen — Einführung", "Benutze die wichtigsten Adjektivendungen nach der, ein und ohne Artikel im Nominativ und Akkusativ.", "A2", A2_PART, "adjectives", "published", { spiralTopic: "adjective-endings" }),
  plan(44, "a2-13-predicative-and-adverbial-adjectives", "Prädikative und adverbiale Adjektive", "Benutze Das ist gut, schnell fahren und Adjektive ohne Endung korrekt.", "A2", A2_PART, "adjectives", "published"),
  plan(45, "a2-14-adverbs-of-time-place-manner", "Adverbien von Zeit, Ort und Art", "Ordne heute, hier und gern im Satz — erste TeKaMoLo-Regeln.", "A2", A2_PART, "adverbs", "published", { spiralTopic: "word-order" }),
  plan(46, "a2-15-modal-verbs-a2", "Modalverben auf A2-Niveau", "Benutze dürfen, sollen, wollen, mögen und möchten im Kontext.", "A2", A2_PART, "modals", "published", { spiralTopic: "modals" }),
  plan(47, "kapitel-12-subordinate-clauses-with-weil-dass-wenn-and-obwohl", "Nebensätze mit weil, dass, wenn und obwohl", "Setze das konjugierte Verb ans Ende in häufigen Nebensätzen.", "A2", A2_PART, "subordinate-clauses", "published", { spiralTopic: "subordinate-clauses" }),
  plan(48, "a2-17-wenn-als-and-temporal-clauses", "wenn, als und temporale Nebensätze", "Drücke Gewohnheit, einmalige Vergangenheit und Zeit mit wenn, als, seit und bis aus.", "A2", A2_PART, "subordinate-clauses", "published", { spiralTopic: "subordinate-clauses" }),
  plan(49, "a2-18-passive-recognition", "Das Passiv erkennen", "Verstehe wird gemacht und wurde gesendet auf A2-Niveau.", "A2", A2_PART, "passive", "published", { spiralTopic: "passive" }),
  plan(50, "a2-19-modal-particles-intro", "Modalpartikeln — Einführung", "Verstehe doch, mal, denn und ja in gesprochenem Deutsch.", "A2", A2_PART, "particles", "published"),
  plan(51, "a2-20-praeteritum-in-narratives", "Präteritum in Erzählungen", "Benutze war, hatte und konnte in Geschichten und schriftlichen Texten.", "A2", A2_PART, "past-tenses", "published", { spiralTopic: "tenses" }),
  plan(52, "a2-21-german-for-everyday-life", "Deutsch für den Alltag — A2", "Grammatik für Arztbesuche, Wohnung, Reisen und Behördengänge.", "A2", A2_PART, "everyday", "published"),
  plan(53, "a2-22-german-at-work", "Deutsch im Beruf — A2", "Grammatik für Meetings, Bitten, Feedback und Teamkommunikation.", "A2", A2_PART, "work", "published"),
  plan(54, "a2-23-german-for-software-engineers", "Deutsch für Software Engineers — A2", "Grammatik für Code Reviews, Tickets, Deployments und Incident Reports.", "A2", A2_PART, "software", "published"),
  plan(55, "a2-24-common-a2-errors", "Häufige A2-Fehler", "Typische Fehler bei Dativ, Perfekt-Hilfsverben und Nebensatz-Wortstellung.", "A2", A2_PART, "common-errors", "published"),
  plan(56, "a2-25-review-unit-1", "A2 Review Einheit 1", "Wiederhole Dativ, Präpositionen und Perfekt aus den Kapiteln 7–9.", "A2", A2_PART, "review", "published", { isReview: true }),
  plan(57, "a2-26-review-unit-2", "A2 Review Einheit 2", "Wiederhole Adjektive, Nebensätze und Modalpartikeln aus der zweiten A2-Hälfte.", "A2", A2_PART, "review", "published", { isReview: true }),
  plan(58, "a2-27-a2-level-test", "A2-Leveltest", "Abschließende A2-Grammatikprüfung vor dem Übergang zu B1.", "A2", A2_PART, "tests", "published", { isReview: true }),
  plan(59, "a2-28-irregular-verbs-reference", "Unregelmäßige Verben — A2-Referenz", "Schnelltabellen für die 50 häufigsten starken Verben auf A2-Niveau.", "A2", A2_PART, "reference", "published"),
  plan(60, "a2-29-prepositions-and-cases-reference", "Präpositionen und Fälle — A2-Referenz", "Übersichtstabellen für Akkusativ-, Dativ- und Wechselpräpositionen auf A2.", "A2", A2_PART, "reference", "published"),
  plan(61, "a2-30-answer-key-a2", "A2 Übungslösungen", "Lösungen zu allen A2-Kapitelübungen und dem A2-Leveltest.", "A2", A2_PART, "answer-key", "published"),
  plan(62, "a2-31-workbook-overview", "A2 Workbook — Übersicht", "So nutzt du das A2-Übungsbuch und den Lösungsschlüssel effektiv.", "A2", A2_PART, "workbook", "published"),

  // ── B1 Independent Grammar (31) ────────────────────────────────────
  plan(63, "kapitel-13-perfekt-praeteritum-and-plusquamperfekt", "Perfekt, Präteritum und Plusquamperfekt", "Wähle die richtige Vergangenheitsform in Sprache und Schrift und erzähle mit Zeitkontrast.", "B1", B1_PART, "past-tenses", "published", { spiralTopic: "tenses" }),
  plan(64, "b1-02-futur-i-and-future-meaning", "Futur I und Zukunftsausdrücke", "Benutze werden + Infinitiv, Präsens mit Zeitangabe und Vermutungen im Futur I.", "B1", B1_PART, "future-tenses", "published", { spiralTopic: "tenses" }),
  plan(65, "b1-03-genitive-case-and-possession", "Genitiv und Besitz", "Drücke Besitz mit des/der, wegen und von + Dativ als Umgangsalternative aus.", "B1", B1_PART, "genitive", "published", { spiralTopic: "cases" }),
  plan(66, "kapitel-14-genitive-case-and-weak-nouns", "Genitiv und schwache Nomen", "Drücke Besitz und Zugehörigkeit aus und erkenne schwache maskuline Nomen.", "B1", B1_PART, "genitive", "published", { spiralTopic: "cases" }),
  plan(67, "b1-05-relative-clauses-nominative-accusative", "Relativsätze — Nominativ und Akkusativ", "Verbinde Sätze mit der/die/das und den/die/das als Relativpronomen im Nominativ und Akkusativ.", "B1", B1_PART, "relative-clauses", "published", { spiralTopic: "relative-clauses" }),
  plan(68, "kapitel-15-relative-clauses", "Relativsätze", "Verbinde Sätze mit der, die, das, den, dem und Präposition + Relativpronomen.", "B1", B1_PART, "relative-clauses", "published", { spiralTopic: "relative-clauses" }),
  plan(69, "b1-07-relative-clauses-dative-genitive", "Relativsätze — Dativ und Genitiv", "Benutze dem/der/denen und dessen/deren in Relativsätzen mit Dativ und Genitiv.", "B1", B1_PART, "relative-clauses", "published", { spiralTopic: "relative-clauses" }),
  plan(70, "kapitel-16-infinitive-clauses-with-zu-um-zu-ohne-zu", "Infinitivsätze mit zu, um … zu und ohne … zu", "Drücke Zweck, Verzicht und erweiterte Infinitivkonstruktionen aus.", "B1", B1_PART, "infinitive-clauses", "published"),
  plan(71, "b1-09-lassen-and-perception-verbs", "lassen und Wahrnehmungsverben", "Drücke Handlungen für andere aus mit lassen und wahrgenommene Handlungen mit sehen/hören + Infinitiv.", "B1", B1_PART, "infinitive-clauses", "published"),
  plan(72, "kapitel-17-passive-voice-basics", "Passiv — Grundlagen (Vorgangspassiv)", "Beschreibe Prozesse mit werden + Partizip II im Präsens und in der Vergangenheit.", "B1", B1_PART, "passive", "published", { spiralTopic: "passive" }),
  plan(73, "b1-11-zustandspassiv-with-sein", "Zustandspassiv mit sein", "Unterscheide Vorgangspassiv (werden) und Zustandspassiv (sein) in Praxis und Bedeutung.", "B1", B1_PART, "passive", "published", { spiralTopic: "passive" }),
  plan(74, "kapitel-18-konjunktiv-ii-basics-and-text-connectors", "Konjunktiv II — Grundlagen und Textverbindungen", "Drücke Wünsche, höfliche Bitten und irreale Situationen mit würde, hätte, wäre und Konnektoren aus.", "B1", B1_PART, "konjunktiv-two", "published", { spiralTopic: "konjunktiv" }),
  plan(75, "b1-13-indirect-questions-and-ob-clauses", "Indirekte Fragen und ob-Sätze", "Wiedergebe Fragen in Nebensätzen mit ob und indirekter Wortstellung.", "B1", B1_PART, "subordinate-clauses", "published"),
  plan(76, "b1-14-temporal-subordinate-clauses", "Temporale Nebensätze", "Verknüpfe Ereignisse mit bevor, nachdem, während, bis, sobald und seitdem.", "B1", B1_PART, "subordinate-clauses", "published", { spiralTopic: "subordinate-clauses" }),
  plan(77, "b1-15-causal-and-concessive-clauses", "Kausale und konzessive Sätze", "Begründe und kontrastiere mit da, weil, obwohl, trotzdem und deshalb.", "B1", B1_PART, "text-connections", "published"),
  plan(78, "b1-16-purpose-and-result-clauses", "Final- und Konsekutivsätze", "Drücke Zweck mit damit und um … zu sowie Ergebnis mit sodass aus.", "B1", B1_PART, "text-connections", "published"),
  plan(79, "b1-17-pronominal-adverbs-da-wo", "Pronominaladverbien — da- und wo-Komposita", "Ersetze Präposition + Pronomen durch darauf, womit, dafür und ähnliche Formen.", "B1", B1_PART, "pronouns", "published"),
  plan(80, "b1-18-verbs-with-prepositional-objects", "Verben mit Präpositionalergänzung", "Beherrsche feste Verb-Präposition-Paare wie warten auf, denken an und den richtigen Kasus.", "B1", B1_PART, "prepositions", "published", { spiralTopic: "prepositions" }),
  plan(81, "b1-19-german-for-everyday-life", "Deutsch im Alltag — B1", "Äußere Meinungen, Beschwerden, Termine und Telefongespräche mit B1-Grammatik.", "B1", B1_PART, "everyday", "published"),
  plan(82, "b1-20-german-at-work", "Deutsch im Beruf — B1", "Berichte, Übergaben und professionelle E-Mails mit B1-Grammatikstrukturen.", "B1", B1_PART, "work", "published"),
  plan(83, "b1-21-german-for-software-engineers", "Deutsch für Software Engineers — B1", "Architekturgespräche, Spezifikationen und Stakeholder-Updates auf B1-Niveau.", "B1", B1_PART, "software", "published"),
  plan(84, "b1-22-common-b1-errors", "Häufige B1-Fehler", "Typische Fehler bei Relativpronomen, Passiv, Nebensatz-Wortstellung und Genitiv.", "B1", B1_PART, "common-errors", "published"),
  plan(85, "b1-23-review-unit-1", "B1 Wiederholungseinheit 1", "Wiederhole Vergangenheitsformen, Genitiv und Relativsätze aus der ersten B1-Hälfte.", "B1", B1_PART, "review", "published", { isReview: true }),
  plan(86, "b1-24-review-unit-2", "B1 Wiederholungseinheit 2", "Wiederhole Passiv, Konjunktiv II, Infinitivsätze und Textverbindungen.", "B1", B1_PART, "review", "published", { isReview: true }),
  plan(87, "b1-25-b1-level-test", "B1-Einstufungstest", "Abschließende B1-Grammatikprüfung zu allen Themen der B1-Stufe.", "B1", B1_PART, "tests", "published", { isReview: true }),
  plan(88, "b1-26-article-and-pronoun-tables", "Artikel- und Pronomentabellen — B1-Referenz", "Vollständige Deklinationstabellen für Artikel, Pronomen und Possessivartikel auf B1-Niveau.", "B1", B1_PART, "reference", "published"),
  plan(89, "b1-27-verb-preposition-dictionary", "Verb-Präposition-Wörterbuch — B1", "Kernliste deutscher Verb-Präposition-Paare mit Kasus und Beispielsätzen.", "B1", B1_PART, "reference", "published"),
  plan(90, "b1-28-noun-gender-plural-reference", "Nomen Genus und Plural — Referenz", "Suffixregeln und Liste häufiger Nomen mit Genus und Pluralform.", "B1", B1_PART, "reference", "published"),
  plan(91, "b1-29-workbook-overview", "B1 Arbeitsbuch — Übersicht", "Struktur des B1-Übungsbuchs und Anleitung zum selbstständigen Üben.", "B1", B1_PART, "workbook", "published"),
  plan(92, "b1-30-answer-key-b1", "B1 Übungslösungen", "Lösungen zu den Übungen aller B1-Grammatikkapitel und Review-Einheiten.", "B1", B1_PART, "answer-key", "published"),
  plan(93, "b1-31-text-connectors-reference", "Textverbindungen — Referenz", "Schnellübersicht zu weil, obwohl, damit, deshalb und weiteren B1-Konnektoren.", "B1", B1_PART, "reference", "published"),

  // ── B2 Upper-Intermediate (31) ─────────────────────────────────────
  plan(94, "kapitel-19-three-field-model-and-advanced-word-order", "Drei-Felder-Modell und erweiterte Wortstellung", "Steuere Vorfeld, Mittelfeld und Nachfeld für klarere B2-Sätze und bessere Informationsstruktur.", "B2", B2_PART, "advanced-word-order", "published", { spiralTopic: "word-order" }),
  plan(95, "b2-02-tekalomo-and-adverbial-order", "TeKaMoLo und Adverbialreihenfolge", "Zeit vor Grund vor Art vor Ort — die klassische Reihenfolge im Mittelfeld auf B2-Niveau.", "B2", B2_PART, "advanced-word-order", "published", { spiralTopic: "word-order" }),
  plan(96, "b2-03-extraposition-and-nachfeld", "Extraposition und Nachfeld", "Rechtsverschiebung schwerer Satzteile ins Nachfeld — typisch für formelles B2-Deutsch.", "B2", B2_PART, "advanced-word-order", "published", { spiralTopic: "word-order" }),
  plan(97, "kapitel-20-full-adjective-declension", "Vollständige Adjektivdeklination", "Starke, schwache und gemischte Endungen in allen vier Fällen und im Plural.", "B2", B2_PART, "adjective-declension", "published", { spiralTopic: "adjective-endings" }),
  plan(98, "b2-05-expanded-participial-attributes", "Erweiterte Partizipialattribute", "Partizip I und II in attributiver Position — komplexe Nominalgruppen auf B2-Niveau.", "B2", B2_PART, "adjective-declension", "published"),
  plan(99, "kapitel-21-advanced-passive-and-passive-alternatives", "Erweitertes Passiv und Passiv-Alternativen", "Passiv in mehreren Zeitformen, mit Modalverben, man-Konstruktionen und Zustandspassiv.", "B2", B2_PART, "advanced-passive", "published", { spiralTopic: "passive" }),
  plan(100, "b2-07-passive-with-modals-and-agents", "Passiv mit Modalverben und Agens", "von + Dativ als Handelnder; werden vs. sein bei Passivkonstruktionen.", "B2", B2_PART, "advanced-passive", "published", { spiralTopic: "passive" }),
  plan(101, "kapitel-22-unreal-past-and-diplomatic-konjunktiv-ii", "Irreale Vergangenheit und diplomatischer Konjunktiv II", "Hätte, wäre, würde für vergangene Irrealität, Bedauern und höfliche Distanz.", "B2", B2_PART, "hypothetical-language", "published", { spiralTopic: "konjunktiv" }),
  plan(102, "b2-09-konjunktiv-ii-in-conditionals", "Konjunktiv II in Konditionalsätzen", "Wenn … würde/hätte/wäre und gemischte Bedingungstypen auf B2-Niveau.", "B2", B2_PART, "hypothetical-language", "published", { spiralTopic: "konjunktiv" }),
  plan(103, "kapitel-23-konjunktiv-i-and-indirect-speech", "Konjunktiv I und indirekte Rede", "Wiedergabe von Äußerungen in Nachrichten, Berichten und formeller Kommunikation.", "B2", B2_PART, "indirect-speech", "published", { spiralTopic: "konjunktiv" }),
  plan(104, "b2-11-konjunktiv-i-alternatives", "Konjunktiv-I-Alternativen", "würde + Infinitiv und Indikativ in der indirekten Rede — wann welche Form?", "B2", B2_PART, "indirect-speech", "published", { spiralTopic: "konjunktiv" }),
  plan(105, "kapitel-24-complex-sentence-construction", "Komplexe Satzgefüge", "Verschachtelte Nebensätze, Satzzeichen und Kontrolle langer B2-Texte.", "B2", B2_PART, "complex-sentences", "published"),
  plan(106, "b2-13-double-infinitive-constructions", "Doppelinfinitiv-Konstruktionen", "hat … müssen, wird … können und Verbcluster am Satzende auf B2-Niveau.", "B2", B2_PART, "complex-sentences", "published"),
  plan(107, "b2-14-futur-ii-and-past-assumptions", "Futur II und Vermutungen über die Vergangenheit", "werden + Partizip II + haben/sein für Rückschlüsse auf vergangene Ereignisse.", "B2", B2_PART, "future-tenses", "published", { spiralTopic: "tenses" }),
  plan(108, "b2-15-subordinate-clause-expansion", "Erweiterung der Nebensätze", "indem, falls, ohne dass, als ob und je … desto — neue Nebensatztypen auf B2.", "B2", B2_PART, "complex-sentences", "published", { spiralTopic: "subordinate-clauses" }),
  plan(109, "b2-16-relative-clauses-with-wo-was", "Relativsätze mit wo und was", "Relativbezug auf Orte, Sachen und ganze Sachverhalte — wo- und was-Relativsätze.", "B2", B2_PART, "relative-clauses", "published", { spiralTopic: "relative-clauses" }),
  plan(110, "b2-17-nominalisation-intro", "Nominalisierung — Einführung", "Von Verben zu Nomen für formelleres und kompakteres Deutsch auf B2-Niveau.", "B2", B2_PART, "nominalisation", "published", { spiralTopic: "nominalisation" }),
  plan(111, "b2-18-german-for-everyday-life", "Deutsch im Alltag — B2", "Nuancierte Meinungen, Debatten und Medienreaktionen auf B2-Niveau.", "B2", B2_PART, "everyday", "published"),
  plan(112, "b2-19-german-at-work", "Deutsch im Beruf — B2", "Formelle Berichte, Vorschläge und Sitzungsprotokolle auf B2-Niveau.", "B2", B2_PART, "work", "published"),
  plan(113, "b2-20-german-for-software-engineers", "Deutsch für Software Engineers — B2", "RFCs, Postmortems und teamübergreifende Dokumentation auf B2-Niveau.", "B2", B2_PART, "software", "published"),
  plan(114, "b2-21-common-b2-errors", "Häufige B2-Fehler", "Typische Fehler bei Adjektivendungen, Doppelinfinitiv und Konjunktiv-Wahl.", "B2", B2_PART, "common-errors", "published"),
  plan(115, "b2-22-review-unit-1", "B2 Review-Einheit 1", "Wortstellung, Adjektivdeklination und Passiv — Wiederholung der ersten B2-Themen.", "B2", B2_PART, "review", "published", { isReview: true }),
  plan(116, "b2-23-review-unit-2", "B2 Review-Einheit 2", "Konjunktiv, indirekte Rede und komplexe Sätze — Wiederholung für B2.", "B2", B2_PART, "review", "published", { isReview: true }),
  plan(117, "b2-24-b2-level-test", "B2-Niveautest", "Abschließende B2-Grammatikprüfung — teste dein Wissen vor dem Sprung zu C1.", "B2", B2_PART, "tests", "published", { isReview: true }),
  plan(118, "b2-25-adjective-endings-reference", "Adjektivendungen — Referenz", "Starke, schwache und gemischte Deklination — Übersichtstabellen für B2.", "B2", B2_PART, "reference", "published"),
  plan(119, "b2-26-conjunctions-reference", "Konjunktionen — Referenz", "Koordinierende und subordinierende Konjunktionen — Tabellen für B2.", "B2", B2_PART, "reference", "published"),
  plan(120, "b2-27-verb-conjugation-reference", "Verbkonjugation — Referenz", "Grundformen und Muster unregelmäßiger Verben — B2-Referenztabelle.", "B2", B2_PART, "reference", "published"),
  plan(121, "b2-28-workbook-overview", "B2-Arbeitsbuch — Überblick", "So nutzt du das B2-Übungsbuch systematisch — Struktur und Lernplan.", "B2", B2_PART, "workbook", "published"),
  plan(122, "b2-29-answer-key-b2", "B2-Lösungsschlüssel", "Lösungen für alle B2-Übungen — zum Selbstkorrigieren nach dem Bearbeiten.", "B2", B2_PART, "answer-key", "published"),
  plan(123, "b2-30-connector-writing-guide", "Konnektor-Schreibführer", "B2-Aufsätze und Argumentationstexte mit korrekter Satzgrammatik verfassen.", "B2", B2_PART, "reference", "published"),
  plan(124, "b2-31-indirect-speech-reference", "Indirekte Rede — Kurzreferenz", "Konjunktiv-I-Formen und journalistische Konventionen — Schnellreferenz für B2.", "B2", B2_PART, "reference", "published"),

  // ── C1 Advanced (31) ─────────────────────────────────────────────
  plan(125, "kapitel-25-subjective-modal-verbs-and-double-infinitive", "Subjektive Modalverben und Doppelinfinitiv", "Vermutungen, ironische Distanz und komplexe Modal-Konstruktionen auf C1-Niveau.", "C1", C1_PART, "advanced-verbs", "published", { spiralTopic: "modals" }),
  plan(126, "c1-02-modal-verbs-for-assumptions", "Modalverben für Vermutungen", "müssen, können, dürfen und sollen für logische Schlussfolgerungen und epistemische Lesarten auf C1-Niveau.", "C1", C1_PART, "advanced-verbs", "published", { spiralTopic: "modals" }),
  plan(127, "kapitel-26-advanced-clause-structures-and-participles", "Erweiterte Satzstrukturen und Partizipien", "Partizipialattribute, Partizipialsätze und verkürzte Nebensätze auf C1-Niveau.", "C1", C1_PART, "complex-clauses", "published"),
  plan(128, "c1-04-partizip-i-and-ii-as-clauses", "Partizip I und II als Satzersatz", "Partizipialkonstruktionen als verkürzte Nebensätze — lesen, bilden und vereinfachen auf C1-Niveau.", "C1", C1_PART, "complex-clauses", "published"),
  plan(129, "kapitel-27-nominalisation-and-funktionsverbgefuege", "Nominalisierung und Funktionsverbgefüge", "Verdichtete Schreibstile für Berichte, Wissenschaft und formelle Kommunikation.", "C1", C1_PART, "nominalisation", "published", { spiralTopic: "nominalisation" }),
  plan(130, "c1-06-academic-cohesion-devices", "Akademische Kohäsionsmittel", "jedoch, dennoch, folglich und weitere Konnektoren für Argumentationsfluss auf C1-Niveau.", "C1", C1_PART, "academic-grammar", "published"),
  plan(131, "kapitel-28-academic-cohesion-and-argumentation", "Akademische Kohäsion und Argumentation", "These, Belege, Einräumung und Schlussfolgerung — Grammatik für C1-Texte und Essays.", "C1", C1_PART, "academic-grammar", "published"),
  plan(132, "c1-08-passive-in-academic-writing", "Passiv in akademischer und technischer Schreibweise", "Vorgangspassiv vs. Zustandspassiv, Agensweglassung und Konventionen in Wissenschaft und Technik.", "C1", C1_PART, "academic-grammar", "published", { spiralTopic: "passive" }),
  plan(133, "kapitel-29-register-modal-particles-and-style", "Register, Modalpartikeln und Stil", "doch, halt, eben, ja — und die Wahl zwischen gesprochen, neutral und formell.", "C1", C1_PART, "professional-register", "published"),
  plan(134, "c1-10-formal-register-and-siezen", "Formelles Register und Siezen", "Professionelle Distanz, Anreden, Titel und feste Formulierungen für formelle Kommunikation auf C1-Niveau.", "C1", C1_PART, "professional-register", "published"),
  plan(135, "c1-11-legal-and-administrative-language", "Rechts- und Verwaltungssprache", "Typische bürokratische Strukturen, Nominalstil und feste Formulierungen auf C1-Niveau.", "C1", C1_PART, "professional-register", "published"),
  plan(136, "kapitel-30-editing-advanced-german-texts", "Texte auf C1-Niveau bearbeiten", "Redundanz kürzen, Kongruenz prüfen, Fluss verbessern — systematisches Lektorat.", "C1", C1_PART, "editing", "published"),
  plan(137, "c1-13-style-and-clarity-editing", "Stil- und Klarheitsbearbeitung", "Nominalstil vs. Verbalstil, Verdichtung und Lesbarkeit — bewusste Stilentscheidungen auf C1-Niveau.", "C1", C1_PART, "editing", "published"),
  plan(138, "c1-14-complex-genitive-and-preposition-choices", "Komplexer Genitiv und Präpositionswahl", "Feine Unterschiede bei Genitiv, Präpositionen und festen Verbindungen in formeller Schrift.", "C1", C1_PART, "academic-grammar", "published", { spiralTopic: "cases" }),
  plan(139, "c1-15-evidentiality-and-reporting-verbs", "Evidentialität und Berichtsverben", "angeblich, mutmaßlich, Berichtsverben und Quellenmarkierung in formellen Texten auf C1-Niveau.", "C1", C1_PART, "academic-grammar", "published"),
  plan(140, "c1-16-german-for-everyday-life", "Deutsch im Alltag — C1", "Nuancierte soziale Situationen, indirekte Höflichkeit und kulturelles Register auf C1-Niveau.", "C1", C1_PART, "everyday", "published"),
  plan(141, "c1-17-german-at-work", "Deutsch im Beruf — C1", "Executive Summaries, Richtlinien, Verhandlungen und formelle Berufskommunikation.", "C1", C1_PART, "work", "published"),
  plan(142, "c1-18-german-for-software-engineers", "Deutsch für Software Engineers — C1", "Compliance-Dokumente, Audits, Architecture Decision Records und formelle Tech-Kommunikation.", "C1", C1_PART, "software", "published"),
  plan(143, "c1-19-common-c1-errors", "Typische C1-Fehler", "Über-Nominalisierung, Partikelfehler, Satzüberladung und weitere häufige C1-Probleme.", "C1", C1_PART, "common-errors", "published"),
  plan(144, "c1-20-review-unit-1", "C1 Review — Einheit 1", "Wiederholung: erweiterte Verben, Satzstrukturen und Nominalisierung auf C1-Niveau.", "C1", C1_PART, "review", "published", { isReview: true }),
  plan(145, "c1-21-review-unit-2", "C1 Review — Einheit 2", "Wiederholung: akademische Grammatik, Register, Bearbeitung und Evidentialität.", "C1", C1_PART, "review", "published", { isReview: true }),
  plan(146, "c1-22-c1-level-test", "C1-Niveautest", "Abschließende C1-Grammatikprüfung — alle Kernbereiche des C1-Kurses.", "C1", C1_PART, "tests", "published", { isReview: true }),
  plan(147, "c1-23-funktionsverbgefuege-reference", "Funktionsverbgefüge — Referenz", "Häufige formelle Verb-Nomen-Kombinationen für Berichte, Wissenschaft und Verwaltung.", "C1", C1_PART, "reference", "published"),
  plan(148, "c1-24-academic-connector-reference", "Akademische Konnektoren — Referenz", "Formelle Verknüpfungsmittel für Essays, Berichte und wissenschaftliche Texte.", "C1", C1_PART, "reference", "published"),
  plan(149, "c1-25-register-guide", "Register-Leitfaden — Formell bis informell", "Wann Konjunktiv, Passiv, Nominalisierung und Partikeln passen — Entscheidungshilfe für C1.", "C1", C1_PART, "reference", "published"),
  plan(150, "c1-26-workbook-overview", "C1-Arbeitsbuch — Übersicht", "Einführung in das C1-Übungsbuch: Struktur, Lernpfad und Nutzung der Ergänzungskapitel.", "C1", C1_PART, "workbook", "published"),
  plan(151, "c1-27-answer-key-c1", "C1-Lösungsschlüssel", "Lösungen zu den Übungen der C1-Ergänzungskapitel — Kurzreferenz für Selbstkontrolle.", "C1", C1_PART, "answer-key", "published"),
  plan(152, "c1-28-editing-checklist", "C1-Lektorats-Checkliste", "Schritt-für-Schritt-Prüfung für lange deutsche Texte auf C1-Niveau.", "C1", C1_PART, "reference", "published"),
  plan(153, "c1-29-nominalisation-reference", "Nominalisierung — Referenz", "Häufige Verb- und Adjektiv-zu-Nomen-Mappings für formellen Schreibstil auf C1-Niveau.", "C1", C1_PART, "reference", "published"),
  plan(154, "c1-30-style-comparison-tables", "Stilvergleichstabellen", "Gesprochen vs. schriftlich vs. akademisch — grammatische Wahl auf einen Blick.", "C1", C1_PART, "reference", "published"),
  plan(155, "c1-31-particle-reference", "Modalpartikeln — Referenz", "Bedeutungskarte für doch, ja, mal, halt, eben, wohl und weitere Partikeln auf C1-Niveau.", "C1", C1_PART, "reference", "published"),

  // ── C2 Mastery (31) ──────────────────────────────────────────────
  plan(156, "kapitel-31-subtle-articles-cases-and-prepositions", "Subtile Artikel, Fälle und Präpositionen", "Feine Bedeutungsunterschiede durch kleine grammatische Entscheidungen auf C2-Niveau.", "C2", C2_PART, "grammatical-nuance", "published", { spiralTopic: "cases" }),
  plan(157, "c2-02-article-subtlety-and-definiteness", "Artikel-Nuance und Definitheit", "Wann Nullartikel abstrakte oder generische Bedeutung signalisiert — und wie Definitheit auf C2-Niveau gesteuert wird.", "C2", C2_PART, "grammatical-nuance", "published"),
  plan(158, "kapitel-32-sophisticated-sentence-architecture", "Anspruchsvolle Satzarchitektur", "Geschichtete Sätze, Rahmung, rhetorische Betonung und Diskurskohärenz auf C2-Niveau.", "C2", C2_PART, "sentence-architecture", "published"),
  plan(159, "c2-04-rhetorical-inversion-and-focus", "Rhetorische Inversion und Fokus", "Markierte Wortstellung für Überzeugung, Betonung und stilistische Wirkung auf C2-Niveau.", "C2", C2_PART, "sentence-architecture", "published", { spiralTopic: "word-order" }),
  plan(160, "kapitel-33-advanced-reported-language-and-evidentiality", "Indirekte Rede, Evidentialität und Quellenmarkierung", "Distanz, Quellenangabe und epistemische Nuance in Journalismus, Wissenschaft und Berichten.", "C2", C2_PART, "rhetorical-grammar", "published"),
  plan(161, "c2-06-konjunktiv-shades-of-meaning", "Konjunktiv — Bedeutungsschattierungen", "Stilistische Wahl zwischen Konjunktiv I, II und Indikativ — für Distanz, Ironie und formelle Präzision auf C2-Niveau.", "C2", C2_PART, "rhetorical-grammar", "published", { spiralTopic: "konjunktiv" }),
  plan(162, "kapitel-34-stylistic-variation-and-rhetorical-grammar", "Stilistische Variation und rhetorische Grammatik", "Syntax bewusst variieren — für Wirkung, Klarheit und muttersprachliche Natürlichkeit.", "C2", C2_PART, "stylistic-variation", "published"),
  plan(163, "c2-08-passive-vs-active-stylistic-choice", "Passiv vs. Aktiv — stilistische Wahl", "Konkurrierende Konstruktionen und ihr Register-Effekt — wann Passiv, Aktiv, man oder Zustandspassiv auf C2-Niveau.", "C2", C2_PART, "stylistic-variation", "published", { spiralTopic: "passive" }),
  plan(164, "c2-09-ellipsis-and-compression", "Ellipse und Verdichtung", "Was Muttersprachler weglassen — und wann du auf C2-Niveau bewusst komprimierst.", "C2", C2_PART, "stylistic-variation", "published"),
  plan(165, "kapitel-35-master-level-editing-and-ambiguity", "Meister-Lektorat und Mehrdeutigkeit", "Mehrdeutigkeit erkennen, Referenzketten reparieren und C2-Prosa polieren.", "C2", C2_PART, "mastery-editing", "published"),
  plan(166, "c2-11-ambiguity-and-reference-control", "Mehrdeutigkeit und Referenzkontrolle", "Pronomenreferenz, Relativbereich und Klarheit — wie du auf C2-Niveau Mehrdeutigkeit erkennst und beseitigst.", "C2", C2_PART, "mastery-editing", "published"),
  plan(167, "c2-12-discourse-grammar-across-paragraphs", "Diskursgrammatik über Absätze hinweg", "Kohäsion jenseits des Einzelsatzes — wie Grammatik Absätze und Texte auf C2-Niveau verbindet.", "C2", C2_PART, "sentence-architecture", "published"),
  plan(168, "c2-13-literary-and-journalistic-devices", "Literarische und journalistische Stilmittel", "Stilistische Grammatik in authentischen Hochsprache-Texten — Rhetorik, Rhythmus und Wirkung auf C2-Niveau.", "C2", C2_PART, "rhetorical-grammar", "published"),
  plan(169, "c2-14-regional-and-register-variation", "Regionale und registerbezogene Variation", "Standarddeutsch-Entscheidungen vs. regionale Muster — und wie du Register auf C2-Niveau sicher navigierst.", "C2", C2_PART, "grammatical-nuance", "published"),
  plan(170, "c2-15-german-for-everyday-life", "Deutsch für den Alltag — C2", "Nahezu muttersprachliche soziale Nuance und pragmatische Kontrolle im täglichen Leben auf C2-Niveau.", "C2", C2_PART, "everyday", "published"),
  plan(171, "c2-16-german-at-work", "Deutsch im Beruf — C2", "Kommunikation auf Vorstandsebene und strategische Dokumente — Grammatik für C2-Berufskontexte.", "C2", C2_PART, "work", "published"),
  plan(172, "c2-17-german-for-software-engineers", "Deutsch für Software Engineers — C2", "Rechtlich-technische Texte und präzise Spezifikationsgrammatik für C2-Niveau in der Softwareentwicklung.", "C2", C2_PART, "software", "published"),
  plan(173, "c2-18-common-c2-errors", "Häufige C2-Fehler", "Überkorrektur, unnatürliche Formalität und rhetorische Überladung — typische C2-Fallen und wie du sie vermeidest.", "C2", C2_PART, "common-errors", "published"),
  plan(174, "c2-19-review-unit-1", "C2 Review — Einheit 1", "Wiederholung: Nuance, Satzarchitektur und indirekte Rede — Kapitel 31–33 und Ergänzungen.", "C2", C2_PART, "review", "published", { isReview: true }),
  plan(175, "c2-20-review-unit-2", "C2 Review — Einheit 2", "Wiederholung: Stilvariation, Lektorat und Meisterschaft — Kapitel 34–35 und Ergänzungen.", "C2", C2_PART, "review", "published", { isReview: true }),
  plan(176, "kapitel-36-complete-grammar-review-and-personal-roadmap", "Gesamtreview und persönliche Grammatik-Roadmap", "Das gesamte System von A1 bis C2 verbinden und deinen nächsten Lernpfad planen.", "C2", C2_PART, "review", "published", { isReview: true }),
  plan(177, "c2-22-c2-level-test", "C2-Niveautest", "Abschlussbewertung der C2-Grammatik — Nuance, Architektur, Stil und Lektorat unter Prüfungsbedingungen.", "C2", C2_PART, "tests", "published", { isReview: true }),
  plan(178, "c2-23-complete-grammar-reference", "Vollständiges Grammatik-Referenzbuch", "Meister-Referenz für die gesamte A1–C2-Grammatik-Roadmap — kompakt, systematisch, zum Nachschlagen.", "C2", C2_PART, "reference", "published"),
  plan(179, "c2-24-irregular-verbs-complete", "Unregelmäßige Verben — Vollständige Referenz", "Stammformen der wichtigsten starken und gemischten Verben — Meisterreferenz für A1–C2.", "C2", C2_PART, "reference", "published"),
  plan(180, "c2-25-article-adjective-master-tables", "Artikel- und Adjektiv-Meistertabellen", "Das vollständige Deklinationsystem — starke, schwache und gemischte Endungen in allen Fällen.", "C2", C2_PART, "reference", "published"),
  plan(181, "c2-26-preposition-case-master-guide", "Präpositionen und Kasus — Meisterleitfaden", "Alle wichtigen Präpositionen mit Kasus, Bedeutung und Register-Hinweisen — C2-Meisterreferenz.", "C2", C2_PART, "reference", "published"),
  plan(182, "c2-27-verb-preposition-complete", "Verben mit Präpositionen — Vollständiges Lexikon", "Die wichtigsten Verb-Präposition-Kombinationen mit Kasus und Beispielsätzen — C2-Referenzlexikon.", "C2", C2_PART, "reference", "published"),
  plan(183, "c2-28-noun-gender-plural-complete", "Nomen — Genus und Plural (Vollreferenz)", "Suffixregeln, Ausnahmen und Lernstrategien für der/die/das und Pluralbildung — C2-Meisterreferenz.", "C2", C2_PART, "reference", "published"),
  plan(184, "c2-29-workbook-overview", "Übungsbuch — Gesamtübersicht", "So nutzt du das vollständige Übungs- und Lösungsbuch der 186-Kapitel-Grammatik-Roadmap.", "C2", C2_PART, "workbook", "published"),
  plan(185, "c2-30-answer-key-complete", "Vollständiger Lösungsschlüssel", "Antworten und Hinweise für das gesamte Grammatik-Übungsbuch — organisiert nach Level und Kapiteltyp.", "C2", C2_PART, "answer-key", "published"),
  plan(186, "c2-31-diagnostic-placement-test", "Diagnostischer Einstufungstest (A1–C2)", "Einstufungstest für die gesamte 186-Kapitel-Grammatik-Roadmap — finde dein Level und deine Lücken.", "C2", C2_PART, "tests", "published", { isReview: true }),
];

export function getGrammarManifestStats() {
  const published = GERMAN_GRAMMAR_MANIFEST.filter((c) => c.status === "published").length;
  const scaffold = GERMAN_GRAMMAR_MANIFEST.filter((c) => c.status === "scaffold").length;
  const planned = GERMAN_GRAMMAR_MANIFEST.filter((c) => c.status === "planned").length;

  return {
    total: GERMAN_GRAMMAR_MANIFEST.length,
    published,
    scaffold,
    planned,
    byLevel: (["A1", "A2", "B1", "B2", "C1", "C2"] as GrammarLevel[]).map((level) => ({
      level,
      count: GERMAN_GRAMMAR_MANIFEST.filter((c) => c.level === level).length,
      published: GERMAN_GRAMMAR_MANIFEST.filter(
        (c) => c.level === level && c.status === "published",
      ).length,
    })),
  };
}

export function getGrammarManifestByLevel(level: GrammarLevel) {
  return GERMAN_GRAMMAR_MANIFEST.filter((chapter) => chapter.level === level);
}

export function getGrammarManifestEntry(slug: string) {
  return GERMAN_GRAMMAR_MANIFEST.find((chapter) => chapter.slug === slug) ?? null;
}