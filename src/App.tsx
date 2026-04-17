import { Recycle, Leaf, Github, Info, BookOpen, BarChart3, Scan } from 'lucide-react';
import { WasteClassifier } from './components/WasteClassifier';
import { Guides } from './components/Guides';
import { Analytics } from './components/Analytics';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'scanner' | 'guides' | 'analytics'>('scanner');

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-20 items-center justify-between px-6">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('scanner')}>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md">
              <Recycle className="h-6 w-6" />
            </div>
            <span className="font-heading text-2xl font-bold tracking-tight text-primary uppercase">AI-POWERED AUTOMATED SEGREGATION AND INNOVATION BINS</span>
          </div>
          <nav className="hidden items-center gap-8 md:flex">
            <button 
              onClick={() => setActiveTab('scanner')}
              className={`text-sm font-semibold uppercase tracking-wider transition-colors ${activeTab === 'scanner' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Scanner
            </button>
            <button 
              onClick={() => setActiveTab('guides')}
              className={`text-sm font-semibold uppercase tracking-wider transition-colors ${activeTab === 'guides' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Guides
            </button>
            <button 
              onClick={() => setActiveTab('analytics')}
              className={`text-sm font-semibold uppercase tracking-wider transition-colors ${activeTab === 'analytics' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Analytics
            </button>
          </nav>
          <div className="flex items-center gap-3">
            <button className="rounded-full p-2 text-zinc-500 hover:bg-zinc-100">
              <Github className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-12 px-4">
        <AnimatePresence mode="wait">
          {activeTab === 'scanner' && (
            <motion.div
              key="scanner"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Hero Section */}
              <div className="mb-16 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-sm font-semibold text-accent-foreground ring-1 ring-inset ring-accent-foreground/20"
                >
                  <Leaf className="h-4 w-4" />
                  AI-Powered Sustainability
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="mt-6 font-heading text-5xl font-bold tracking-tight text-primary sm:text-7xl"
                >
                  Smarter Waste Segregation
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground"
                >
                  Upload a photo of your waste and let our AI classify it instantly. 
                  Get expert recycling tips and help build a cleaner planet.
                </motion.p>
              </div>

              {/* Classifier Component */}
              <WasteClassifier />

              {/* Features Grid */}
              <div className="mt-24 grid gap-8 md:grid-cols-3">
                {[
                  {
                    icon: <Recycle className="h-6 w-6 text-primary" />,
                    title: "Instant Detection",
                    desc: "Advanced vision AI identifies materials in seconds with high accuracy."
                  },
                  {
                    icon: <Info className="h-6 w-6 text-accent-foreground" />,
                    title: "Recycling Tips",
                    desc: "Get specific instructions on how to properly dispose of or recycle items."
                  },
                  {
                    icon: <Leaf className="h-6 w-6 text-primary" />,
                    title: "Eco Impact",
                    desc: "Reduce contamination in recycling streams by sorting correctly at the source."
                  }
                ].map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="rounded-3xl bg-card p-8 shadow-sm ring-1 ring-border"
                  >
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                      {feature.icon}
                    </div>
                    <h3 className="font-heading text-xl font-bold text-primary">{feature.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {feature.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'guides' && (
            <motion.div
              key="guides"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Guides />
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Analytics />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-24 border-t border-border bg-card py-12">
        <div className="container mx-auto px-6">
          <div className="grid gap-12 md:grid-cols-4 mb-12">
            <div className="col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <Recycle className="h-6 w-6 text-primary" />
            <span className="font-heading text-xl font-bold text-primary uppercase">AI-POWERED AUTOMATED SEGREGATION AND INNOVATION BINS</span>
              </div>
              <p className="text-muted-foreground max-w-sm leading-relaxed">
                Empowering individuals to make a difference through AI-powered waste segregation and expert sustainability guidance.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-primary mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => setActiveTab('scanner')} className="text-muted-foreground hover:text-primary">Scanner</button></li>
                <li><button onClick={() => setActiveTab('guides')} className="text-muted-foreground hover:text-primary">Guides</button></li>
                <li><button onClick={() => setActiveTab('analytics')} className="text-muted-foreground hover:text-primary">Analytics</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-primary mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="https://www.epa.gov/recycle" target="_blank" className="text-muted-foreground hover:text-primary">EPA Recycling</a></li>
                <li><a href="https://www.worldwildlife.org/" target="_blank" className="text-muted-foreground hover:text-primary">WWF</a></li>
                <li><a href="https://www.greenpeace.org/" target="_blank" className="text-muted-foreground hover:text-primary">Greenpeace</a></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between gap-6 border-t border-border pt-8 md:flex-row">
            <p className="text-sm text-muted-foreground">
              © 2026 AI-POWERED AUTOMATED SEGREGATION AND INNOVATION BINS. Making the world cleaner, one item at a time.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-primary">Privacy Policy</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
