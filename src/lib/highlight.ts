import type { CodeLanguage } from "@/content/code-snippets";

const keywords: Record<CodeLanguage, string[]> = {
  python: [
    "def", "class", "import", "from", "return", "if", "elif", "else", "for",
    "while", "in", "not", "and", "or", "None", "True", "False", "as", "with",
    "try", "except", "raise", "pass", "break", "continue", "lambda", "yield",
    "is", "self", "list", "dict",
  ],
  typescript: [
    "import", "export", "from", "default", "const", "let", "var", "function",
    "return", "if", "else", "for", "while", "async", "await", "interface",
    "type", "class", "extends", "implements", "new", "this", "try", "catch",
    "finally", "throw", "typeof", "as", "void", "null", "undefined", "true",
    "false", "of",
  ],
  sql: [
    "SELECT", "FROM", "WHERE", "GROUP", "BY", "ORDER", "HAVING", "AND", "OR",
    "AS", "JOIN", "ON", "COUNT", "SUM", "AVG", "ROUND", "DATE_TRUNC", "DESC",
    "ASC",
  ],
  go: [
    "package", "import", "func", "type", "struct", "return", "if", "else",
    "for", "range", "var", "const", "defer", "go", "chan", "select",
    "switch", "case", "break", "continue", "nil", "true", "false",
  ],
  rust: [
    "pub", "fn", "struct", "impl", "for", "let", "mut", "match", "if",
    "else", "return", "use", "mod", "enum", "trait", "self", "Self", "true",
    "false", "loop", "while", "break",
  ],
};

const commentPrefix: Record<CodeLanguage, string> = {
  python: "#",
  typescript: "//",
  sql: "--",
  go: "//",
  rust: "//",
};

export type Token = { text: string; kind: "keyword" | "string" | "comment" | "plain" };

// Deliberately simple: enough to make gold keywords pop and everything
// else read as muted grey — not a full-fidelity language grammar.
export function highlightLine(line: string, language: CodeLanguage): Token[] {
  const tokens: Token[] = [];
  const prefix = commentPrefix[language];
  const commentIndex = line.indexOf(prefix);

  const codePart = commentIndex >= 0 ? line.slice(0, commentIndex) : line;
  const commentPart = commentIndex >= 0 ? line.slice(commentIndex) : "";

  const stringRe = /(`[^`]*`|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = stringRe.exec(codePart))) {
    if (match.index > lastIndex) {
      tokens.push(...tokenizeWords(codePart.slice(lastIndex, match.index), language));
    }
    tokens.push({ text: match[0], kind: "string" });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < codePart.length) {
    tokens.push(...tokenizeWords(codePart.slice(lastIndex), language));
  }

  if (commentPart) {
    tokens.push({ text: commentPart, kind: "comment" });
  }

  return tokens;
}

function tokenizeWords(text: string, language: CodeLanguage): Token[] {
  const words = keywords[language];
  const isSql = language === "sql";
  const wordRe = /[A-Za-z_][A-Za-z0-9_]*/g;
  const tokens: Token[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = wordRe.exec(text))) {
    if (match.index > lastIndex) {
      tokens.push({ text: text.slice(lastIndex, match.index), kind: "plain" });
    }
    const word = match[0];
    const isKeyword = isSql
      ? words.includes(word.toUpperCase())
      : words.includes(word);
    tokens.push({ text: word, kind: isKeyword ? "keyword" : "plain" });
    lastIndex = match.index + word.length;
  }
  if (lastIndex < text.length) {
    tokens.push({ text: text.slice(lastIndex), kind: "plain" });
  }

  return tokens;
}
