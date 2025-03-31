export interface ErrorPattern {
  pattern: RegExp;
  summary: string;
  fix: (match: RegExpMatchArray) => string;
}

export interface ParsedError {
  summary: string;
  fix: string;
  type: string;
  original: string;
}
