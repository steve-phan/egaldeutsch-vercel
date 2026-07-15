---
title: "Meister-Lektorat und Mehrdeutigkeit"
description: "Mehrdeutigkeit erkennen, Referenzketten reparieren und C2-Prosa polieren."
part: "C2 Mastery Grammar"
level: C2
unit: mastery-editing
chapterNumber: 35
order: 35
date: "2026-07-15"
---

## Ziel dieses Kapitels

C2-Lektorat geht über Grammatik hinaus: **Klarheit, Präzision, Null-Mehrdeutigkeit** in kritischen Texten.

Am Ende kannst du:

- **Mehrdeutige Pronomen und Relativbezüge** finden
- **Referenzketten** über Absätze hinweg prüfen
- **Scope** von Negation und Modifikatoren klären
- Verträge, Specs und **öffentliche Texte** auf Doppeldeutigkeit prüfen

---

# 1. Typen von Mehrdeutigkeit

| Typ | Beispiel |
| --- | --- |
| Pronomen | *Sie* **hat** angerufen. (wer?) |
| Relativbezug | *der* Fehler in **der** Datei, **die** … (welche?) |
| Strukturell | *Ich** **sah** **den** **Mann** **mit** **dem** **Fernglas**.* |
| Lexikalisch | **Bank** (Sitz vs. Geldinstitut) |
| Scope | *Nicht* **nur** **heute* vs. *Heute* **nicht** |

---

# 2. Pronomen-Referenz

**Schwach:**

> **Der** Entwickler **sprach** mit **dem** Manager. **Er** **war** **unzufrieden**.

**Klar:**

> **Der** Entwickler **war** **unzufrieden** **nach** dem Gespräch **mit** **dem** Manager.
> Oder: **Der** Manager **war** **unzufrieden**.

**Regel:** **Er/sie/es** — innerhalb von **einem** Satz eindeutig.

---

# 3. Relativsätze — Bezug klären

**Mehrdeutig:**

> **Das** **System** **der** **Firma**, **die** **wächst**, …
> (wächst: System oder Firma?)

**Klar:**

> **Die** **wachsende** **Firma** **nutzt** ein **neues** **System**.
> Oder: **Das** **System** **der** **Firma**, **die** **am** **Markt** **wächst**, …

---

# 4. Strukturelle Mehrdeutigkeit

> **Ich** **sah** **den** **Mann** **mit** **dem** **Teleskop**.

Lesung A: Ich hatte das Teleskop.
Lesung B: Der Mann hatte das Teleskop.

**Fix:** **Mit** **meinem** **Teleskop** **sah** ich **den** **Mann**.

---

# 5. Negation — Scope

| Satz | Bedeutung |
| --- | --- |
| **Nicht** **nur** **heute** **muss** er **arbeiten**. | auch an anderen Tagen |
| **Heute** **muss** er **nicht** **arbeiten**. | heute frei |
| **Nur** **heute** **muss** er **arbeiten**. | nur heute, nicht sonst |

**C2:** Negation **positionieren** für exakte Bedeutung.

---

# 6. Modifikatoren — wer modifiziert wen?

> **Alte** **Männer** **und** **Frauen** (nur Männer alt?)
> Besser: **Alte** **Männer** **und** **alte** **Frauen**

> **Zum** **Essen** **eingeladen** (Essen oder Personen?)
> Klar: **Zum** **Abendessen** **eingeladen** / **zum** **Essen** **bei** **Freunden**

---

# 7. Rechtlich-technische Klarheit

In Specs und Verträgen:

| Schwach | Klar |
| --- | --- |
| **bald** | **innerhalb** **von** **48** **Stunden** |
| **wesentlich** | **um** **mindestens** **10** **%** |
| **der** **Dienst** | **der** **API-Dienst** **„Payments"** |
| **sie** | **die** **Auftragnehmerin** |

**Definierte Begriffe** am Textanfang — Grammatik + Lexikon.

---

# 8. Referenz über Absätze

Absatz 1: **Das** **neue** **Release** …
Absatz 2: **Es** **enthält** … ✓
Absatz 3: **Dies** **wurde** **getestet**. ✓

**Fehler:** Absatz 3: **Es** … (wenn mehrere **es**-Kandidaten zwischen P2 und P3)

**Fix:** Nomen wiederholen: **Das** **Release** **wurde** …

---

# 9. C2-Lektorat-Workflow

1. **Ein** Satz = **eine** Hauptaussage?
2. Jedes **er/sie/es/dies/das** — **eindeutiger** Bezug?
3. Jeder **Relativsatz** — **klares** Antezedens?
4. **Negation** — richtiger **Scope**?
5. **Kritischer** Kontext (Vertrag, Spec) → **keine** vagen Adjektive

---

# 10. Vorher/Nachher

**Vorher:**

> Nachdem **es** **deployed** **wurde**, **wurde** **es** **getestet**, **bevor** **es** **live** **ging**.

**Nachher:**

> **Nach** dem **Deployment** **wurde** **das** **Release** **getestet**. **Erst** **danach** **ging** es **live**.

---

# 11. Übungen

## Aufgabe 1 — Pronomen

> Der Kunde sprach mit dem Support. Er war verärgert.

Lösung:

> **Der** **Kunde** **war** **verärgert**. / **Der** **Support** **war** … (je nach Kontext klar machen)

## Aufgabe 2 — Negation

> Heute muss er nicht arbeiten. (nur heute frei)

Lösung:

> **Heute** **muss** er **nicht** **arbeiten**. (nicht: *Nicht heute muss er arbeiten*)

## Aufgabe 3 — Relativsatz

> Das System der Firma, die wächst, ist stabil.

Lösung:

> **Das** **System** **der** **wachsenden** **Firma** **ist** **stabil**.

## Aufgabe 4 — Spec

> Der Dienst wird bald aktualisiert.

Lösung:

> **Der** **API-Dienst** **„Auth"** **wird** **innerhalb** **von** **24** **Stunden** **aktualisiert**.

## Aufgabe 5 — Schreibaufgabe

Nimm einen eigenen Text und eliminiere **drei** Mehrdeutigkeiten. Dokumentiere die Fixes.

## Aufgabe 6 — Kapitel-Review

- [ ] **Pronomen-** und **Relativbezug**
- [ ] **Negations-Scope**
- [ ] **Vage** Wörter in kritischen Texten ersetzen

**Nächstes Kapitel:** Gesamtreview und persönliche Roadmap.