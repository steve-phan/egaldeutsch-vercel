---
title: "Deutsch für Software Engineers — C1"
description: "Compliance-Dokumente, Audits, Architecture Decision Records und formelle Tech-Kommunikation."
part: "C1 Advanced Grammar"
level: C1
unit: software
chapterNumber: 18
order: 142
date: "2026-07-15"
---

## Ziel dieses Kapitels

C1 für Engineers: **ADRs, Compliance, Audits, Postmortems** — grammatisch präzise und formell.

Am Ende kannst du:

- **Architecture Decision Records** auf Deutsch strukturieren
- **Compliance- und Audit-Texte** verfassen
- **Incident Reports** mit Passiv und Modalverben schreiben
- **Stakeholder-Updates** auf C1-Niveau formulieren

---

# 1. ADR-Struktur (Architecture Decision Record)

| Abschnitt | Beispiel-Formulierung |
| --- | --- |
| Kontext | **Ausgehend von** den Anforderungen … |
| Entscheidung | **Es wurde** **entschieden**, … **einzusetzen**. |
| Konsequenzen | **Dies** **hat** zur **Folge**, dass … |
| Alternativen | **Erwogen wurden** u. a. … |

> **Status:** angenommen / **verworfen** / **ersetzt durch** ADR-042

---

# 2. Compliance-Sprache

| Begriff | Satz |
| --- | --- |
| DSGVO | **Die Verarbeitung** **erfolgt** **aufgrund** von Art. 6 Abs. 1. |
| Audit | **Es wurde** **festgestellt**, dass … **nicht konform** ist. |
| Risiko | **Es besteht** das **Risiko**, dass … |
| Maßnahme | **Es ist** **sicherzustellen**, dass … |

---

# 3. Incident / Postmortem

> **Am** … **kam** es zu einem **Ausfall** des **Services**.
> Die **Ursache** **dürfte** in einem **fehlerhaften Deployment** **liegen**.
> **Es hätte** **früher** **eskaliert werden sollen**.

**Zeitformen:** Präteritum/Perfekt für Ablauf, Modal für Bewertung

---

# 4. Stakeholder-Update

> **Kurzupdate:** Die Migration **wird** **wie geplant** **fortgesetzt**.
> **Risiken:** Verzögerung **dürfte** **minimal** **sein**.
> **Nächster Schritt:** Rollout **bis** KW 28.

---

# 5. Typische Tech-Passiv-Konstruktionen

> Der **Build** **wird** **ausgeführt**.
> Die **API** **wurde** **deprecated**.
> **Es wird** **empfohlen**, auf v2 **zu migrieren**.

---

# 6. Übungen

## Aufgabe 1 — ADR-Entscheidung

> We decided to use PostgreSQL.

Lösung:

> **Es wurde** **entschieden**, **PostgreSQL** **einzusetzen**.

## Aufgabe 2 — Incident

> A bug caused downtime. We should have tested more.

Lösung:

> **Ein Bug** **führte** zu **Ausfallzeiten**. **Häufiger** **hätten** **Tests** **durchgeführt werden sollen**.

## Aufgabe 3 — Compliance

> We must ensure data is encrypted.

Lösung:

> **Es ist** **sicherzustellen**, dass die Daten **verschlüsselt sind**.

## Aufgabe 4 — Vermutung

> The outage might be related to the cache.

Lösung:

> Der Ausfall **dürfte** mit dem Cache **zusammenhängen**.

## Aufgabe 5 — Schreibaufgabe

Schreibe ein kurzes Postmortem (5 Sätze) mit Ursache, Maßnahme und Modalverb.

## Aufgabe 6 — Kapitel-Review

- [ ] ADR: **Kontext → Entscheidung → Folgen**
- [ ] Compliance: **sicherstellen / konform**
- [ ] Postmortem: **dürfte / hätte sollen**