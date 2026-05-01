"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { DeleteModal } from "@/components/ui/delete-modal";
import { ConfirmModal } from "@/components/ui/confirm-modal";
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
  PenTool,
  AlertTriangle
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTheme } from "next-themes";
import Link from "next/link";
import Image from "next/image";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useChat } from '@ai-sdk/react';
import ReactMarkdown from 'react-markdown';
import { PersonaId } from "@/lib/personas";
import { useSearchParams, useRouter } from "next/navigation";
import { getAllChats, getChatById, saveChat, updateChatTitle, deleteChat, clearAllChats, ChatSession } from "@/lib/storage";

// History list moved to state

export default function ChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [files, setFiles] = useState<File[]>([]);
  const [assistant, setAssistant] = useState<PersonaId>("travel");
  const assistants = [
    { id: "travel", name: "Travel Planner", icon: Plane },
    { id: "finance", name: "Financial Consultant", icon: TrendingUp },
    { id: "copywriter", name: "Copywriter", icon: PenTool }
  ];
  const { theme, setTheme } = useTheme();

  const searchParams = useSearchParams();
  const router = useRouter();
  const urlId = searchParams.get("id");

  const [input, setInput] = useState("");
  const [chatTitle, setChatTitle] = useState("New Chat");
  const [history, setHistory] = useState<ChatSession[]>([]);
  const [chatId, setChatId] = useState<string | null>(urlId || (typeof window !== 'undefined' ? crypto.randomUUID() : null));

  const [deleteTarget, setDeleteTarget] = useState<'all' | string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const [isConfirmAssistantOpen, setIsConfirmAssistantOpen] = useState(false);
  const [pendingAssistant, setPendingAssistant] = useState<PersonaId | null>(null);

  const { messages, sendMessage, status, stop, error, setMessages } = useChat({
    id: chatId || undefined,
    onFinish: ({ messages: updatedMessages }) => {
      // Save chat when a response is finished
      if (chatId) {
        saveChat({
          id: chatId,
          title: chatTitle,
          personaId: assistant,
          messages: updatedMessages,
          createdAt: Date.now(),
          updatedAt: Date.now()
        });
        setHistory(getAllChats());
      }
    }
  });

  // Load history on mount
  useEffect(() => {
    setHistory(getAllChats());
  }, []);

  const currentChatIdRef = useRef<string | null>(null);
  currentChatIdRef.current = chatId;

  // Handle Chat Switching from URL
  useEffect(() => {
    if (urlId) {
      if (currentChatIdRef.current === urlId) return;
      
      const savedChat = getChatById(urlId);
      if (savedChat) {
        setChatId(urlId);
        setChatTitle(savedChat.title);
        setAssistant(savedChat.personaId);
        setMessages(savedChat.messages);
      }
    } else {
      // New Chat state
      setChatId(crypto.randomUUID());
      setChatTitle("New Chat");
      setMessages([]);
    }
  }, [urlId, setMessages]);

  const isLoading = status === 'submitted' || status === 'streaming';

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, status]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const generateTitle = async (conversationContext: string) => {
    try {
      const res = await fetch('/api/chat/title', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context: conversationContext }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.title && data.title !== "New Chat") {
          const newTitle = data.title.replace(/["']/g, '');
          setChatTitle(newTitle);
          if (chatId) {
            updateChatTitle(chatId, newTitle);
            setHistory(getAllChats());
          }
        }
      }
    } catch (error) {
      console.error('Failed to generate title:', error);
    }
  };

  const handleSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    let currentId = chatId;
    
    // Ensure URL matches the current chatId for new chats
    if (!urlId && currentId) {
      router.replace(`/chat?id=${currentId}`, { scroll: false });
    }

    // Auto-generate title only when we have enough context
    if (chatTitle === "New Chat") {
      const previousText = messages
        .map(m => (m as any).parts?.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('') || (m as any).text || (m as any).content)
        .filter(Boolean)
        .join('\n');
      
      const fullContext = previousText ? `${previousText}\nUser: ${input}` : `User: ${input}`;
      
      // Generate if the input has substance (>20 chars) or we are already at the second turn
      if (fullContext.length > 20 || messages.length >= 2) {
        generateTitle(fullContext);
      }
    }
    
    sendMessage(
      { text: input },
      { body: { personaId: assistant } }
    );
    setInput("");

    // Initial save for new chat
    if (!urlId && currentId) {
      saveChat({
        id: currentId,
        title: chatTitle,
        personaId: assistant,
        messages: [...messages, { id: crypto.randomUUID(), role: 'user', content: input, createdAt: new Date() } as any],
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
      setHistory(getAllChats());
    }
  };

  const confirmDelete = (target: 'all' | string) => {
    setDeleteTarget(target);
    setIsOpen(true);
  };

  const executeDelete = () => {
    if (deleteTarget === 'all') {
      clearAllChats();
      setHistory([]);
      router.push('/chat');
    } else if (deleteTarget) {
      deleteChat(deleteTarget);
      setHistory(getAllChats());
      if (chatId === deleteTarget) {
        router.push('/chat');
      }
    }
    setIsOpen(false);
    setDeleteTarget(null);
  };

  const handleDeleteChat = (idToDelete: string) => {
    confirmDelete(idToDelete);
  };

  const handleClearAll = () => {
    confirmDelete('all');
  };

  const handleAssistantSelect = (astId: PersonaId) => {
    if (astId === assistant) return;
    
    if (messages.length > 0) {
      setPendingAssistant(astId);
      setIsConfirmAssistantOpen(true);
    } else {
      setAssistant(astId);
    }
  };

  const executeAssistantChange = () => {
    if (pendingAssistant) {
      setAssistant(pendingAssistant);
      setChatId(crypto.randomUUID());
      setChatTitle("New Chat");
      setMessages([]);
      router.push('/chat');
    }
    setIsConfirmAssistantOpen(false);
    setPendingAssistant(null);
  };

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
            className="h-full border-r border-border bg-card/50 dark:bg-[#050505] flex flex-col shrink-0 relative z-20"
          >
            <div className="p-4 flex items-center justify-between border-b border-border/50">
              <Link href="/" className="flex items-center gap-2 group cursor-pointer">
                <div className="h-8 w-8 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden">
                  <Image src="/logo.png" alt="Nexa Point Logo" width={32} height={32} className="object-cover" />
                </div>
                <span className="font-semibold tracking-tight">Nexa Point</span>
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="rounded-full md:hidden">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-4">
              <Button 
                onClick={() => {
                  router.push('/chat');
                }}
                className="w-full justify-start gap-2 rounded-full bg-foreground text-background hover:bg-foreground/90 border-none h-12 shadow-sm dark:shadow-[0_0_20px_-5px_rgba(255,255,255,0.2)]"
              >
                <Plus className="h-5 w-5" />
                <span className="font-medium">New Chat</span>
              </Button>
            </div>

            <ScrollArea className="flex-1 px-3">
              <div className="space-y-1 py-2">
                <div className="flex items-center justify-between px-4 mb-2 mt-4">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <p className="text-xs font-medium uppercase tracking-wider">History</p>
                  </div>
                  {history.length > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleClearAll}
                      className="h-6 px-2 text-[10px] text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                    >
                      Clear
                    </Button>
                  )}
                </div>
                {history.map((chat) => {
                  const Icon = assistants.find(a => a.id === chat.personaId)?.icon || MessageSquare;
                  return (
                    <div key={chat.id} className="relative group w-full flex items-center mb-1">
                      <Button
                        variant="ghost"
                        onClick={() => router.push(`/chat?id=${chat.id}`)}
                        className={`w-full justify-start gap-3 rounded-xl h-12 font-normal transition-all pr-10 ${
                          chatId === chat.id 
                            ? 'bg-primary/10 text-primary hover:bg-primary/20' 
                            : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                        }`}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="truncate flex-1 text-left">{chat.title}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteChat(chat.id);
                        }}
                        className="absolute right-1 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                        title="Delete chat"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  );
                })}
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
            <span className="font-medium truncate max-w-[200px] md:max-w-md">{chatTitle}</span>
          </div>
        </header>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 min-h-0">
          <div className="max-w-3xl mx-auto space-y-8 pb-4 h-full flex flex-col pt-10 md:pt-20">
            
            {messages.length === 0 ? (
              /* Welcome / Empty State */
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center text-center"
              >
                <div className="h-16 w-16 rounded-2xl bg-card dark:bg-[#090909] border border-border flex items-center justify-center mb-6 shadow-[0_0_30px_-5px_rgba(0,153,255,0.15)] ring-1 ring-primary/20">
                  <Bot className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl md:text-3xl font-heading font-medium tracking-tight mb-2">
                  {assistants.find(a => a.id === assistant)?.name || "Assistant"}
                </h2>
                <p className="text-muted-foreground">Select a skill or just start typing.</p>
              </motion.div>
            ) : (
              <div className="space-y-6">
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.role === 'assistant' && (
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0 mt-1">
                        <Bot size={16} className="text-primary" />
                      </div>
                    )}
                    
                    <div className={`px-5 py-3.5 rounded-2xl max-w-[85%] ${
                      message.role === 'user' 
                        ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                        : 'bg-muted/50 border border-border/50 rounded-tl-sm'
                    }`}>
                      {message.role === 'user' ? (
                        <div className="whitespace-pre-wrap text-[15px]">
                          {(message as any).parts?.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('') || (message as any).text || (message as any).content}
                        </div>
                      ) : (
                        <div className="prose prose-sm dark:prose-invert max-w-none text-[15px] prose-p:leading-relaxed prose-pre:bg-muted dark:prose-pre:bg-black/50 prose-pre:border prose-pre:border-border">
                          <ReactMarkdown>
                            {(message as any).parts?.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('') || (message as any).text || (message as any).content}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {status === 'submitted' && (
                  <div className="flex gap-4 justify-start">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0 mt-1">
                      <Bot size={16} className="text-primary animate-pulse" />
                    </div>
                    <div className="px-5 py-4 rounded-2xl max-w-[85%] bg-muted/50 border border-border/50 rounded-tl-sm flex items-center gap-1.5 h-[48px]">
                      <div className="h-2 w-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <div className="h-2 w-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <div className="h-2 w-2 bg-primary/60 rounded-full animate-bounce" />
                    </div>
                  </div>
                )}
                
                {/* Error Indicator */}
                {error && (
                  <div className="flex gap-4 justify-start">
                    <div className="h-8 w-8 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20 shrink-0 mt-1">
                      <Bot size={16} className="text-red-500" />
                    </div>
                    <div className="px-5 py-4 rounded-2xl max-w-[85%] bg-red-500/5 border border-red-500/20 rounded-tl-sm text-[15px]">
                      <div className="font-medium text-red-500 mb-1.5 flex items-center gap-1.5">
                        <AlertTriangle size={15} />
                        <span>System Error</span>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">{error.message || "An unexpected error occurred."}</p>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} className="h-1" />
              </div>
            )}

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
                    <div key={idx} className="flex items-center gap-2 bg-secondary/50 dark:bg-[#111111] border border-border rounded-xl px-3 py-1.5 text-sm group">
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

            <form onSubmit={handleSubmit} className="relative bg-card dark:bg-[#090909] border border-border rounded-3xl shadow-lg dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] focus-within:ring-1 focus-within:ring-primary/30 focus-within:border-primary/50 transition-all">
              <Textarea 
                value={input}
                onChange={handleInputChange}
                placeholder="Ask Nexa Point..." 
                className="min-h-[60px] max-h-[200px] w-full resize-none border-0 bg-transparent dark:bg-transparent px-5 py-4 pt-5 focus-visible:ring-0 text-[15px]"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (input.trim() && !isLoading) {
                      const form = e.currentTarget.form;
                      if (form) {
                        form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                      }
                    }
                  }
                }}
              />
              
              <div className="flex items-center justify-between px-4 pb-3 pt-1">
                <div className="flex items-center gap-1">
                  <Button 
                    type="button"
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
                      <span>{assistants.find(a => a.id === assistant)?.name || assistant}</span>
                      <ChevronDown className="h-3 w-3" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56 bg-card border-border rounded-xl shadow-xl p-2">
                      {assistants.map((ast) => {
                        const Icon = ast.icon;
                        return (
                          <DropdownMenuItem 
                            key={ast.id} 
                            onClick={() => handleAssistantSelect(ast.id as PersonaId)}
                            className={`flex items-center gap-2.5 px-3 py-2.5 text-sm cursor-pointer rounded-lg ${assistant === ast.id ? 'bg-primary/10 text-primary focus:bg-primary/20 focus:text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                          >
                            <Icon className="h-4 w-4" />
                            <span>{ast.name}</span>
                          </DropdownMenuItem>
                        )
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <Button 
                  type="submit"
                  size="icon" 
                  disabled={isLoading || (!input.trim() && files.length === 0)}
                  className="rounded-full h-9 w-9 bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50 disabled:bg-secondary disabled:text-muted-foreground transition-all"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
            
            <div className="text-center mt-3">
              <p className="text-[11px] text-muted-foreground/60">
                Nexa Point AI can make mistakes. Consider verifying important information.
              </p>
            </div>
          </div>
        </div>
      </main>

      <DeleteModal 
        isOpen={isOpen} 
        onOpenChange={setIsOpen} 
        target={deleteTarget} 
        onConfirm={executeDelete} 
      />

      <ConfirmModal
        isOpen={isConfirmAssistantOpen}
        onOpenChange={setIsConfirmAssistantOpen}
        title="Change Assistant"
        description="Selecting a different assistant requires starting a new chat. Your current chat will be saved in history. Do you want to continue?"
        confirmText="Start New Chat"
        onConfirm={executeAssistantChange}
      />
    </div>
  );
}
