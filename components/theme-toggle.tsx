"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeToggle() {
  const [mounted, setMounted] = React.useState(false);
  const { theme, setTheme } = useTheme();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="bg-transparent border-none hover:bg-transparent h-10 w-10 flex items-center justify-center focus-visible:outline-none focus-visible:ring-0"
      >
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="bg-transparent border-none hover:bg-transparent h-10 w-10 flex items-center justify-center focus-visible:outline-none focus-visible:ring-0"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-amber-400 hover:text-amber-300 transition-colors" />
      ) : (
        <Moon className="h-5 w-5 text-indigo-500 hover:text-indigo-600 transition-colors" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
