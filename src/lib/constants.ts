import { ErrorPattern } from './types';

export const DEFAULT_ADDITIONAL_NOTES = "Implement these improvements and fixes systematically while maintaining existing functionality."

export const errorPatterns: ErrorPattern[] = [
    {
        pattern: /(\[error\]|\berror\b): (.+)/i,
        summary: "Error: $2",
        fix: (match) => `Check the error message "${match[2]}" and refer to the relevant documentation for more details.`
    },
    {
        pattern: /(\[warning\]|\bwarning\b): (.+)/i,
        summary: "Warning: $2",
        fix: (match) => `Review the warning message "${match[2]}" and consider addressing it to avoid potential issues.`
    },
    {
        pattern: /(\[info\]|\binfo\b): (.+)/i,
        summary: "Info: $2",
        fix: (match) => `Note the information message "${match[2]}" for reference.`
    },
    {
        pattern: /syntax error/i,
        summary: "Syntax Error: $0",
        fix: (match) => `Check the syntax in the code. Ensure all brackets, quotes, and semicolons are correctly placed. Refer to the [MDN Web Docs](https://developer.mozilla.org/) for more details on syntax rules.`
    },
    {
        pattern: /type error/i,
        summary: "Type Error: $0",
        fix: (match) => `Check the type definitions in the code. Ensure that the types are correctly defined and used. Refer to the [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/) for more details on type usage.`
    },
    {
        pattern: /runtime error/i,
        summary: "Runtime Error: $0",
        fix: (match) => `Check the runtime environment and code execution. Ensure that all dependencies are correctly installed and configured. Refer to the [JavaScript Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript) for more details on runtime issues.`
    },
    {
        pattern: /compilation error/i,
        summary: "Compilation Error: $0",
        fix: (match) => `Check the build configuration and code. Ensure that all dependencies are correctly installed and configured. Refer to the [Webpack Documentation](https://webpack.js.org/concepts/) for more details on build configurations.`
    },
    {
        pattern: /network error/i,
        summary: "Network Error: $0",
        fix: (match) => `Check the network configuration and connectivity. Ensure that all network requests are correctly handled. Refer to the [Fetch API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) for more details on network requests.`
    },
    {
        pattern: /file error/i,
        summary: "File Error: $0",
        fix: (match) => `Check the file paths and permissions. Ensure that all files are correctly referenced and accessible. Refer to the [File System Documentation](https://nodejs.org/api/fs.html) for more details on file operations.`
    }
]