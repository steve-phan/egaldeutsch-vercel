import fs from "fs";

const q = (question, options, answerIndex, explanation) => ({
  question,
  options,
  answerIndex,
  explanation,
});

const TOPIC_POOLS = {
  "sentence-structure": [
    q("Wo steht das finite Verb im deutschen Hauptsatz (Aussagesatz)?", ["Am Satzanfang", "An Position 2", "Am Satzende", "Nach dem Objekt"], 1, "Im Aussagesatz steht das konjugierte Verb auf Position 2."),
    q("Welcher Satz ist korrekt?", ["Heute ich lerne Deutsch.", "Heute lerne ich Deutsch.", "Ich heute lerne Deutsch.", "Lerne heute ich Deutsch."], 1, "Nach der Zeitangabe steht das Verb auf Position 2: Heute lerne ich …"),
    q('Was ist das Subjekt in: „Der Kurs beginnt heute."?', ["beginnt", "heute", "Der Kurs", "Der"], 2, "Der Kurs ist der Satzträger — Subjekt."),
    q("Was bildet die Verbklammer im Perfekt?", ["haben/sein + Partizip II", "werden + Infinitiv", "Modal + Infinitiv", "nur das Partizip II"], 0, "Perfekt = Hilfsverb (Position 2) + Partizip II (Ende)."),
    q('Welche Wortart ist „schnell" in: „Er fährt schnell."?', ["Adjektiv (prädikativ/adverbial)", "Nomen", "Artikel", "Konjunktion"], 0, "Hier beschreibt schnell die Art des Fahrens — nicht dekliniert."),
    q("Was ist ein Teilsatz?", ["Ein einzelnes Wort", "Eine Wortgruppe mit grammatischer Funktion", "Nur ein Nebensatz", "Immer ein Relativsatz"], 1, "Teilsätze/Satzglieder sind größere Bausteine."),
    q("Welcher Satz hat korrekte Wortstellung?", ["Morgen wir gehen ins Büro.", "Morgen gehen wir ins Büro.", "Wir morgen gehen ins Büro.", "Gehen wir morgen ins Büro."], 1, "Morgen gehen wir … — Verb an Position 2."),
    q("Was fragt man für das Akkusativobjekt?", ["Wem?", "Wessen?", "Wen oder was?", "Wo?"], 2, "Akkusativobjekt: wen oder was?"),
  ],
  gender: [
    q('Welcher Artikel passt zu „Tisch"?', ["der", "die", "das", "den"], 0, "der Tisch — maskulin."),
    q('Welches Genus hat „Information"?', ["der", "die", "das", "kein Genus"], 1, "die Information — feminin (-tion)."),
    q("Welcher Plural ist korrekt?", ["die Buchs", "die Bücher", "die Buch", "die Büch"], 1, "das Buch → die Bücher."),
    q('Welche Endung deutet oft auf „die" hin?', ["-ung", "-chen", "-ment", "-ismus (immer der)"], 0, "-ung ist fast immer feminin."),
    q('Was ist das Genus von „Mädchen"?', ["der", "die", "das", "neutral ohne Artikel"], 2, "das Mädchen — -chen ist Neutrum."),
    q("Welcher Satz ist korrekt?", ["Ich kaufe ein Auto.", "Ich kaufe eine Auto.", "Ich kaufe der Auto.", "Ich kaufe das Auto neu."], 0, "das Auto → ein Auto im Akkusativ."),
    q('„Häuser" — was passiert im Plural?', ["nur -s", "Umlaut a→ä + -er", "-en ohne Umlaut", "gleich wie Singular"], 1, "das Haus → die Häuser."),
    q("Welches Nomen ist neutrum?", ["der Computer", "die Lampe", "das Handy", "die Zeitung"], 2, "das Handy — viele Tech-Wörter sind das."),
  ],
  cases: [
    q('Welcher Kasus braucht „geben" für die Person: Ich gebe ___ das Buch.', ["Akkusativ (das Buch)", "Dativ (der Person)", "Genitiv", "Nominativ"], 1, "geben + Dativ (wem?) + Akkusativ (was?)."),
    q("Welcher Artikel ist korrekt: Ich sehe ___ Mann.", ["der", "den", "dem", "des"], 1, "sehen + Akkusativ: den Mann."),
    q('Nach „sein" steht das Prädikatsnomen im …', ["Akkusativ", "Dativ", "Nominativ", "Genitiv"], 2, "Er ist Lehrer. — Nominativ nach sein."),
    q("Welcher Satz ist korrekt?", ["Ich helfe den Freund.", "Ich helfe dem Freund.", "Ich helfe der Freund.", "Ich helfe des Freundes."], 1, "helfen + Dativ: dem Freund."),
    q('„Wegen ___ Wetters" — welcher Kasus?', ["Dativ (dem Wetter)", "Genitiv (des Wetters)", "Akkusativ", "Nominativ"], 1, "wegen + Genitiv: wegen des Wetters."),
    q("Ich kaufe ___ Apfel. (ein → Akkusativ maskulin)", ["ein", "einen", "einem", "eines"], 1, "einen Apfel — Akkusativ maskulin."),
    q("Welcher Pronomensatz ist korrekt?", ["Ich sehe er.", "Ich sehe ihn.", "Ich sehe ihm.", "Ich sehe sein."], 1, "Akkusativ: ich sehe ihn."),
    q("Schwaches Nomen im Dativ Plural: mit ___ Kindern", ["die", "der", "den", "des"], 2, "den Kindern — Dativ Plural mit -n."),
  ],
  verbs: [
    q("Welche Form ist korrekt: du ___ (lesen)", ["liest", "lest", "lese", "lesst"], 0, "du liest — Stammvokalwechsel e→ie."),
    q('Welches Hilfsverb im Perfekt: „Er ist gegangen."?', ["haben", "sein", "werden", "können"], 1, "Bewegungsverben mit sein: ist gegangen."),
    q("Regelmäßiges Präsens: wir ___ (machen)", ["macht", "machen", "mache", "machst"], 1, "wir machen — Endung -en."),
    q("Welches Partizip II ist korrekt?", ["gegangt", "gegangen", "gegangtet", "gangen"], 1, "gegangen — unregelmäßig."),
    q('„Er ___ nach Hause." (fahren, 3. Person Sg.)', ["fahrt", "fährt", "fahre", "fahren"], 1, "er fährt — Stammvokal a→ä."),
    q("Trennbares Verb im Präsens: Ich ___ um 8 Uhr ___ . (anfangen)", ["fange … an", "anfange …", "fange an …", "an … fange"], 0, "Ich fange um 8 Uhr an — Präfix ans Ende."),
    q("Welcher Satz im Perfekt ist korrekt?", ["Ich habe gestern gekauft ein Buch.", "Ich habe gestern ein Buch gekauft.", "Ich gekauft habe gestern ein Buch.", "Gestern ich habe ein Buch gekauft."], 1, "habe + Mittelfeld + Partizip II am Ende."),
    q('„werden" im Präsens: sie ___', ["werde", "wird", "werden", "werdet"], 2, "sie werden — Plural."),
  ],
  modals: [
    q("Welcher Satz ist korrekt?", ["Ich kann gut schwimmen.", "Ich kann schwimmen gut.", "Ich schwimmen kann gut.", "Kann ich gut schwimmen. (Aussage)"], 0, "Modal + Infinitiv am Satzende."),
    q('Was bedeutet „Du musst das Formular ausfüllen."?', ["Du darfst es optional machen.", "Es ist eine Pflicht.", "Es ist unmöglich.", "Es ist eine Höflichkeitsbitte."], 1, "müssen = Pflicht."),
    q("Welche Wortstellung mit Modal?", ["Ich muss heute arbeiten gehen.", "Ich muss heute gehen arbeiten.", "Ich muss gehen heute arbeiten.", "Heute ich muss arbeiten."], 0, "Modal auf Position 2, Infinitiv am Ende."),
    q('„Er ___ nicht kommen." (dürfen, verboten)', ["darf", "muss", "kann", "soll"], 0, "nicht dürfen = verboten."),
    q("Subjektives müssen bedeutet oft …", ["eine Vermutung (Er muss krank sein.)", "eine Einladung", "ein Wunsch", "ein Passiv"], 0, "müssen kann epistemisch sein."),
    q("Doppelinfinitiv: Er hat … müssen.", ["arbeiten gehen", "gehen arbeiten", "gearbeitet gehen", "gehen gearbeitet"], 0, "hat … arbeiten müssen — beide Infinitive am Ende."),
    q('„Wir ___ gern Kaffee." (mögen)', ["mögt", "mögen", "mag", "möge"], 1, "wir mögen."),
    q('Was drückt „können" hier aus: „Ich kann Deutsch."?', ["Fähigkeit", "Pflicht", "Verbot", "Vergangenheit"], 0, "können = Fähigkeit."),
  ],
  prepositions: [
    q('Welcher Kasus nach „mit"?', ["Akkusativ", "Dativ", "Genitiv", "Nominativ"], 1, "mit + Dativ: mit dem Auto."),
    q('Wo? (Position) — „Das Buch liegt ___ dem Tisch." (auf)', ["auf den Tisch", "auf dem Tisch", "auf der Tisch", "auf des Tisches"], 1, "Wo? → Dativ: auf dem Tisch."),
    q('Wohin? (Richtung) — „Ich lege das Buch ___ den Tisch." (auf)', ["auf dem Tisch", "auf den Tisch", "auf der Tisch", "auf das Tisch"], 1, "Wohin? → Akkusativ: auf den Tisch."),
    q("Welche Präposition ist immer Akkusativ?", ["mit", "für", "bei", "aus"], 1, "für + Akkusativ: für dich."),
    q('„Ich komme ___ Deutschland."', ["von", "aus", "bei", "mit"], 1, "aus + Dativ: aus Deutschland."),
    q('„Warten ___ den Bus" — welcher Kasus?', ["Akkusativ (auf den Bus)", "Dativ (auf dem Bus)", "Genitiv", "ohne Präposition"], 0, "warten auf + Akkusativ."),
    q("Welcher Satz ist korrekt?", ["Ich gehe in die Schule.", "Ich gehe in der Schule. (wohin?)", "Ich gehe in dem Schule.", "Ich gehe in des Schule."], 0, "Wohin? in die Schule — Akkusativ."),
    q("Dativpräposition: Ich bin ___ der Arbeit.", ["bei", "für", "durch", "um"], 0, "bei + Dativ: bei der Arbeit."),
  ],
  "word-order": [
    q("TeKaMoLo-Reihenfolge (Standard):", ["Ort – Zeit – Art – Grund", "Zeit – Grund – Art – Ort", "Art – Zeit – Ort – Grund", "Grund – Ort – Zeit – Art"], 1, "TeKaMoLo: Temporal – Kausal – Modal – Lokal."),
    q("Nebensatz: Wo steht das Verb?", ["Position 2", "Am Anfang", "Am Ende", "Nach dem Subjekt"], 2, "Im Nebensatz steht das konjugierte Verb am Ende."),
    q('„weil" ist …', ["ein nebenordnender Konnektor", "ein unterordnender Konnektor (Verb ans Ende)", "ein Adverb", "ein Artikel"], 1, "weil leitet Nebensatz ein → Verb ans Ende."),
    q("Welcher Satz ist korrekt?", ["Ich weiß, dass er kommt morgen.", "Ich weiß, dass er morgen kommt.", "Ich weiß, dass kommt er morgen.", "Ich weiß, er dass morgen kommt."], 1, "dass-Satz: Verb am Ende."),
    q('Bei „und/aber/oder" bleibt das Verb …', ["am Satzende des Nebensatzes", "auf Position 2 im zweiten Hauptsatz", "vor dem Subjekt", "ganz weg"], 1, "Nebenordnung: …, aber er kommt morgen."),
    q("Vorfeld kann enthalten …", ["meist ein Satzglied", "immer zwei Verben", "nur Artikel", "nie Pronomen"], 0, "Vorfeld = Position 1."),
    q("Objektreihenfolge: Ich gebe dir das Buch.", ["Dativpronomen vor Akkusativ", "Akkusativ vor Dativ", "Genitiv zuerst", "beliebig"], 0, "Pronomen-Dativ vor Akkusativ."),
    q("W-Frage: Wo steht das Verb?", ["Position 2 (nach dem W-Wort)", "am Ende", "Position 1", "nach dem Objekt"], 0, "Wann kommst du? — W-Wort + Verb."),
  ],
  tenses: [
    q("Wann nutzt man Präteritum im Alltag oft?", ["bei sein/haben und Modalverben", "nie", "nur in Nebensätzen", "nur im Passiv"], 0, "war, hatte, konnte — häufig gesprochen."),
    q("Plusquamperfekt bildet man mit …", ["hatte/war + Partizip II", "wird + Partizip II", "hat + Infinitiv", "würde + Infinitiv"], 0, "Vorzeitigkeit: hatte gemacht."),
    q("Futur I: morgen ___ wir das Problem lösen.", ["werden", "wurden", "worden", "wird"], 0, "werden + Infinitiv."),
    q('Welche Zeit passt zu „gestern"?', ["Präsens", "Perfekt oder Präteritum", "Futur II", "Plusquamperfekt"], 1, "gestern → Vergangenheit."),
    q('„Nachdem er gegessen hatte, ging er spazieren." — Zeit im ersten Teil?', ["Perfekt", "Plusquamperfekt", "Präteritum", "Futur I"], 1, "nachdem + Plusquamperfekt."),
    q("Präsens mit Zukunftsbedeutung: Morgen ___ ich nach Berlin.", ["fahre", "fuhr", "werde fahren", "bin gefahren"], 0, "Morgen fahre ich … — Präsens + Zeitangabe."),
    q("Futur II drückt oft aus …", ["Vermutung über Vergangenes", "Gegenwart", "Wunsch", "Imperativ"], 0, "Futur II = Schluss auf Vergangenes."),
    q("Welcher Satz im Perfekt ist falsch?", ["Sie ist nach Hause gegangen.", "Er hat gegessen.", "Wir sind gefahren.", "Er hat nach Hause gegangen."], 3, "gehen → sein: Er ist nach Hause gegangen."),
  ],
  "separable-verbs": [
    q("Präsens: Ich ___ das Licht ___ . (anmachen)", ["mache … an", "anmache …", "mache an …", "an … mache"], 0, "Ich mache das Licht an."),
    q("Perfekt: Ich habe das Licht …", ["angemacht", "gemacht an", "an habe gemacht", "machte an"], 0, "angemacht."),
    q('„sich anmelden" ist …', ["reflexiv", "passiv", "nur Genitiv", "untrennbar"], 0, "sich anmelden — reflexiv trennbar."),
    q("Im Nebensatz: …, weil ich mich früh …", ["anmelde", "melde an", "anmeldete", "meldete mich an"], 1, "Nebensatz: … weil ich mich früh anmelde."),
    q('Untrennbar: „Ich ___ das." (verstehen)', ["verstehe", "stehe … ver", "ver … stehe", "stehe ver"], 0, "ver- ist untrennbar."),
    q("Reflexiv Akkusativ: Ich freue mich auf …", ["den Urlaub", "dem Urlaub", "des Urlaubs", "den Urlauben"], 0, "sich freuen auf + Akkusativ."),
    q('„einloggen" im Perfekt:', ["habe eingeloggt", "habe mich eingeloggt", "bin eingeloggt", "habe logge ein"], 1, "Ich habe mich eingeloggt."),
    q("Trennbares Präfix im Hauptsatz steht …", ["vor dem Verb", "am Satzende", "in Position 2", "im Vorfeld"], 1, "… Ich mache es heute an."),
  ],
  "adjective-endings": [
    q("Nach bestimmtem Artikel (Akk. mask.): ___ großen Tisch", ["der", "den", "dem", "des"], 1, "den großen Tisch — -en."),
    q("Ohne Artikel (Nom. mask.): ___ alter Mann", ["alter", "alten", "alte", "altem"], 0, "alter Mann — starke Endung."),
    q("Nach ein (Nom. neutr.): ___ kleines Kind", ["kleines", "kleinen", "kleinem", "kleiner"], 0, "ein kleines Kind."),
    q("Prädikativ: Das Essen ist …", ["gut (nicht dekliniert)", "gutes", "guten", "guter"], 0, "Das Essen ist gut."),
    q("Komparativ: Berlin ist ___ als München.", ["groß", "größer", "am größten", "mehr groß"], 1, "größer als."),
    q("Akk. fem. nach der: Ich sehe ___ neue Kollegin.", ["die", "der", "den", "des"], 0, "die neue Kollegin."),
    q("Superlativ mit am: …", ["am schnellsten", "schnellsten", "der schnellste", "mehr schnell"], 0, "am schnellsten."),
    q("Welcher Satz hat falsche Adjektivendung?", ["Ich kaufe einen roten Apfel.", "Ich kaufe ein roter Apfel.", "Ich kaufe einen schönen Apfel.", "Ich kaufe einen grünen Apfel."], 1, "einen roten Apfel — Akk. mask."),
  ],
  "subordinate-clauses": [
    q('„obwohl" drückt aus …', ["Grund", "Gegensatz/Konzession", "Zeit", "Zweck"], 1, "obwohl = Konzession."),
    q("Welcher Satz ist korrekt?", ["Weil ich müde bin, ich gehe schlafen.", "Weil ich müde bin, gehe ich schlafen.", "Weil ich müde bin, schlafen ich gehe.", "Weil bin ich müde, gehe ich schlafen."], 1, "Nebensatz + Hauptsatz Verb Pos. 2."),
    q('„damit" drückt … aus', ["Zweck", "Zeit", "Gegensatz", "Vergleich"], 0, "damit = Final."),
    q("Indirekte Frage: Er fragt, …", ["wohin ich gehe.", "wohin gehe ich.", "ich wohin gehe.", "gehe ich wohin."], 0, "Verb am Ende."),
    q('„wenn" für Gewohnheit: Wenn ich Zeit habe, …', ["ging ich spazieren.", "gehe ich spazieren.", "werde gegangen.", "ich gehe spazieren."], 1, "wenn + Präsens für Gewohnheit."),
    q('„als" nutzt man oft für …', ["einmalige Vergangenheit", "Zukunft", "Gegenwart immer", "Imperativ"], 0, "Als ich Kind war …"),
    q('„sodass" zeigt …', ["Folge/Konsequenz", "Gegensatz", "Zeit", "Ort"], 0, "sodass = Konsekutiv."),
    q('„bevor" + Nebensatz: Verb …', ["Position 2", "am Ende", "am Anfang", "wegfallen"], 1, "bevor ich gehe — Verb am Ende."),
  ],
  "relative-clauses": [
    q("Nom. mask.: Der Mann, ___ dort steht, …", ["der", "den", "dem", "dessen"], 0, "der Mann, der …"),
    q("Akk. mask.: Der Mann, ___ ich kenne, …", ["der", "den", "dem", "dessen"], 1, "den ich kenne."),
    q("Dativ: Die Frau, ___ ich helfe, …", ["die", "der", "den", "dessen"], 1, "der ich helfe."),
    q("Genitiv: Der Kollege, ___ Auto kaputt ist, …", ["dessen", "deren", "denen", "dem"], 0, "dessen Auto."),
    q("Präposition + Relativ: Das Haus, in ___ ich wohne, …", ["dem", "den", "der", "das"], 0, "in dem ich wohne."),
    q("was als Relativpronomen bezieht sich auf …", ["ganzen Satz oder neutrales Bezugswort", "nur Personen", "nur Plural", "immer Akkusativ"], 0, "alles, was …"),
    q("wo-Relativsatz: Die Stadt, ___ ich geboren wurde, …", ["wo", "wann", "wie", "was"], 0, "wo für Orte."),
    q("Relativsatz: Verb steht …", ["Position 2", "am Ende", "nach dem Relativpronomen", "im Vorfeld"], 1, "Verb am Ende."),
  ],
  passive: [
    q("Vorgangspassiv Präsens: Die Tür …", ["wird geöffnet", "ist geöffnet", "wurde öffnen", "hat geöffnet"], 0, "werden + Partizip II."),
    q("Zustandspassiv: Die Tür …", ["wird geöffnet", "ist geöffnet", "wird öffnen", "wurde werden"], 1, "sein + Partizip II."),
    q("Passiv Präteritum: Das Haus … 1990 gebaut.", ["wird", "wurde", "worden", "wäre"], 1, "wurde gebaut."),
    q("Agens mit von: …", ["von + Dativ", "von + Akkusativ", "von + Genitiv", "mit + Dativ"], 0, "von dem Architekten."),
    q("Passiv mit Modal: Das muss …", ["werden gemacht", "gemacht werden", "wird gemacht", "machen werden"], 1, "gemacht werden."),
    q('„man" als Passiversatz:', ["raucht nicht", "darf nicht rauchen", "wird nicht geraucht", "ist nicht geraucht"], 1, "man + Modal."),
    q('Partizip II im Passiv von „senden":', ["gesendet", "gesandt", "sendet", "gesendetet"], 0, "wurde gesendet."),
    q("Unpersönliches Passiv: Es … viel gearbeitet.", ["wird", "ist", "hat", "sind"], 0, "Es wird viel gearbeitet."),
  ],
  konjunktiv: [
    q("Konjunktiv II Höflichkeit: … Sie mir bitte helfen?", ["Können", "Könnten", "Konnten", "Könnt"], 1, "Könnten Sie …"),
    q("Irreale Gegenwart: Wenn ich Zeit hätte, …", ["reise ich", "würde ich reisen", "reiste ich", "werde reisen"], 1, "würde + Infinitiv."),
    q("Irreale Vergangenheit: Wenn ich das gewusst hätte, …", ["helfe ich dir", "hätte ich dir geholfen", "würde ich helfen", "helfe ich"], 1, "hätte + Partizip II."),
    q("Konjunktiv I indirekte Rede: Er sagte, er … krank.", ["ist", "sei", "wäre", "wird"], 1, "er sei krank."),
    q("Wenn Konjunktiv I = Indikativ, nutzt man oft …", ["Konjunktiv II oder würde-Form", "Englisch", "Imperativ", "Nominativ"], 0, "er würde kommen."),
    q('„wünschte" drückt … aus', ["Bedauern/Wunsch", "Fakt", "Zukunftssicherheit", "Passiv"], 0, "Ich wünschte …"),
    q("Als ob + Konjunktiv II: Er tut, als ob er …", ["weiß alles", "alles wüsste", "wissen alles", "alles wissen"], 1, "als ob er alles wüsste."),
    q('Konjunktiv II von „sein": ich …', ["bin", "wäre", "sei", "war"], 1, "ich wäre."),
  ],
  nominalisation: [
    q('Nominalisierung von „entwickeln":', ["die Entwicklung", "das Entwickeln", "der Entwickler", "die Entwickelung"], 0, "die Entwicklung."),
    q('Funktionsverbgefüge: „eine Entscheidung treffen" ≈', ["entscheiden", "laufen", "schreiben", "lesen"], 0, "treffen + Entscheidung."),
    q("Nominalstil ist typisch für …", ["formelle/akademische Texte", "SMS", "Imperativ", "Fragen"], 0, "Berichte nutzen Nominalisierung."),
    q('„zur Verfügung stellen" ≈', ["verfügbar machen", "vergessen", "löschen", "kaufen"], 0, "bereitstellen."),
    q("Verb → Nomen: analysieren →", ["die Analyse", "das Analysieren", "der Analys", "die Analysung"], 0, "die Analyse."),
    q("Vorteil Nominalstil:", ["kompakter, formeller Ausdruck", "immer leichter", "keine Artikel", "nur A1"], 0, "Nominalstil verdichtet."),
    q("Nachteil Über-Nominalisierung:", ["schwerer lesbar", "immer falsch", "nur Passiv", "nur Plural"], 0, "Balance wichtig."),
    q('„in Betracht ziehen" ≈', ["berücksichtigen", "ablehnen", "vergessen", "bezahlen"], 0, "berücksichtigen."),
  ],
};

const UNIT_POOLS = {
  everyday: [
    q('Im Supermarkt: „Ich hätte gern …"', ["zwei Brötchen (Akk.)", "zwei Brötchen (Dativ)", "zwei Brötchen (Genitiv)", "von zwei Brötchen"], 0, "haben möchten + Akkusativ."),
    q('Termin: „Können wir den Termin verschieben?"', ["höfliche Modalbitte", "Imperativ", "Passiv", "Genitiv"], 0, "Können wir …"),
    q('Beim Arzt: „seit" + …', ["Dativ", "Akkusativ", "Genitiv", "Nominativ"], 0, "seit drei Tagen."),
    q('Smalltalk: „Wie geht es Ihnen?"', ["Dativ (mir gut)", "Akkusativ", "Genitiv", "ohne Ergänzung"], 0, "es geht mir gut."),
    q('Beschwerde: „Das funktioniert nicht."', ["nicht", "kein", "nie", "niemand"], 0, "nicht verneint das Verb."),
  ],
  work: [
    q("E-Mail-Einstieg formell:", ["Sehr geehrte Frau Müller,", "Hey Müller,", "Du Frau Müller,", "Liebe Müller"], 0, "Sehr geehrte …"),
    q("Meeting-Sprache Register?", ["neutral/formell", "sehr umgangssprachlich", "nur gesprochen", "poetisch"], 0, "Berufssprache."),
    q('„Ich schicke Ihnen die Unterlagen zu." — Ihnen"', ["Dativ", "Akkusativ", "Nominativ", "Genitiv"], 0, "jemandem etwas schicken."),
    q("Handover: Plusquamperfekt für …", ["Vorzeitigkeit", "Zukunft", "Wunsch", "Frage"], 0, "Nachdem + Plusquamperfekt."),
    q('„Wir müssen die Deadline einhalten."', ["Pflicht", "Vermutung", "Verbot", "Wunsch"], 0, "müssen = Pflicht."),
  ],
  software: [
    q('Ticket: „Der Bug wurde behoben."', ["Passiv", "Aktiv Präsens", "Konjunktiv I", "Imperativ"], 0, "wurde behoben."),
    q('Standup: „Ich arbeite gerade am Login-Fix."', ["laufende Tätigkeit", "Vergangenheit", "Zukunft", "Bedingung"], 0, "arbeite gerade."),
    q("Deployment: Verbposition?", ["Position 2", "am Ende", "am Anfang", "weg"], 0, "Wir deployen heute …"),
    q('„Das Feature ist implementiert."', ["sein + Partizip II", "werden + Infinitiv", "haben + Infinitiv", "würde"], 0, "Zustandspassiv."),
    q("RFC-Sprache:", ["die Implementierung der API", "wir implementieren schnell", "implementiert!", "implementierst du"], 0, "Nominalisierung."),
  ],
  review: [
    q("Bei Review-Einheit …", ["Lösungen erst nach Versuch öffnen", "nur Titel lesen", "alles überspringen", "nur neue Kapitel"], 0, "Review = aktives Abrufen."),
    q("Spiralcurriculum bedeutet …", ["Themen kehren auf höherem Niveau zurück", "jedes Thema nur einmal", "keine Wiederholung", "nur C2"], 0, "Strukturen wiederholen sich."),
    q("Effektive Wiederholung:", ["Fehler notieren und üben", "alles neu ohne Üben", "nur Quiz", "nur Vokabeln"], 0, "Fehleranalyse."),
    q("Checkliste am Kapitelende …", ["Selbstkontrolle", "nur Formatierung", "nur Lehrer", "Wörterbuch"], 0, "Metakognition."),
    q("Review nach ~5 Kapiteln …", ["festigt Langzeitgedächtnis", "ist unnötig", "ersetzt Lesen", "nur für Tests"], 0, "Verteiltes Lernen."),
  ],
  tests: [
    q("Bei Einstufungstest …", ["realistische Bedingungen", "sofort Lösungen", "eine Frage", "Wörterbuch"], 0, "Ehrliches Niveau."),
    q("Nach dem Test …", ["Fehlercluster analysieren", "Ergebnis ignorieren", "direkt C2", "nichts wiederholen"], 0, "Fehleranalyse."),
    q("Level-Test prüft …", ["mehrere Themen", "nur eine Regel", "nur Wortschatz", "nur Aussprache"], 0, "Breite Abdeckung."),
    q("Diagnostic Test bedeutet …", ["Startniveau finden", "nur C2", "keine Grammatik", "nur Schreiben"], 0, "Placement."),
    q("Bei Unsicherheit …", ["beste Option wählen", "leer lassen", "aufhören", "alles gleich"], 0, "Strategie."),
  ],
  reference: [
    q("Referenzkapitel nutzt man …", ["zum Nachschlagen und Abruf", "nur einmal", "statt Übungen", "ohne Tabellen"], 0, "Werkzeug."),
    q("Deklinationstabellen …", ["mit Beispielsätzen verbinden", "nur auswendig", "ignorieren", "nur im Kopf"], 0, "Tabellen + Sätze."),
    q("Unregelmäßige Verben: wichtig …", ["Präsens, Präteritum, Partizip II", "nur Infinitiv", "nur Plural", "nur Artikel"], 0, "Hauptformen."),
    q("Verb-Präposition-Wörterbuch …", ["feste Kombinationen", "nur Wortstellung", "nur Genus", "Imperativ"], 0, "warten auf."),
    q("Answer Key richtig …", ["Regel verstehen", "nur abschreiben", "ohne Versuch", "überspringen"], 0, "Erklärung."),
  ],
  "common-errors": [
    q("Typischer A1-Fehler:", ["falsche Wortstellung", "Konjunktiv I", "Genitiv überall", "Doppelinfinitiv"], 0, "Verbposition."),
    q("A2-Fehler Dativ/Akkusativ:", ["wem? vs. wen/was?", "immer Akkusativ", "immer Dativ", "Genitiv raten"], 0, "Kasusfragen."),
    q("B1-Fehler Relativsatz:", ["Kasus des Relativpronomens", "nur Genus", "Verb ans Anfang", "kein Verb"], 0, "der/den/dem/dessen."),
    q("B2-Fehler Adjektiv:", ["starke/schwache/gemischte Deklination", "nie Endungen", "immer -e", "nur Plural"], 0, "Drei Arten."),
    q("C1-Fehler Über-Nominalisierung …", ["erschwert Lesbarkeit", "immer besser", "nur A1", "ersetzt Verben nie"], 0, "Balance."),
  ],
  introduction: [
    q("Grammatikbegriffe helfen …", ["Sätze zu analysieren", "nur Vokabeln", "Aussprache ersetzen", "Kultur ignorieren"], 0, "Begriffe = Werkzeuge."),
    q("Subjekt fragt man mit …", ["Wer oder was?", "Wen oder was?", "Wem?", "Wohin?"], 0, "Wer oder was?"),
    q("Hauptsatz vs. Nebensatz:", ["Verb im Nebensatz am Ende", "Verb Pos. 2 im Nebensatz", "Verb Pos. 1", "kein Verb"], 0, "Nebensatz: Verb am Ende."),
    q('Wortarten: „und" ist …', ["Konjunktion", "Artikel", "Verb", "Präposition"], 0, "und verbindet."),
    q("Deutsch zeigt Beziehungen durch …", ["Artikel, Endungen, Wortstellung", "nur Tonfall", "nur Länge", "nur Großschreibung"], 0, "Morphologie + Syntax."),
  ],
};

const LEVEL_POOLS = {
  A1: [
    q("A1: Artikel lernst du …", ["immer mit dem Nomen", "getrennt", "nur Plural", "nur schriftlich"], 0, "der/die/das + Nomen."),
    q('A1: „nicht" steht typischerweise …', ["vor dem verneinten Teil", "immer am Anfang", "nach dem Verb", "nie im Satz"], 0, "nicht gut."),
    q('A1 Imperativ du: „Komm!"', ["Stamm ohne -en", "-st", "-t", "-en"], 0, "Komm!"),
    q("A1: kein verneint …", ["Nomen (kein Apfel)", "Verben", "Sätze", "Präpositionen"], 0, "kein + Nomen."),
    q('A1: „um drei Uhr"', ["um + Akkusativ", "in + Dativ", "an + Genitiv", "ohne Präposition"], 0, "um drei Uhr."),
  ],
  A2: [
    q("A2 Perfekt Hilfsverb wir:", ["haben", "sein", "werden", "können"], 0, "wir haben gemacht."),
    q('A2: „mir" ist …', ["Dativ von ich", "Akkusativ", "Genitiv", "Nominativ"], 0, "ich → mir."),
    q("A2: größer ___ Berlin", ["als", "wie", "denn", "ob"], 0, "größer als."),
    q('A2: „so … wie"', ["Gleichheit", "Überlegenheit", "Gegensatz", "Zweck"], 0, "so groß wie."),
    q("A2 weil-Satz:", ["Verb am Ende", "Verb Pos. 2", "kein Verb", "Verb zuerst"], 0, "weil ich müde bin."),
  ],
  B1: [
    q("B1 Genitiv Standard:", ["wegen des Wetters", "wegen dem Wetter", "wegen die Wetter", "wegen das Wetter"], 0, "wegen + Genitiv."),
    q("B1 Passiv Präsens:", ["wird geöffnet", "ist geöffnet", "wurde öffnen", "hat geöffnet"], 0, "wird = Präsens."),
    q("B1 um … zu:", ["Zweck", "Gegensatz", "Zeit", "Ort"], 0, "Final."),
    q("B1 würde gern:", ["höflicher Wunsch", "Vergangenheit", "Passiv", "Imperativ"], 0, "Konjunktiv II."),
    q("B1 vertrauen + …", ["Dativ (dem)", "Akkusativ", "Nominativ", "Genitiv Plural"], 0, "vertrauen + Dativ."),
  ],
  B2: [
    q("B2 Nachfeld ist …", ["rechts nach der Verbklammer", "links vor dem Verb", "nur Subjekt", "nur Artikel"], 0, "Nachfeld."),
    q("B2 indirekte Rede:", ["Konjunktiv I", "Imperativ", "Passiv", "Futur II"], 0, "er komme."),
    q("B2 je … desto:", ["desto besser wirst du.", "besser du wirst.", "du desto wirst.", "wirst desto du."], 0, "je … desto."),
    q("B2 Partizipialattribut:", ["attribuiert vor dem Nomen", "nach dem Verb", "nur Nebensatz", "nie dekliniert"], 0, "der angekommene Zug."),
    q("B2 als ob:", ["irreale Vergleichssituation", "Fakt", "Zukunft", "Passiv"], 0, "Konjunktiv II."),
  ],
  C1: [
    q('C1 „doch" kann …', ["Betonung/Kontrast", "nur Zeit", "Passiv bilden", "Genitiv"], 0, "Modalpartikel."),
    q("C1 in Kraft treten ≈", ["wirksam werden", "laufen", "schlafen", "essen"], 0, "wirksam werden."),
    q("C1 jedoch verbindet …", ["Gegensatz", "nur Zeit", "nur Ort", "Genus"], 0, "Textkonnektor."),
    q("C1 Siezen in E-Mails …", ["üblich", "immer falsch", "nur mündlich", "nur Freunde"], 0, "formelle Distanz."),
    q("C1 angeblich …", ["unsichere Quelle", "Gewissheit", "Imperativ", "Plural"], 0, "Evidentialität."),
  ],
  C2: [
    q("C2 Nullartikel: ___ Liebe ist wichtig.", ["(kein Artikel)", "die", "der", "das"], 0, "Abstrakta."),
    q("C2 Inversion Wirkung?", ["Betonung/Focus", "Fehler", "nur Umgangssprache", "Genitiv"], 0, "Rhetorik."),
    q('C2 Ellipse: „Schön, dich zu sehen."', ["Subjekt/Verb weggelassen", "nichts fehlt", "Artikel", "Plural"], 0, "Elliptisch."),
    q("C2 Mehrdeutigkeit klären …", ["eindeutige Referenz", "mehr Pronomen", "ohne Subjekt", "Englisch"], 0, "Referenzketten."),
    q("C2 Passiv vs. Aktiv …", ["Agens, Register, Fokus", "nur Länge", "nur Genus", "Zufall"], 0, "Stilwahl."),
  ],
};

const manifest = fs.readFileSync("src/lib/german-grammar-manifest.ts", "utf8");
const entryBlocks = manifest.split(/\n  plan\(/).slice(1);
const parsed = entryBlocks
  .map((block) => {
    const slug = block.match(/^(\d+), "([^"]+)"/)?.[2];
    const title = block.match(/, "([^"]+)", "([^"]+)", "([A-Z]\d)"/);
    const spiral = block.match(/spiralTopic: "([^"]+)"/)?.[1];
    const unit = block.match(/"([A-Z]\d)", [^,]+, "([^"]+)"/)?.[2];
    return slug
      ? {
          slug,
          title: title?.[1],
          spiralTopic: spiral,
          unit,
          level: title?.[3],
        }
      : null;
  })
  .filter(Boolean);

const SLUG_OVERRIDES = {};
for (const entry of parsed) {
  if (!entry.slug.startsWith("kapitel-")) continue;
  const topic = entry.spiralTopic || entry.unit || "introduction";
  const pool =
    TOPIC_POOLS[topic] ||
    UNIT_POOLS[entry.unit] ||
    LEVEL_POOLS[entry.level] ||
    LEVEL_POOLS.A1;
  const h = entry.slug.split("").reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 0);
  const qs = [];
  for (let i = 0; i < 4; i++) qs.push(pool[(h + i) % pool.length]);
  SLUG_OVERRIDES[entry.slug] = qs;
}

const out = `// Auto-generated rich grammar quiz bank
import type { RoadToB2QuizQuestion } from "@/lib/road-to-b2-quizzes";

export type GrammarQuizQuestion = RoadToB2QuizQuestion;

export const TOPIC_POOLS: Record<string, GrammarQuizQuestion[]> = ${JSON.stringify(TOPIC_POOLS, null, 2)};

export const UNIT_POOLS: Record<string, GrammarQuizQuestion[]> = ${JSON.stringify(UNIT_POOLS, null, 2)};

export const LEVEL_POOLS: Record<string, GrammarQuizQuestion[]> = ${JSON.stringify(LEVEL_POOLS, null, 2)};

export const SLUG_OVERRIDES: Record<string, GrammarQuizQuestion[]> = ${JSON.stringify(SLUG_OVERRIDES, null, 2)};

export function hashSlug(slug: string): number {
  return slug.split("").reduce((hash, char) => ((hash * 31) + char.charCodeAt(0)) >>> 0, 0);
}

export function pickFromPool(pool: GrammarQuizQuestion[], slug: string, count: number): GrammarQuizQuestion[] {
  if (pool.length === 0) return [];
  const start = hashSlug(slug) % pool.length;
  const picked: GrammarQuizQuestion[] = [];
  const used = new Set<number>();
  for (let i = 0; i < pool.length && picked.length < count; i++) {
    const index = (start + i) % pool.length;
    if (used.has(index)) continue;
    used.add(index);
    picked.push(pool[index]);
  }
  return picked;
}

export function resolveQuestionPool(
  slug: string,
  spiralTopic?: string,
  unit?: string,
  level?: string,
): GrammarQuizQuestion[] {
  if (SLUG_OVERRIDES[slug]) return SLUG_OVERRIDES[slug];
  if (spiralTopic && TOPIC_POOLS[spiralTopic]) return TOPIC_POOLS[spiralTopic];
  if (unit && UNIT_POOLS[unit]) return UNIT_POOLS[unit];
  if (level && LEVEL_POOLS[level]) return LEVEL_POOLS[level];
  return TOPIC_POOLS["sentence-structure"];
}

export function getRichQuestionsForChapter(
  slug: string,
  spiralTopic?: string,
  unit?: string,
  level?: string,
  count = 4,
): GrammarQuizQuestion[] {
  const pool = resolveQuestionPool(slug, spiralTopic, unit, level);
  return pickFromPool(pool, slug, count);
}
`;

fs.writeFileSync("src/lib/german-grammar-quiz-bank.ts", out);
console.log(
  "Quiz bank:",
  Object.keys(TOPIC_POOLS).length,
  "topics,",
  Object.keys(SLUG_OVERRIDES).length,
  "kapitel overrides",
);