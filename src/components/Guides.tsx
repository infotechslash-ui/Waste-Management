import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ExternalLink, ArrowRight, Recycle, Leaf, Droplets, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const GUIDES = [
  {
    title: "Plastic Recycling 101",
    description: "Learn which plastics can be recycled and how to prepare them for collection.",
    icon: <Droplets className="h-6 w-6 text-blue-500" />,
    category: "Plastic",
    readTime: "5 min read",
    link: "https://www.epa.gov/recycle/recycling-basics"
  },
  {
    title: "Composting at Home",
    description: "Turn your organic waste into nutrient-rich soil for your garden.",
    icon: <Leaf className="h-6 w-6 text-green-600" />,
    category: "Organic",
    readTime: "8 min read",
    link: "https://www.nrdc.org/stories/composting-101"
  },
  {
    title: "Metal & Glass Sorting",
    description: "Best practices for cleaning and sorting aluminum cans and glass jars.",
    icon: <Recycle className="h-6 w-6 text-primary" />,
    category: "Metal/Glass",
    readTime: "4 min read",
    link: "https://www.wm.com/us/en/recycle-right/recycling-101"
  },
  {
    title: "Hazardous Waste Safety",
    description: "How to safely dispose of batteries, electronics, and chemicals.",
    icon: <Trash2 className="h-6 w-6 text-destructive" />,
    category: "Special",
    readTime: "6 min read",
    link: "https://www.epa.gov/hw/household-hazardous-waste-hhw"
  }
];

export function Guides() {
  return (
    <div className="space-y-12 py-12">
      <div className="text-center space-y-4">
        <h2 className="font-heading text-4xl font-bold text-primary">Recycling Guides</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Expert advice and step-by-step instructions to help you sort your waste correctly and maximize your environmental impact.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {GUIDES.map((guide, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="h-full border-border bg-card hover:shadow-md transition-shadow group">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary group-hover:bg-primary/10 transition-colors">
                  {guide.icon}
                </div>
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  <span>{guide.category}</span>
                  <span>{guide.readTime}</span>
                </div>
                <CardTitle className="font-heading text-xl mt-2 group-hover:text-primary transition-colors">
                  {guide.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-sm leading-relaxed">
                  {guide.description}
                </CardDescription>
                <a
                  href={guide.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-bold text-primary hover:underline"
                >
                  Read Guide
                  <ExternalLink className="ml-2 h-3 w-3" />
                </a>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="rounded-3xl bg-primary p-8 md:p-12 text-primary-foreground relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h3 className="font-heading text-3xl font-bold mb-4">Want to learn more?</h3>
          <p className="text-primary-foreground/80 mb-8 leading-relaxed">
            Our comprehensive sustainability library contains over 50+ articles on zero-waste living, circular economy, and local recycling regulations.
          </p>
          <Button variant="secondary" className="font-bold">
            Browse Full Library
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 opacity-10">
          <BookOpen className="h-64 w-64" />
        </div>
      </div>
    </div>
  );
}

function Button({ children, variant, className }: { children: React.ReactNode, variant?: string, className?: string }) {
  const base = "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-all active:scale-95";
  const variants: Record<string, string> = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  };
  return (
    <button className={`${base} ${variants[variant || 'primary']} ${className}`}>
      {children}
    </button>
  );
}
