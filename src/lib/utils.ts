import { ParsedError } from "./types";
import { errorPatterns } from "./constants";
import { saveAs } from "file-saver";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseErrors = (logs: string): ParsedError[] => {
  const errors: ParsedError[] = [];
  const lines = logs.split("\n");

  lines.forEach((line) => {
    let matched = false;
    errorPatterns.forEach(({ pattern, summary, fix }) => {
      const match = line.match(pattern);
      if (match) {
        matched = true;
        const errorType =
          pattern
            .toString()
            .match(
              /(\berror\b|\bsyntax\b|\btype\b|\bruntime\b|\bcompilation\b|\bnetwork\b|\bfile\b)/i,
            )?.[0]
            .toLowerCase() || "other";
        errors.push({
          summary: summary.replace("$0", line),
          fix: typeof fix === "function" ? fix(match) : fix,
          type: errorType,
          original: line,
        });
      }
    });

    if (!matched) {
      // Fallback for any other error messages
      if (line.toLowerCase().includes("syntax error")) {
        errors.push({
          summary: `Syntax Error: ${line}`,
          fix: `Check the syntax in the code. Ensure all brackets, quotes, and semicolons are correctly placed. Refer to the [MDN Web Docs](https://developer.mozilla.org/) for more details on syntax rules.`,
          type: "syntax error",
          original: line,
        });
      } else if (line.toLowerCase().includes("type error")) {
        errors.push({
          summary: `Type Error: ${line}`,
          fix: `Check the type definitions in the code. Ensure that the types are correctly defined and used. Refer to the [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/) for more details on type usage.`,
          type: "type error",
          original: line,
        });
      } else if (line.toLowerCase().includes("runtime error")) {
        errors.push({
          summary: `Runtime Error: ${line}`,
          fix: `Check the runtime environment and code execution. Ensure that all dependencies are correctly installed and configured. Refer to the [JavaScript Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript) for more details on runtime issues.`,
          type: "runtime error",
          original: line,
        });
      } else if (line.toLowerCase().includes("compilation error")) {
        errors.push({
          summary: `Compilation Error: ${line}`,
          fix: `Check the build configuration and code. Ensure that all dependencies are correctly installed and configured. Refer to the [Webpack Documentation](https://webpack.js.org/concepts/) for more details on build configurations.`,
          type: "compilation error",
          original: line,
        });
      } else if (line.toLowerCase().includes("network error")) {
        errors.push({
          summary: `Network Error: ${line}`,
          fix: `Check the network configuration and connectivity. Ensure that all network requests are correctly handled. Refer to the [Fetch API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) for more details on network requests.`,
          type: "network error",
          original: line,
        });
      } else if (line.toLowerCase().includes("file error")) {
        errors.push({
          summary: `File Error: ${line}`,
          fix: `Check the file paths and permissions. Ensure that all files are correctly referenced and accessible. Refer to the [File System Documentation](https://nodejs.org/api/fs.html) for more details on file operations.`,
          type: "file error",
          original: line,
        });
      } else if (line.toLowerCase().includes("error")) {
        errors.push({
          summary: `Error: ${line}`,
          fix: `Check the error message "${line}" and refer to the relevant documentation for more details.`,
          type: "error",
          original: line,
        });
      } else if (line.toLowerCase().includes("warning")) {
        errors.push({
          summary: `Warning: ${line}`,
          fix: `Review the warning message "${line}" and consider addressing it to avoid potential issues.`,
          type: "warning",
          original: line,
        });
      } else if (line.toLowerCase().includes("info")) {
        errors.push({
          summary: `Info: ${line}`,
          fix: `Note the information message "${line}" for reference.`,
          type: "info",
          original: line,
        });
      } else {
        errors.push({
          summary: `Other: ${line}`,
          fix: `Check the message "${line}" and refer to the relevant documentation for more details.`,
          type: "other",
          original: line,
        });
      }
    }
  });

  return errors;
};

export const convertToMarkdown = (
  errors: ParsedError[],
  additionalNotes: string,
): string => {
  const errorMarkdown = errors
    .map(({ summary, fix }) => `### ${summary}\n- **Fix:** ${fix}`)
    .join("\n\n");
  const notes =
    additionalNotes ||
    "Implement these improvements and fixes systematically while maintaining existing functionality.";
  return `# Error Report\n\n## Additional Notes\n${notes}\n\n${errorMarkdown}`;
};

export const downloadErrors = (errors: ParsedError[]): void => {
  const csvContent = [
    "Type,Summary,Fix,Original",
    ...errors.map(
      (error) =>
        `${error.type},${error.summary},${error.fix},${error.original}`,
    ),
  ].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, "error_report.csv");
};
