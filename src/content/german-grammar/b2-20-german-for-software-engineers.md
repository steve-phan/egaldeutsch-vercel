---
title: "Deutsch für Software Engineers — B2"
description: "RFCs, Postmortems und teamübergreifende Dokumentation auf B2-Niveau."
part: "B2 Upper-Intermediate Grammar"
level: B2
unit: software
chapterNumber: 113
order: 113
date: "2026-07-15"
---

## Ziel dieses Kapitels

**Technische Dokumentation** auf Deutsch braucht **Präzision**, **Passiv** und **klare Struktur**.

Am Ende kannst du:

- **RFCs** und **Design Docs** verfassen
- **Postmortems** schreiben
- **Incidents** **sachlich** dokumentieren
- **teamübergreifend** kommunizieren

---

# 1. RFC / Design Document — Struktur

1. **Zusammenfassung** (Summary)
2. **Motivation** — warum?
3. **Vorschlag** — was?
4. **Alternativen** — was sonst?
5. **Risiken** und **Offene Fragen**

> **Dieses** Dokument **beschreibt** den **Vorschlag** für …
> **Ziel** **ist** es**,** die **Latenz** **zu** **reduzieren**.

---

# 2. Postmortem — typische Abschnitte

| Abschnitt | Inhalt |
| --- | --- |
| **Incident** | Was ist passiert? |
| **Timeline** | Wann? |
| **Root Cause** | Warum? |
| **Impact** | Auswirkungen |
| **Action Items** | Maßnahmen |

> **Am** 12.07. **kam** es **zu** einem **Ausfall** des **Payment**-Services.
> **Ursache** **war** eine **fehlerhafte** Konfiguration.

---

# 3. Passiv in technischen Texten

> **Der** Fehler **wurde** **um** 14:30 **behoben**.
> **Die** API **wird** **deprecatet**.
> **Es** **wurde** **festgestellt**, dass …

**Agens** oft **weg** — Fokus auf **System**

---

# 4. Präzise Zeitangaben

> **um** 14:30 **Uhr**
> **innerhalb** von **5** Minuten
> **seit** dem **letzten** Deploy
> **bis** zur **Wiederherstellung**

---

# 5. Konditional und Hypothesen

> **Wenn** der Cache **ausfällt**, **greift** das **Fallback**-System.
> **Hätte** die **Überwachung** **früher** **alarmiert**, **wäre** der **Ausfall** **kürzer** **gewesen**.

---

# 6. Teamübergreifende Kommunikation

> **Für** das **Backend**-Team: **Bitte** **API**-Version **2** **bis** Freitag **bereitstellen**.
> **Abhängigkeit:** Das **Frontend** **wartet** auf …
> **Blocker:** …

**Imperativ** vermeiden → **Bitte** + **Konjunktiv** / **Passiv**

---

# 7. Nominalisierung in Specs

> **Die** **Implementierung** der **Schnittstelle**
> **Die** **Migration** der **Datenbank**
> **Die** **Abschaltung** des **Legacy**-Systems

---

# 8. Häufige Formulierungen

> **Der** Build **ist** **fehlgeschlagen**.
> **Das** Deployment **wurde** **zurückgerollt**.
> **Die** **Latenz** **hat** **zugenommen**.
> **Es** **besteht** **kein** **Datenverlust**.

---

# 9. Fehler für Lernende

- **Anglizismen** groß/klein: **das** Deployment, **der** Pull Request
- **zu** umgangssprachlich in Postmortems
- **Ich**-Form in **offiziellen** Docs vermeiden

---

# Übungen

## Aufgabe 1 — Postmortem-Einleitung

Incident: API down, 2 Stunden.

Lösung:

> **Am** [Datum] **kam** es **zu** einem **zweistündigen** Ausfall **der** API.

## Aufgabe 2 — Passiv

The team fixed the bug at 15:00.

Lösung:

> **Der** Bug **wurde** **um** 15:00 **Uhr** **behoben**.

## Aufgabe 3 — Action Item

We need to add monitoring.

Lösung:

> **Es** **wird** **empfohlen**, **das** Monitoring **zu** **erweitern**. / **Action** Item: Monitoring **hinzufügen**.

## Aufgabe 4 — Root Cause

A misconfigured load balancer caused the outage.

Lösung:

> **Ursache** **war** ein **falsch** **konfigurierter** Load Balancer.

## Aufgabe 5 — Schreibaufgabe

Schreibe drei Sätze für ein RFC (Motivation + Vorschlag).

## Aufgabe 6 — Kapitel-Review

- [ ] Ich strukturiere **RFCs** und **Postmortems**
- [ ] Ich nutze **sachliches** Passiv
- [ ] Ich dokumentiere **Incidents** präzise

**Nächstes Kapitel:** Häufige B2-Fehler.