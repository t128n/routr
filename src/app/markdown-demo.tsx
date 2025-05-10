import { useState } from 'react';
import { Markdown } from '@/components/ui/markdown';

/**
 * Demo-Seite für die Markdown-Formatierung
 */
export function MarkdownDemo() {
  const [markdownText, setMarkdownText] = useState<string>(`# Markdown Beispiel

Dies ist ein **Beispieltext** mit *Markdown-Formatierung*.

## Überschriften

### Dritte Ebene

## Listen

- Element 1
- Element 2
  - Unterelement 2.1
  - Unterelement 2.2
- Element 3

## Nummerierte Listen

1. Erster Punkt
2. Zweiter Punkt
3. Dritter Punkt

## Links und Bilder

[Ein Link](https://example.com)

![Beispielbild](https://via.placeholder.com/150)

## Code

Inline \`code\` Beispiel.

\`\`\`javascript
// Ein Code-Block
function helloWorld() {
  console.log("Hallo Welt!");
}
\`\`\`

## Tabellen

| Spalte 1 | Spalte 2 | Spalte 3 |
|----------|----------|----------|
| Zelle 1  | Zelle 2  | Zelle 3  |
| Zelle 4  | Zelle 5  | Zelle 6  |

## Zitate

> Dies ist ein Zitat.
> Es kann mehrere Zeilen umfassen.

## Horizontale Linien

---

## Checkbox-Listen

- [x] Erledigte Aufgabe
- [ ] Offene Aufgabe
- [ ] Weitere offene Aufgabe
`);

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <h2 className="text-lg font-semibold mb-2">Markdown-Eingabe</h2>
          <textarea
            value={markdownText}
            onChange={(e) => setMarkdownText(e.target.value)}
            className="w-full h-96 p-2 border rounded-md font-mono text-sm"
          />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold mb-2">Vorschau</h2>
          <div className="border rounded-md p-4 h-96 overflow-auto">
            <Markdown content={markdownText} />
          </div>
        </div>
      </div>
    </div>
  );
} 