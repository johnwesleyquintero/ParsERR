import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy, Download } from "lucide-react";
import { parseErrors, convertToMarkdown, downloadErrors } from "@/lib/utils";
import { DEFAULT_ADDITIONAL_NOTES } from "@/lib/constants";
import { ParsedError } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ErrorParserTool() {
  const [logs, setLogs] = useState("");
  const [errors, setErrors] = useState<ParsedError[]>([]);
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const handleParse = () => {
    setIsParsing(true);
    const parsedErrors = parseErrors(logs);
    setErrors(parsedErrors);
    setIsParsing(false);
  };

  const handleCopyMarkdown = () => {
    const markdown = convertToMarkdown(filteredErrors, additionalNotes);
    navigator.clipboard.writeText(markdown);
  };

  const handleClearOutput = () => {
    setLogs("");
    setErrors([]);
    setAdditionalNotes("");
    setFilterType("all");
    setSearchQuery("");
  };

  const filteredErrors = errors.filter((error) => {
    if (filterType !== "all" && error.type !== filterType) {
      return false;
    }
    if (
      searchQuery &&
      !error.summary.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <Card className="mb-6 card-hover">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold">
              Error Parser Tool
            </CardTitle>
            <CardDescription>
              Paste your error logs here and get summarized errors with
              recommended fixes.
            </CardDescription>
          </div>
          <img
            src="/favicon.svg"
            alt="ParsERR"
            className="h-8 w-8 hover:rotate-12 transition-transform"
          />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="logs"
              className="block text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Paste your error logs here:
            </Label>
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
              {isParsing ? "Parsing..." : "Parse Errors"}
            </Button>
            <Button variant="outline" onClick={handleClearOutput}>
              Clear Output
            </Button>
          </div>
        </CardContent>
      </Card>

      {errors.length > 0 && (
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Error Report</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row md:justify-between space-y-4 md:space-y-0">
              <div className="w-full md:w-1/2 space-y-2">
                <Label
                  htmlFor="additionalNotes"
                  className="block text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Add additional notes here:
                </Label>
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
                  <Label
                    htmlFor="filterType"
                    className="block text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Filter by Type:
                  </Label>
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
                      <SelectItem value="runtime error">
                        Runtime Error
                      </SelectItem>
                      <SelectItem value="compilation error">
                        Compilation Error
                      </SelectItem>
                      <SelectItem value="network error">
                        Network Error
                      </SelectItem>
                      <SelectItem value="file error">File Error</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="searchQuery"
                    className="block text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Search Errors:
                  </Label>
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
                    <TableCell
                      className={`font-semibold ${error.type === "error" ? "text-red-500" : error.type === "warning" ? "text-yellow-500" : error.type === "info" ? "text-blue-500" : error.type === "syntax error" ? "text-red-500" : error.type === "type error" ? "text-red-500" : error.type === "runtime error" ? "text-red-500" : error.type === "compilation error" ? "text-red-500" : error.type === "network error" ? "text-red-500" : error.type === "file error" ? "text-red-500" : "text-gray-500"}`}
                    >
                      {error.type}
                    </TableCell>
                    <TableCell>{error.summary}</TableCell>
                    <TableCell>{error.fix}</TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <span className="cursor-pointer underline">
                              View Original
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <pre className="whitespace-pre-wrap">
                              {error.original}
                            </pre>
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
              <Button onClick={() => downloadErrors(filteredErrors)}>
                <Download className="mr-2 h-4 w-4" /> Download as CSV
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
