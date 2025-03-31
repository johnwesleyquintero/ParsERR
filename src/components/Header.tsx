import { Github, Moon, Sun, Triangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";

export function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <img
            src="/logo.svg"
            alt="ParsERR"
            className="h-8 w-8 animate-pulse hover:animate-none"
          />
          <span className="font-bold text-xl">ParsERR</span>
        </div>
        <div className="flex items-center space-x-2">
          <a
            href="https://github.com/johnwesleyquintero/ParsERR"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-300 mr-2"
          >
            <Github className="h-5 w-5" />
          </a>
          <a
            href="https://wesleyquintero.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-300 mr-2"
          >
            <Triangle className="h-5 w-5" />
          </a>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
