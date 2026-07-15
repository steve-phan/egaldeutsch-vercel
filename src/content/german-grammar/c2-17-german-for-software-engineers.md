---
title: "Deutsch für Software Engineers — C2"
description: "Rechtlich-technische Texte und präzise Spezifikationsgrammatik für C2-Niveau in der Softwareentwicklung."
part: "C2 Mastery Grammar"
level: C2
unit: software
chapterNumber: 172
order: 172
date: "2026-07-15"
---

## Ziel dieses Kapitels

C2 für Engineers = **präzise, überprüfbare Sprache** in **Specs, Verträgen, Audits und Architekturdokumenten**.

Am Ende kannst du:

- **Anforderungen** grammatisch **eindeutig** formulieren
- **Bedingungen** und **Ausnahmen** mit **wenn/falls/sofern** trennen
- **rechtliche** und **technische** Register kombinieren
- **RFC-Stil** auf Deutsch schreiben

---

# 1. Anforderungen — Modalverben

| Modal | Bedeutung in Specs |
| --- | --- |
| **muss** | Pflicht (MUST) |
| **soll** | Empfehlung (SHOULD) |
| **kann** | Option (MAY) |
| **darf nicht** | Verbot (MUST NOT) |

> **Das** **System** **muss** **TLS** **1.3** **unterstützen**.
> **Legacy-Clients** **können** **TLS** **1.2** **nutzen**.

---

# 2. Bedingungen — wenn, falls, sofern

> **Wenn** **der** **Cache** **leer** **ist**, **muss** **die** **API** **aus** **der** **Datenbank** **lesen**.
> **Falls** **keine** **Antwort** **innerhalb** **von** **5** **s** **erfolgt**, **wird** **ein** **Timeout** **ausgelöst**.
> **Sofern** **nicht** **anders** **angegeben**, **gilt** **UTF-8**.

**sofern** = **unter der Bedingung** (formeller).

---

# 3. Definitionen — ist/sind

> **Ein** **„Incident"** **ist** **ein** **Ereignis**, **das** **die** **Verfügbarkeit** **beeinträchtigt**.
> **„Deployment"** **bezeichnet** **das** **Ausrollen** **einer** **Version** **in** **Produktion**.

**Definitorisch** — **Präsens**, **der/das** generisch.

---

# 4. Passiv in technischen Docs

> **Die** **Daten** **werden** **verschlüsselt** **übertragen**.
> **Fehler** **sind** **zu** **protokollieren**.

**Prozess** ohne **nennenswerten** Akteur.

---

# 5. Rechtlich-technisch

> **Der** **Auftragnehmer** **verpflichtet** **sich**, …
> **Die** **Haftung** **ist** **auf** **den** **Vertragswert** **begrenzt**.
> **Personenbezogene** **Daten** **dürfen** **nur** **zweckgebunden** **verarbeitet** **werden**.

**Vertragssprache** — **präzise**, **keine** Modalpartikeln.

---

# 6. Architektur — Klarheit

> **Der** **Service** **A** **ruft** **den** **Service** **B** **synchron** **auf**.
> **Bei** **Fehler** **in** **B** **fällt** **A** **auf** **den** **Cache** **zurück**.

**Aktiv** für **Abläufe** — **wer** ruft **wen** auf.

---

# 7. Häufige C2-Fehler

Falsch: *wenn* und *falls* **beliebig** mischen ohne Nuance
Falsch: **muss** vs. **soll** **unklar** (Compliance-Risiko)
Falsch: **Mehrdeutige** Pronomen in **Specs**

---

# 8. Vergleich mit Englisch

RFC 2119: *MUST, SHOULD, MAY* — Deutsch: **muss, soll, kann** — **etabliert** in DE-Docs.

---

# 9. Fehler für vietnamesischsprachige Lernende

- **muss** = **Pflicht**, nicht „muss vielleicht"
- **sofern** in **Verträgen** häufig
- **Definitorische** Sätze: **ist** + **Relativsatz**

---

# 10. Audit und Compliance

> **Es** **ist** **nachzuweisen**, **dass** …
> **Die** **Dokumentation** **hat** **den** **Stand** **vom** … **widerzuspiegeln**.

**Passiv** + **Pflicht** = **Audit-Sprache**.

---

# 11. Incident Reports

> **Um** **14:32** **Uhr** **MEZ** **wurde** **ein** **Anstieg** **der** **Fehlerrate** **festgestellt**.
> **Ursache:** **Fehlkonfiguration** **des** **Load** **Balancers**.
> **Maßnahme:** **Rollback** **auf** **Version** **x.y.z**.

**Zeit** — **Passiv** — **Ursache** — **Maßnahme**.

---

# 12. Übungen

## Aufgabe 1 — MUST

> The system shall support OAuth2. → Deutsch.

Lösung:

> **Das** **System** **muss** **OAuth2** **unterstützen**.

## Aufgabe 2 — Bedingung

> If the cache is empty, read from DB.

Lösung:

> **Wenn** **der** **Cache** **leer** **ist**, **ist** **aus** **der** **Datenbank** **zu** **lesen**.

## Aufgabe 3 — Definition

> Definiere „Latenz" in einem Satz.

Lösung:

> **„Latenz"** **ist** **die** **Zeit** **zwischen** **Anfrage** **und** **Antwort**.

## Aufgabe 4 — sofern

> Unless otherwise specified, UTF-8 applies.

Lösung:

> **Sofern** **nicht** **anders** **angegeben**, **gilt** **UTF-8**.

## Aufgabe 5 — Schreibaufgabe

Schreibe fünf Anforderungen (MUST/SHOULD/MAY) für eine API — auf Deutsch, RFC-Stil.

## Aufgabe 6 — Kapitel-Review

- [ ] **muss/soll/kann** = **RFC-Niveau**
- [ ] **wenn/falls/sofern** — Bedingungen
- [ ] Specs: **eindeutige** Referenz

**Nächstes Kapitel:** Häufige C2-Fehler.