---
title: "Warum bessere Modelle für AI Coding nicht reichen"
description: "Warum klare Modulgrenzen, ausführbare Regeln und CI für zuverlässiges AI Coding genauso wichtig werden wie leistungsfähige Modelle."
date: "2026-08-26"
tags:
  - AI Coding
  - AI Agents
  - Softwarearchitektur
  - Modularität
  - Testing
  - CI/CD
published: true
translationKey: "ai-coding-needs-software-architecture"
featuredImage: "/blog/warum-bessere-modelle-fuer-ai-coding-nicht-reichen/cover.jpg"
featuredImageAlt: "Porträt des Autors in warmem Filmlook, überlagert von einem schwarzen Pinselstrich und dem Wort Grenzen."
---

AI Agents können heute in kurzer Zeit erstaunlich viel Code verändern. Genau deshalb werde ich bei Softwarearchitektur strenger, nicht lockerer.

Ein leistungsfähiger Agent in einem chaotischen Repository kann schließlich auch nur schneller an mehr Stellen falsch liegen. Der entscheidende Flaschenhals ist nicht mehr allein die Frage, ob ein Modell gültigen Code erzeugen kann. Es muss in einem realen System drei andere Fragen zuverlässig beantworten:

- Wo gehört die Änderung hin?
- Was darf sie nicht berühren?
- Woran erkennt das System, dass die Arbeit fertig ist?

Meine These ist deshalb: Architektur wird zu einem Teil des Kontrollsystems für AI Agents. Das ist kein neuer wissenschaftlicher Architekturbegriff, sondern meine praktische Ableitung aus bekannten Prinzipien. Gute Grenzen verkleinern den Arbeitsraum. Ausführbare Regeln blockieren verbotene Wege. Tests und Akzeptanzkriterien liefern überprüfbare Hinweise darauf, ob die gewünschte Änderung funktioniert.

## Eine echte Änderung ist mehr als Codegenerierung

Eine isolierte Funktion zu erzeugen und ein Issue in einem bestehenden Repository zu lösen, sind zwei sehr unterschiedliche Aufgaben.

Bei einer echten Änderung muss ein Agent zunächst die relevante Stelle finden. Danach muss er Zusammenhänge über mehrere Funktionen, Klassen und Dateien hinweg verstehen, die Entwicklungsumgebung bedienen und das Ergebnis ausführen. Genau diese Unterschiede beschreibt auch das [SWE-bench-Paper](https://arxiv.org/abs/2310.06770): Die Aufgaben stammen aus realen GitHub-Issues und verlangen häufig koordinierte Änderungen in bestehenden Codebasen statt nur einer passenden Codezeile.

Dabei zählt nicht nur das Modell. Das [SWE-agent-Paper](https://papers.neurips.cc/paper_files/paper/2024/file/5a7c947568c1b1328ccc5230172e1e7c-Paper-Conference.pdf) zeigt, dass auch die Schnittstelle zwischen Agent und Computer einen Unterschied macht: Wie ein Agent Dateien durchsucht, editiert, Programme ausführt und Rückmeldung über Fehler erhält, beeinflusst sein Verhalten.

Das leuchtet ein. Wer schon einmal in einem unbekannten Repository gearbeitet hat, kennt das Problem. Die Schwierigkeit besteht selten darin, überhaupt eine `if`-Bedingung schreiben zu können. Schwierig ist zu entscheiden, welche Bedingung an welcher Stelle hingehört und welche Nebenwirkungen sie auslöst.

Nehmen wir eine scheinbar kleine User Story:

> Ein Kunde soll eine Zahlung für nächsten Freitag planen können.

In einem unklar strukturierten System findet der Agent vielleicht einen Controller, einen allgemeinen Validator, mehrere Shared Helper, direkten Datenbankzugriff und einen ähnlichen Ablauf in einem anderen Feature. Jeder dieser Orte wirkt plausibel. Keiner macht eindeutig, wo die fachliche Verantwortung liegt.

Das Problem ist dann nicht fehlende Codegenerierung. Das Repository bietet zu viele plausible Wege an, darunter mehrere falsche.

## Gib dem Agenten eine kleine Welt

Für die geplante Zahlung sollte der Agent hauptsächlich den Bereich `Payments` verstehen müssen, nicht das gesamte Unternehmen.

Ein klar abgegrenztes Modul kann dafür eine kleine Arbeitswelt bilden: Es besitzt eine schmale öffentliche Schnittstelle, hält seine fachlichen Regeln und Datenzugriffe intern und macht nur die Verträge sichtbar, die andere Teile des Systems tatsächlich brauchen. `Accounts` und `Compliance` bleiben zunächst außerhalb dieses Arbeitsraums. Relevant werden nur ihre öffentlichen Schnittstellen.

Die Grundlage dafür ist nicht AI-spezifisch. David Parnas beschrieb bereits 1972 [Information Hiding als Kriterium für die Zerlegung von Systemen](https://doi.org/10.1145/361598.361623): Module sollten Entscheidungen verbergen, die sich ändern können, statt den Aufbau allein an Verarbeitungsschritten auszurichten. Meine Übertragung auf Agents lautet: Wenn ein Modul seine Interna wirklich verbirgt, muss ein Agent für eine lokale Änderung weniger irrelevantes Systemwissen gleichzeitig berücksichtigen.

Auch aktuelle Agenten-Workflows behandeln das Auffinden der relevanten Stellen als eigene Phase. [Agentless](https://arxiv.org/abs/2407.01489) trennt beispielsweise Lokalisierung, Reparatur und Validierung. Das beweist nicht, dass eine bestimmte Architektur automatisch zu besseren Agentenergebnissen führt. Es zeigt aber, dass die Auswahl des richtigen Kontexts ein eigenständiger Teil der Aufgabe ist.

Deshalb finde ich einen modularen Monolithen für viele dieser Workflows interessant: Änderungen können lokal bleiben, Grenzen sind sichtbar und man handelt sich nicht automatisch zusätzliche Netzwerk- und Deployment-Komplexität ein. Das ist keine allgemeine Absage an Microservices. Systemgröße, Teamstruktur, Skalierung und Betriebsanforderungen können zu einer anderen Entscheidung führen.

Der wichtige Punkt ist kleiner: Gib einem Agenten nicht das ganze System als Arbeitswelt, wenn die Story nur ein Modul betrifft.

## Tiefe Module statt verstreuter Änderungen

Ein Architekturdiagramm kann sauber aussehen und eine einzelne Änderung trotzdem über das gesamte Repository verteilen.

Ich sehe häufig Strukturen, die ausschließlich nach technischer Rolle geordnet sind:

```text
controllers/
services/
repositories/
dtos/
validators/
mappers/
```

Für die Scheduled-Payment-Story muss der Agent dann in fast jedem dieser Verzeichnisse nach einer passenden Datei suchen. Die fachlich zusammengehörige Änderung ist horizontal verteilt.

Ein lokaler Zuschnitt dreht die Blickrichtung um:

```text
payments/
  public-api/
  scheduled-payments/
    domain/
    application/
    infrastructure/
```

Die Schichten verschwinden dadurch nicht. Sie liegen innerhalb des Bereichs, in dem ihre Änderung Bedeutung hat. Das Modul darf intern durchaus tief sein: Hinter einer kleinen öffentlichen API kann viel Verhalten stecken. Von außen bleibt die Zahl der zulässigen Einstiege überschaubar.

Das Ziel ist nicht, um jeden Preis weniger Dateien zu haben. Das Ziel ist Lokalität: Eine konkrete Änderung soll möglichst wenig irrelevantes Wissen über den Rest des Systems benötigen.

Auch das ist eine Designableitung, keine Naturregel. Manche Änderungen sind zwangsläufig bereichsübergreifend. Ein neues Datenschutzkonzept oder eine Migration kann mehrere Module betreffen. Gute Grenzen machen diese Kopplung aber sichtbar. Sie verhindern, dass jede kleine Feature-Änderung unbemerkt zu einer Repository-Rundreise wird.

## Hinweise sind noch keine Grenzen

Repository-Instruktionen sind hilfreich. In einer `AGENTS.md` kann ich erklären, welche Befehle auszuführen sind, wie ein Modul aufgebaut ist oder welche Konventionen gelten. Codex kann solche Dateien laut der [offiziellen Dokumentation](https://learn.chatgpt.com/docs/agent-configuration/agents-md) hierarchisch lesen und lokale Hinweise mit allgemeineren Projektregeln kombinieren.

Aber eine Anweisung bleibt zunächst eine Anweisung. Wenn dort steht, dass `Payments` keine internen Klassen aus `Compliance` importieren darf, kann ein Agent diesen Import technisch trotzdem erzeugen.

Eine Grenze entsteht erst, wenn das System den Verstoß ablehnt. Dafür gibt es je nach Stack verschiedene Möglichkeiten:

- Ein Architekturtest kann verbotene Abhängigkeiten erkennen. [ArchUnit](https://www.archunit.org/userguide/html/000_Index.html) bietet dafür beispielsweise Regeln über Klassen und Schichten in Java.
- Build-Visibility kann festlegen, welche Pakete voneinander abhängen dürfen. Bei [Bazel](https://bazel.build/concepts/visibility) führt ein nicht erlaubter Zugriff bereits während der Analysephase zu einem Build-Fehler.
- CI kann die Checks bei jeder Änderung ausführen. Wenn ein Branch entsprechend geschützt ist, können [Required Status Checks in GitHub](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches) einen Merge blockieren, solange ein erforderlicher Check nicht erfolgreich ist.

Dann wird aus „Bitte nicht importieren“ ein reproduzierbares Ergebnis: erlaubte öffentliche API grün, interner Zugriff rot.

Das macht die Regel nicht automatisch richtig. Architekturtests sehen nur die Beziehungen, die wir formalisiert haben. Sie erkennen keine falsche Businesslogik und keine vergessene Anforderung. Zu grobe Regeln erzeugen außerdem gern Ausnahmen und Umgehungen. Trotzdem ist eine unvollständige, überprüfbare Grenze oft wertvoller als eine perfekte Regel, die nur in einem Dokument steht.

Kurz gesagt: `AGENTS.md` kann Verhalten lenken. Build, Tests und CI können ausgewählte Regeln erzwingen.

## „Fertig“ muss von außen überprüfbar sein

Wenn die Grenze klar ist, fehlt noch eine Definition von „fertig“. Die sollte nicht erst nach der Implementierung aus einem Bauchgefühl entstehen.

Für die geplante Zahlung könnte ein Akzeptanzszenario so aussehen:

```gherkin
Feature: Geplante Zahlungen
  Scenario: Eine Zahlung für nächsten Freitag planen
    Given ein gedecktes Konto
    And ein gültiger Zahlungsempfänger
    When der Kunde die Zahlung für nächsten Freitag plant
    Then wird die Zahlung vor Freitag nicht ausgeführt
    And derselbe Idempotency-Key erzeugt keine zweite Zahlung
```

Die [Gherkin-Referenz von Cucumber](https://cucumber.io/docs/gherkin/reference/) ordnet solchen Beispielen einen bekannten Ablauf zu: Ausgangslage mit `Given`, Ereignis mit `When`, beobachtbares Ergebnis mit `Then`. Entscheidend ist nicht die Syntax. Entscheidend ist, dass die Erwartung vor der Implementierung konkret und später ausführbar wird.

Für dieselbe Story könnten zusätzlich gelten:

- `Payments` importiert keine internen Compliance-Klassen.
- Unit Tests decken die fachliche Terminberechnung ab.
- Ein Integrationstest prüft Persistenz und Ausführung.
- Type Check, Lint und Build laufen erfolgreich.
- Das Akzeptanzszenario bestätigt das von außen sichtbare Verhalten.

Der Agent soll also nicht nur behaupten, dass er fertig ist. Er soll die vorher definierten Bedingungen nachweisbar erfüllen.

Dabei ist eine Grenze wichtig: Grüne Tests beweisen nicht, dass die Änderung vollständig korrekt ist. Sie liefern Evidenz dafür, dass die codierten Beispiele und Regeln im getesteten Umfeld erfüllt sind. Ein vergessenes Akzeptanzkriterium bleibt auch für eine grüne Pipeline unsichtbar.

## Ein kontrollierter Workflow statt Prompt und Hoffnung

Aus diesen Bausteinen ergibt sich für mich ein anderer Arbeitsablauf:

1. Die Story und ihre fachlichen Risiken verstehen.
2. Beobachtbare Akzeptanzkriterien formulieren.
3. Die relevanten Module und öffentlichen Verträge lokalisieren.
4. Die Änderung mit einem begrenzten Änderungsumfang planen.
5. Implementieren, ohne die vereinbarten Grenzen zu öffnen.
6. Tests, Architekturregeln, Lint, Type Check und Build ausführen.
7. Rote Checks auf ihre Ursache zurückführen, beheben und erneut prüfen.
8. Die Änderung im Pull Request menschlich prüfen und erst danach mergen.

Schlägt ein Check fehl, führt sein Feedback den Agenten zurück zur konkreten Ursache. Nach der Korrektur laufen die relevanten Prüfungen erneut. Selbst wenn alle grün sind, bleiben in der menschlichen Prüfung Fragen nach Lesbarkeit, unnötigem Änderungsumfang, fehlenden Kriterien und unbeabsichtigten Nebenwirkungen.

Auch spezialisierte Rollen wie Planner, Implementer oder Reviewer können einzelne Schritte unterstützen. Klarer wird die Codebasis dadurch nicht: Mehr Agenten ersetzen weder die Grenzen im Repository noch die unabhängige Verifikation.

Gute Agentenarbeit ist deshalb für mich kein möglichst langer Prompt. Sie ist ein kontrollierter Entwicklungsprozess mit kurzen Feedbackschleifen.

## Wo ich in einem bestehenden Repository anfangen würde

Ich würde nicht mit einer großen „AI-ready“-Migration starten. Ich würde eine echte, überschaubare User Story nehmen und ihren Weg durch das System verfolgen.

Dabei helfen mir sechs Fragen:

1. Welches Modul sollte für die Änderung verantwortlich sein?
2. Welche anderen Bereiche muss die Story wirklich kennen?
3. Welche Interna sind heute versehentlich erreichbar?
4. Welche falsche Abhängigkeit ist nur dokumentiert, aber nicht technisch blockiert?
5. Welches Ergebnis kann ich als Akzeptanzszenario von außen beobachten?
6. Welche Checks müssen erfolgreich sein, bevor ein Merge erlaubt ist?

Schon eine einzige ausführbare Grenze kann den nächsten Agentenlauf verbessern. Nicht weil der Agent dadurch intelligenter wird, sondern weil das Repository weniger falsche Möglichkeiten offenlässt.

## Weniger Raum, unbemerkt falsch zu liegen

Wir haben Softwarearchitektur lange dafür gebaut, dass Menschen große Systeme verstehen und sicher verändern können. Jetzt kommt eine zweite Zielgruppe hinzu: Maschinen, die darin zunehmend selbstständig handeln.

Die bekannten Prinzipien verschwinden dadurch nicht. Information Hiding, klare Verträge, Lokalität, automatisierte Tests und CI werden eher sichtbarer in ihrer Kontrollfunktion.

AI-ready Code ist für mich deshalb nicht Code, den eine AI besonders leicht generieren kann. Es ist Code, der einer AI wenig Raum gibt, unbemerkt falsch zu liegen.
