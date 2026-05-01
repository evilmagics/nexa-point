"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { 
  Bot, 
  Menu, 
  MessageSquare, 
  Moon, 
  Paperclip, 
  Plus, 
  Send, 
  Settings, 
  Sun, 
  Trash2, 
  X,
  FileText,
  Clock,
  ChevronDown,
  Sparkles,
  Plane,
  TrendingUp,
  PenTool
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTheme } from "next-themes";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Dummy data for history
const DUMMY_HISTORY = [
  { id: 1, title: "Trip to Japan Planner", date: "Today" },
  { id: 2, title: "Investment Strategy 2026", date: "Yesterday" },
  { id: 3, title: "Landing Page Copy", date: "Previous 7 Days" },
];

export default function ChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [input, setInput] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [assistant, setAssistant] = useState("General Assistant");
  const assistants = [
    { id: "General Assistant", icon: Sparkles },
    { id: "Travel Planner", icon: Plane },
    { id: "Financial Consultant", icon: TrendingUp },
    { id: "Copywriter", icon: PenTool }
  ];
  const { theme, setTheme } = useTheme();

  // File Dropzone setup
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Filter max 5MB
    const validFiles = acceptedFiles.filter(file => file.size <= 5 * 1024 * 1024);
    if (validFiles.length < acceptedFiles.length) {
      alert("Some files were rejected because they exceed the 5MB limit.");
    }
    setFiles(prev => [...prev, ...validFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 5 * 1024 * 1024,
    noClick: true, // We'll trigger it manually from the paperclip button
    noKeyboard: true
  });

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      {/* Sidebar */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 300, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="h-full border-r border-border bg-[#050505] flex flex-col shrink-0 relative z-20"
          >
            <div className="p-4 flex items-center justify-between border-b border-border/50">
              <Link href="/" className="flex items-center gap-2 group cursor-pointer">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <span className="font-semibold tracking-tight">Nexa Point</span>
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="rounded-full md:hidden">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-4">
              <Button className="w-full justify-start gap-2 rounded-full bg-white text-black hover:bg-neutral-200 border-none h-12 shadow-[0_0_20px_-5px_rgba(255,255,255,0.2)]">
                <Plus className="h-5 w-5" />
                <span className="font-medium">New Chat</span>
              </Button>
            </div>

            <ScrollArea className="flex-1 px-3">
              <div className="space-y-1 py-2">
                <div className="flex items-center gap-1.5 px-4 mb-2 mt-4 text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  <p className="text-xs font-medium uppercase tracking-wider">History</p>
                </div>
                {DUMMY_HISTORY.map((chat) => (
                  <Button
                    key={chat.id}
                    variant="ghost"
                    className="w-full justify-start gap-3 rounded-xl h-12 text-muted-foreground hover:text-foreground hover:bg-secondary/50 font-normal"
                  >
                    <MessageSquare className="h-4 w-4 shrink-0" />
                    <span className="truncate flex-1 text-left">{chat.title}</span>
                  </Button>
                ))}
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-border/50 flex flex-col gap-2">
              <div className="flex items-center justify-between px-2">
                <span className="text-sm font-medium text-muted-foreground">Theme</span>
                <ThemeToggle />
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <main 
        className="flex-1 flex flex-col min-w-0 relative"
        {...getRootProps()}
      >
        <input {...getInputProps()} id="file-upload" className="hidden" />
        
        {/* Drag Overlay */}
        <AnimatePresence>
          {isDragActive && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-background/80 backdrop-blur-sm border-2 border-dashed border-primary m-4 rounded-3xl flex flex-col items-center justify-center pointer-events-none"
            >
              <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <Plus className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-heading font-medium tracking-tight">Drop files here</h3>
              <p className="text-muted-foreground mt-2">Maximum file size: 5MB</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <header className="h-16 border-b border-border flex items-center px-4 shrink-0 bg-background/80 backdrop-blur-md z-10 sticky top-0">
          {!sidebarOpen && (
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="rounded-full mr-2">
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <div className="flex items-center gap-2">
            <span className="font-medium">New Chat</span>
          </div>
        </header>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 min-h-0">
          <div className="max-w-3xl mx-auto space-y-8 pb-4 h-full flex flex-col pt-10 md:pt-20">
            
            {/* Welcome / Empty State */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center text-center"
            >
              <div className="h-16 w-16 rounded-2xl bg-[#090909] border border-border flex items-center justify-center mb-6 shadow-[0_0_30px_-5px_rgba(0,153,255,0.15)] ring-1 ring-primary/20">
                <Bot className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-heading font-medium tracking-tight mb-2">How can I help you today?</h2>
              <p className="text-muted-foreground">Select a skill or just start typing.</p>
            </motion.div>

          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 md:px-8 pb-6 shrink-0 bg-background border-t border-border/20">
          <div className="max-w-3xl mx-auto">
            
            {/* Attached Files Preview */}
            <AnimatePresence>
              {files.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: 10, height: 0 }}
                  className="flex flex-wrap gap-2 mb-3"
                >
                  {files.map((file, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-[#111111] border border-border rounded-xl px-3 py-1.5 text-sm group">
                      <FileText className="h-4 w-4 text-primary" />
                      <span className="truncate max-w-[120px] text-xs font-medium">{file.name}</span>
                      <button 
                        onClick={() => removeFile(idx)}
                        className="ml-1 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative bg-[#090909] border border-border rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] focus-within:ring-1 focus-within:ring-primary/30 focus-within:border-primary/50 transition-all">
              <Textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Nexa Point..." 
                className="min-h-[60px] max-h-[200px] w-full resize-none border-0 bg-transparent dark:bg-transparent px-5 py-4 pt-5 focus-visible:ring-0 text-[15px]"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    // Handle send
                    if (input.trim()) setInput("");
                  }
                }}
              />
              
              <div className="flex items-center justify-between px-4 pb-3 pt-1">
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full h-8 w-8 text-muted-foreground hover:text-foreground shrink-0"
                    onClick={() => {
                      document.getElementById("file-upload")?.click();
                    }}
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-secondary/50 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors border border-transparent hover:border-border cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50">
                      <span>{assistant}</span>
                      <ChevronDown className="h-3 w-3" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56 bg-card border-border rounded-xl shadow-xl p-2">
                      {assistants.map((ast) => {
                        const Icon = ast.icon;
                        return (
                          <DropdownMenuItem 
                            key={ast.id} 
                            onClick={() => setAssistant(ast.id)}
                            className={`flex items-center gap-2.5 px-3 py-2.5 text-sm cursor-pointer rounded-lg ${assistant === ast.id ? 'bg-primary/10 text-primary focus:bg-primary/20 focus:text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                          >
                            <Icon className="h-4 w-4" />
                            <span>{ast.id}</span>
                          </DropdownMenuItem>
                        )
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <Button 
                  size="icon" 
                  disabled={!input.trim() && files.length === 0}
                  className="rounded-full h-9 w-9 bg-white text-black hover:bg-neutral-200 disabled:opacity-50 disabled:bg-secondary disabled:text-muted-foreground transition-all"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="text-center mt-3">
              <p className="text-[11px] text-muted-foreground/60">
                Nexa Point AI can make mistakes. Consider verifying important information.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
