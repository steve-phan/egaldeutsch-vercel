---
title: "Deutsch für Software Engineers — B1"
description: "Architekturgespräche, Spezifikationen und Stakeholder-Updates auf B1-Niveau."
part: "B1 Independent Grammar"
level: B1
unit: software
chapterNumber: 83
order: 83
date: "2026-07-15"
---

## Ziel dieses Kapitels

In Tech-Teams brauchst du **präzise deutsche Sätze** für **Specs**, **Reviews** und **Updates**.

Am Ende kannst du:

- **Architektur** und **Trade-offs** beschreiben
- **Spezifikationen** mit Passiv und Modalverben schreiben
- **Stakeholder-Updates** verständlich formulieren
- **Incident-Kommunikation** auf B1-Niveau

---

# 1. Standup und Status

> **Gestern** **habe** ich an **der API** **gearbeitet**.
> **Heute** **werde** ich die **Tests erweitern**.
> **Blocker:** Ich **warte auf** die **Freigabe**, **bevor** ich **deployen kann**.

---

# 2. Technische Beschreibungen — Passiv

> Der **Endpoint wird** von **mehreren Clients aufgerufen**.
> Die **Daten werden** in **Echtzeit synchronisiert**.
> Der **Bug wurde** gestern **behoben**.

---

# 3. Relativsätze in der Doku

> Das **Modul**, **das** für **Auth zuständig ist**, **wurde** aktualisiert.
> Die **Latenz**, **die** wir **gemessen haben**, **liegt** bei 200 ms.

---

# 4. Architektur diskutieren

> **Einerseits** ist **Microservices** **flexibel**, **andererseits** **komplexer**.
> **Meiner Meinung nach** sollten wir **zuerst** **skalieren**, **bevor** wir **optimieren**.
> **Wenn** die **Last steigen würde**, **würden** wir **sharden**.

**Konjunktiv II** für Hypothesen

---

# 5. Spezifikationen — typische Muster

> Das System **muss** **innerhalb von 5 Sekunden** antworten.
> Fehler **sollen** **geloggt werden**.
> **Nachdem** ein **Event empfangen wurde**, **wird** die **Queue verarbeitet**.

---

# 6. Stakeholder-Updates

> **Kurzfassung:** Das Feature **ist** zu **80 % fertig**.
> **Risiko:** **Obwohl** die **Tests grün sind**, **gibt** es **offene Edge Cases**.
> **Nächster Schritt:** **Sobald** die **QA freigibt**, **rollen** wir **aus**.

---

# 7. Incident-Kommunikation

> **Um** **18:42** **wurde** ein **Ausfall festgestellt**.
> **Ursache:** Ein **Config-Fehler**, **der** beim **Deploy entstanden ist**.
> **Status:** Der **Dienst ist wiederhergestellt**.
> **Als Nächstes** **werden** wir ein **Postmortem schreiben**.

---

# 8. Häufige Fehler

Falsch: *Der Server ist down geworden.*
Richtig: Der Server **ist ausgefallen**. / Der Server **war nicht erreichbar**.

Falsch: *Ich mache deploy morgen.*
Richtig: Ich **werde** morgen **deployen**. / Wir **führen** morgen ein **Deployment durch**.

---

# 9. Fehler für vietnamesischsprachige Lernende

- **deployen** ist im Deutschen verbürgert — **deployen** (nicht *machen deploy*)
- **Passiv** für neutrale Tech-Texte bevorzugt
- lange **Nebensätze** mit Kommas — nicht alles in Hauptsätze pressen

---

# 10. Glossar — B1 Tech-Deutsch

| Englisch | Deutsch (B1) |
| --- | --- |
| deploy | **deployen** / **ausrollen** |
| bug fix | **Bugfix** / **Fehler beheben** |
| outage | **Ausfall** |
| rollback | **Zurückrollen** / **Rollback** |
| latency | **Latenz** / **Verzögerung** |

---

# 12. Übungen

## Aufgabe 1 — Passiv

> Wir haben den Bug gestern behoben.

Lösung:

> Der Bug **wurde** gestern **behoben**.

## Aufgabe 2 — Relativsatz

> Das ist das Modul. Es verwaltet die Sessions.

Lösung:

> Das ist das Modul, **das** die Sessions **verwaltet**.

## Aufgabe 3 — obwohl

> Die Tests sind grün. Es gibt noch Risiken.

Lösung:

> **Obwohl** die Tests **grün sind**, **gibt** es noch **Risiken**.

## Aufgabe 4 — nachdem

> Wir haben deployed. Die Nutzer melden Fehler.

Lösung:

> **Nachdem** wir **deployed hatten**, **meldeten** Nutzer **Fehler**.

## Aufgabe 5 — Stakeholder-Update

> Schreibe 3 Sätze Status-Update mit **sodass/deshalb/sobald**.

## Aufgabe 6 — Schreibaufgabe

Schreibe ein kurzes Incident-Update (6 Sätze) mit Passiv und Relativsätzen.

## Aufgabe 7 — Kapitel-Review

- [ ] Ich beschreibe **Technik** mit Passiv.
- [ ] Ich diskutiere **Trade-offs** mit Konnektoren.
- [ ] Ich schreibe **verständliche Updates**.

**Nächstes Kapitel:** Häufige B1-Fehler.
