## Implementation: 

import { useState } from 'react'
import { Textarea } from "@/components/ui/textarea"
import { Button } from "/components/ui/button"
import { Copy } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Download } from "lucide-react"
import { saveAs } from 'file-saver'

const DEFAULT_ADDITIONAL_NOTES = "Implement these improvements and fixes systematically while maintaining existing functionality."

const errorPatterns = [
  {
    pattern: /(\[error\]|\berror\b): (.+)/i,
    summary: "Error: $2",
    fix: (match: RegExpMatchArray) => `Check the error message "${match[2]}" and refer to the relevant documentation for more details.`
  },
  {
    pattern: /(\[warning\]|\bwarning\b): (.+)/i,
    summary: "Warning: $2",
    fix: (match: RegExpMatchArray) => `Review the warning message "${match[2]}" and consider addressing it to avoid potential issues.`
  },
  {
    pattern: /(\[info\]|\binfo\b): (.+)/i,
    summary: "Info: $2",
    fix: (match: RegExpMatchArray) => `Note the information message "${match[2]}" for reference.`
  },
  {
    pattern: /syntax error/i,
    summary: "Syntax Error: $0",
    fix: (match: RegExpMatchArray) => `Check the syntax in the code. Ensure all brackets, quotes, and semicolons are correctly placed. Refer to the [MDN Web Docs](https://developer.mozilla.org/) for more details on syntax rules.`
  },
  {
    pattern: /type error/i,
    summary: "Type Error: $0",
    fix: (match: RegExpMatchArray) => `Check the type definitions in the code. Ensure that the types are correctly defined and used. Refer to the [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/) for more details on type usage.`
  },
  {
    pattern: /runtime error/i,
    summary: "Runtime Error: $0",
    fix: (match: RegExpMatchArray) => `Check the runtime environment and code execution. Ensure that all dependencies are correctly installed and configured. Refer to the [JavaScript Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript) for more details on runtime issues.`
  },
  {
    pattern: /compilation error/i,
    summary: "Compilation Error: $0",
    fix: (match: RegExpMatchArray) => `Check the build configuration and code. Ensure that all dependencies are correctly installed and configured. Refer to the [Webpack Documentation](https://webpack.js.org/concepts/) for more details on build configurations.`
  },
  {
    pattern: /network error/i,
    summary: "Network Error: $0",
    fix: (match: RegExpMatchArray) => `Check the network configuration and connectivity. Ensure that all network requests are correctly handled. Refer to the [Fetch API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) for more details on network requests.`
  },
  {
    pattern: /file error/i,
    summary: "File Error: $0",
    fix: (match: RegExpMatchArray) => `Check the file paths and permissions. Ensure that all files are correctly referenced and accessible. Refer to the [File System Documentation](https://nodejs.org/api/fs.html) for more details on file operations.`
  }
]

const parseErrors = (logs: string): { summary: string, fix: string, type: string, original: string }[] => {
  const errors: { summary: string, fix: string, type: string, original: string }[] = []
  const lines = logs.split('\n')

  lines.forEach(line => {
    let matched = false
    errorPatterns.forEach(({ pattern, summary, fix }) => {
      const match = line.match(pattern)
      if (match) {
        matched = true
        const errorType = pattern.toString().match(/(\berror\b|\bsyntax\b|\btype\b|\bruntime\b|\bcompilation\b|\bnetwork\b|\bfile\b)/i)?.[0].toLowerCase() || "other"
        errors.push({
          summary: summary.replace('$0', line),
          fix: typeof fix === 'function' ? fix(match) : fix,
          type: errorType,
          original: line
        })
      }
    })

    if (!matched) {
      // Fallback for any other error messages
      if (line.toLowerCase().includes("syntax error")) {
        errors.push({
          summary: `Syntax Error: ${line}`,
          fix: `Check the syntax in the code. Ensure all brackets, quotes, and semicolons are correctly placed. Refer to the [MDN Web Docs](https://developer.mozilla.org/) for more details on syntax rules.`,
          type: "syntax error",
          original: line
        })
      } else if (line.toLowerCase().includes("type error")) {
        errors.push({
          summary: `Type Error: ${line}`,
          fix: `Check the type definitions in the code. Ensure that the types are correctly defined and used. Refer to the [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/) for more details on type usage.`,
          type: "type error",
          original: line
        })
      } else if (line.toLowerCase().includes("runtime error")) {
        errors.push({
          summary: `Runtime Error: ${line}`,
          fix: `Check the runtime environment and code execution. Ensure that all dependencies are correctly installed and configured. Refer to the [JavaScript Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript) for more details on runtime issues.`,
          type: "runtime error",
          original: line
        })
      } else if (line.toLowerCase().includes("compilation error")) {
        errors.push({
          summary: `Compilation Error: ${line}`,
          fix: `Check the build configuration and code. Ensure that all dependencies are correctly installed and configured. Refer to the [Webpack Documentation](https://webpack.js.org/concepts/) for more details on build configurations.`,
          type: "compilation error",
          original: line
        })
      } else if (line.toLowerCase().includes("network error")) {
        errors.push({
          summary: `Network Error: ${line}`,
          fix: `Check the network configuration and connectivity. Ensure that all network requests are correctly handled. Refer to the [Fetch API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) for more details on network requests.`,
          type: "network error",
          original: line
        })
      } else if (line.toLowerCase().includes("file error")) {
        errors.push({
          summary: `File Error: ${line}`,
          fix: `Check the file paths and permissions. Ensure that all files are correctly referenced and accessible. Refer to the [File System Documentation](https://nodejs.org/api/fs.html) for more details on file operations.`,
          type: "file error",
          original: line
        })
      } else if (line.toLowerCase().includes("error")) {
        errors.push({
          summary: `Error: ${line}`,
          fix: `Check the error message "${line}" and refer to the relevant documentation for more details.`,
          type: "error",
          original: line
        })
      } else if (line.toLowerCase().includes("warning")) {
        errors.push({
          summary: `Warning: ${line}`,
          fix: `Review the warning message "${line}" and consider addressing it to avoid potential issues.`,
          type: "warning",
          original: line
        })
      } else if (line.toLowerCase().includes("info")) {
        errors.push({
          summary: `Info: ${line}`,
          fix: `Note the information message "${line}" for reference.`,
          type: "info",
          original: line
        })
      } else {
        errors.push({
          summary: `Other: ${line}`,
          fix: `Check the message "${line}" and refer to the relevant documentation for more details.`,
          type: "other",
          original: line
        })
      }
    }
  })

  return errors
}

const convertToMarkdown = (errors: { summary: string, fix: string }[], additionalNotes: string): string => {
  const errorMarkdown = errors.map(({ summary, fix }) => `### ${summary}\n- **Fix:** ${fix}`).join('\n\n')
  const notes = additionalNotes || DEFAULT_ADDITIONAL_NOTES
  return `# Error Report\n\n## Additional Notes\n${notes}\n\n${errorMarkdown}`
}

const downloadErrors = (errors: { summary: string, fix: string, type: string, original: string }[]) => {
  const csvContent = [
    "Type,Summary,Fix,Original",
    ...errors.map(error => `${error.type},${error.summary},${error.fix},${error.original}`)
  ].join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  saveAs(blob, 'error_report.csv')
}

export default function ErrorParserTool() {
  const [logs, setLogs] = useState('')
  const [errors, setErrors] = useState<{ summary: string, fix: string, type: string, original: string }[]>([])
  const [additionalNotes, setAdditionalNotes] = useState('')
  const [isParsing, setIsParsing] = useState(false)
  const [filterType, setFilterType] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const handleParse = () => {
    setIsParsing(true)
    const parsedErrors = parseErrors(logs)
    setErrors(parsedErrors)
    setIsParsing(false)
  }

  const handleCopyMarkdown = () => {
    const markdown = convertToMarkdown(errors, additionalNotes)
    navigator.clipboard.writeText(markdown)
  }

  const handleClearOutput = () => {
    setLogs('')
    setErrors([])
    setAdditionalNotes('')
    setFilterType('all')
    setSearchQuery('')
  }

  const filteredErrors = errors.filter(error => {
    if (filterType !== 'all' && error.type !== filterType) {
      return false
    }
    if (searchQuery && !error.summary.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    return true
  })

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Error Parser Tool</CardTitle>
          <CardDescription>Paste your error logs here and get summarized errors with recommended fixes.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="logs" className="block text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Paste your error logs here:</Label>
            <Textarea
              id="logs"
              value={logs}
              onChange={(e) => setLogs(e.target.value)}
              placeholder="Paste your error logs here..."
              className="resize-none"
              rows={10}
            />
          </div>
          <div className="flex space-x-2">
            <Button onClick={handleParse} disabled={isParsing}>
              {isParsing ? 'Parsing...' : 'Parse Errors'}
            </Button>
            <Button variant="outline" onClick={handleClearOutput}>
              Clear Output
            </Button>
          </div>
        </CardContent>
      </Card>

      {errors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">Error Report</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row md:justify-between space-y-4 md:space-y-0">
              <div className="w-full md:w-1/2 space-y-2">
                <Label htmlFor="additionalNotes" className="block text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Add additional notes here:</Label>
                <Textarea
                  id="additionalNotes"
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="Add additional notes here..."
                  className="resize-none"
                  rows={4}
                />
              </div>
              <div className="w-full md:w-1/2 space-y-2">
                <div className="space-y-2">
                  <Label htmlFor="filterType" className="block text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Filter by Type:</Label>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="syntax error">Syntax Error</SelectItem>
                      <SelectItem value="type error">Type Error</SelectItem>
                      <SelectItem value="runtime error">Runtime Error</SelectItem>
                      <SelectItem value="compilation error">Compilation Error</SelectItem>
                      <SelectItem value="network error">Network Error</SelectItem>
                      <SelectItem value="file error">File Error</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="searchQuery" className="block text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Search Errors:</Label>
                  <Input
                    id="searchQuery"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search errors..."
                  />
                </div>
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24">Type</TableHead>
                  <TableHead>Summary</TableHead>
                  <TableHead>Recommended Fix</TableHead>
                  <TableHead>Original Log</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredErrors.map((error, index) => (
                  <TableRow key={index}>
                    <TableCell className={`font-semibold ${error.type === 'error' ? 'text-red-500' : error.type === 'warning' ? 'text-yellow-500' : error.type === 'info' ? 'text-blue-500' : error.type === 'syntax error' ? 'text-red-500' : error.type === 'type error' ? 'text-red-500' : error.type === 'runtime error' ? 'text-red-500' : error.type === 'compilation error' ? 'text-red-500' : error.type === 'network error' ? 'text-red-500' : error.type === 'file error' ? 'text-red-500' : 'text-gray-500'}`}>
                      {error.type}
                    </TableCell>
                    <TableCell>{error.summary}</TableCell>
                    <TableCell>{error.fix}</TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <span className="cursor-pointer underline">View Original</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <pre className="whitespace-pre-wrap">{error.original}</pre>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex space-x-2">
              <Button onClick={handleCopyMarkdown}>
                <Copy className="mr-2 h-4 w-4" /> Copy as Markdown
              </Button>
              <Button onClick={() => downloadErrors(errors)}>
                <Download className="mr-2 h-4 w-4" /> Download as CSV
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}