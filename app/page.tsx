"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { ArrowRight, Bot, Code, Cpu, Layers, Sparkles, User, Zap, Globe, Atom, Wind, Box, Activity } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { DotPattern } from "@/components/ui/dot-pattern";
import { AuroraText } from "@/components/ui/aurora-text";
import { Marquee } from "@/components/ui/marquee";

const TECH_STACK = [
  { name: "Next.js App Router", icon: Globe },
  { name: "React 19", icon: Atom },
  { name: "Tailwind CSS v4", icon: Wind },
  { name: "Shadcn UI", icon: Box },
  { name: "Framer Motion", icon: Activity },
  { name: "Google Gemini API", icon: Sparkles },
];

export default function LandingPage() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } },
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-primary/30">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/80 border-b border-border">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <span className="font-semibold text-lg tracking-tight">Nexa Point</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/chat">
              <Button className="rounded-full px-6 bg-primary text-white hover:bg-primary/90 font-medium">
                Try Now
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="pt-32 pb-20 px-6 overflow-hidden relative">
          <DotPattern className="absolute inset-0 z-0 opacity-30 dark:opacity-20" />
          {/* Decorative glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl -z-10 pointer-events-none" />
          
          <motion.div 
            className="container mx-auto max-w-5xl text-center relative z-10"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="mb-8 flex justify-center">
              <AnimatedGradientText className="px-4 py-1.5 rounded-full border border-border bg-background/50 backdrop-blur-sm shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                <span className="flex items-center gap-2 text-sm font-medium">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">Introducing Nexa Point AI</span>
                </span>
              </AnimatedGradientText>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-6xl md:text-8xl font-heading font-medium tracking-tighter leading-[0.85] mb-8"
              style={{ letterSpacing: "-0.05em" }}
            >
              The Next Evolution of <br className="hidden md:block" />
              <AuroraText>Conversational AI</AuroraText>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-muted-foreground text-xl md:text-2xl max-w-2xl mx-auto mb-12 leading-relaxed"
            >
              A premium, persona-driven chatbot experience built with Next.js and Google Gemini. Select your expert and get things done.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/chat">
                <Button size="lg" className="rounded-full px-8 py-6 text-lg font-medium bg-foreground text-background hover:bg-foreground/90 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary/20">
                  Start Chatting <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="rounded-full px-8 py-6 text-lg font-medium border-border hover:bg-secondary transition-all">
                  Learn More
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* Product Demo/Screenshot Placeholder */}
        <section className="py-20 px-6">
          <div className="container mx-auto max-w-5xl">
            <div className="relative rounded-2xl border border-border bg-card shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] overflow-hidden aspect-video flex items-center justify-center group">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <Bot className="h-24 w-24 text-muted-foreground/30" />
              <div className="absolute top-0 w-full h-12 border-b border-border/50 flex items-center px-4 gap-2 bg-background/50 backdrop-blur-md">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <div className="h-3 w-3 rounded-full bg-green-500/80" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 px-6 border-t border-border/50 bg-secondary/20">
          <div className="container mx-auto max-w-5xl">
            <div className="mb-16">
              <h2 className="text-4xl md:text-5xl font-heading font-medium tracking-tight mb-4">Powerful Features</h2>
              <p className="text-muted-foreground text-lg">Everything you need for a seamless AI experience.</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: User, title: "Persona Selection", desc: "Choose from Travel Planner, Financial Consultant, or Copywriter roles." },
                { icon: Layers, title: "Local History", desc: "Your conversations are securely saved locally in your browser." },
                { icon: Sparkles, title: "Markdown Support", desc: "Rich text formatting, code blocks, and tables rendered perfectly." },
                { icon: Zap, title: "Smooth Animations", desc: "Fluid transitions and micro-interactions powered by Framer Motion." },
                { icon: Code, title: "Premium Design", desc: "A cinematic, dark-themed UI inspired by the best design tools." },
                { icon: Cpu, title: "Gemini AI", desc: "Powered by the state-of-the-art Google Gemini API engine." },
              ].map((feature, i) => (
                <div key={i} className="p-6 rounded-2xl border border-border bg-card hover:bg-secondary/50 transition-colors group">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-heading font-medium mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section className="py-24 px-6">
          <div className="container mx-auto max-w-5xl text-center">
            <h2 className="text-3xl font-heading font-medium tracking-tight mb-12">Built With the Best</h2>
            <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
              <Marquee pauseOnHover className="[--duration:20s]">
                {TECH_STACK.map((tech, i) => (
                  <div key={i} className="px-6 py-3 mx-2 rounded-full border border-border bg-card hover:bg-secondary/50 transition-colors text-foreground font-medium text-sm flex items-center gap-2 shadow-sm whitespace-nowrap">
                    <tech.icon className="h-4 w-4 text-primary" />
                    {tech.name}
                  </div>
                ))}
              </Marquee>
              <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 sm:w-1/4 bg-gradient-to-r from-background"></div>
              <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 sm:w-1/4 bg-gradient-to-l from-background"></div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="container mx-auto max-w-5xl flex flex-col md:flex-row justify-between items-center gap-4 text-muted-foreground text-sm">
          <p>© 2026 Nexa Point. Created with precision.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-primary transition-colors">GitHub</Link>
            <Link href="#" className="hover:text-primary transition-colors">Twitter</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
