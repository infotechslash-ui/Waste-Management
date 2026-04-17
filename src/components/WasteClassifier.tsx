import React, { useState, useCallback } from 'react';
import { Upload, Camera, Trash2, Loader2, CheckCircle2, AlertCircle, Recycle, Info, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { motion, AnimatePresence } from 'framer-motion';
import { classifyWaste, WasteClassificationResult } from '@/services/gemini';
import { CameraCapture } from './CameraCapture';
import confetti from 'canvas-confetti';

export function WasteClassifier() {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<WasteClassificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [history, setHistory] = useState<{ id: string; image: string; category: string }[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;

    setIsAnalyzing(true);
    setError(null);
    try {
      const mimeType = image.split(';')[0].split(':')[1];
      const analysisResult = await classifyWaste(image, mimeType);
      setResult(analysisResult);
      
      if (analysisResult.category !== "Unknown") {
        setHistory(prev => [{ id: Date.now().toString(), image, category: analysisResult.category }, ...prev].slice(0, 6));
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#3b82f6', '#f59e0b']
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    setError(null);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Paper': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Plastic': return 'bg-yellow-50 text-yellow-700 border-yellow-100';
      case 'Metal': return 'bg-zinc-50 text-zinc-700 border-zinc-100';
      case 'Organic': return 'bg-green-50 text-green-700 border-green-100';
      case 'Glass': return 'bg-purple-50 text-purple-700 border-purple-100';
      default: return 'bg-secondary text-secondary-foreground border-border';
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8 p-4">
      <AnimatePresence>
        {showCamera && (
          <CameraCapture
            onCapture={(img) => {
              setImage(img);
              setResult(null);
              setError(null);
            }}
            onClose={() => setShowCamera(false)}
          />
        )}
      </AnimatePresence>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Upload Section */}
        <div className="space-y-6">
          <Card className="overflow-hidden border-2 border-dashed border-accent bg-white transition-colors hover:border-primary">
            <CardContent
              className="flex flex-col items-center justify-center p-10 text-center"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              {image ? (
                <div className="relative w-full space-y-4">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative aspect-square w-full overflow-hidden rounded-2xl border-4 border-secondary shadow-lg"
                  >
                    <img
                      src={image}
                      alt="Waste preview"
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8 rounded-full shadow-md"
                      onClick={reset}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </motion.div>
                  {!result && !isAnalyzing && (
                    <div className="flex justify-center">
                      <Button variant="ghost" size="sm" onClick={reset} className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Clear & Change Image
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-primary">
                    <Upload className="h-8 w-8" />
                  </div>
                  <div className="space-y-2">
                    <p className="font-heading text-xl font-bold text-primary">Drop your image here</p>
                    <p className="text-sm text-muted-foreground">or click to browse from your device</p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-3">
                    <Button variant="outline" className="relative border-border bg-background text-foreground hover:bg-secondary">
                      <input
                        type="file"
                        className="absolute inset-0 cursor-pointer opacity-0"
                        onChange={handleImageUpload}
                        accept="image/*"
                      />
                      Choose File
                    </Button>
                    <Button variant="outline" onClick={() => setShowCamera(true)} className="border-border bg-background text-foreground hover:bg-secondary">
                      <Camera className="mr-2 h-4 w-4" />
                      Take Photo
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {result ? (
            <Button
              variant="outline"
              className="w-full py-7 text-lg font-bold shadow-lg transition-all active:scale-[0.98] border-primary text-primary hover:bg-secondary"
              onClick={reset}
            >
              <RefreshCw className="mr-2 h-5 w-5" />
              New Scan
            </Button>
          ) : (
            <Button
              className="w-full py-7 text-lg font-bold shadow-lg transition-all active:scale-[0.98] bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={!image || isAnalyzing}
              onClick={handleAnalyze}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing Waste...
                </>
              ) : (
                <>
                  <Recycle className="mr-2 h-5 w-5" />
                  Detect Waste Type
                </>
              )}
            </Button>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 rounded-lg bg-destructive/10 p-4 text-destructive"
            >
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </motion.div>
          )}

          {history.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="pt-4 space-y-4"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-widest text-secondary-foreground">Recent History</p>
                <div className="h-px flex-1 bg-border ml-4" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="group relative aspect-square overflow-hidden rounded-2xl border-2 border-white shadow-sm ring-1 ring-border transition-transform hover:scale-105 cursor-pointer"
                    onClick={() => {
                      setImage(item.image);
                      setResult(null);
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.category}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <span className="text-[10px] font-bold text-white uppercase tracking-tighter">{item.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className="h-full border-none shadow-xl ring-1 ring-border bg-white rounded-3xl overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-xs font-bold uppercase tracking-widest text-secondary-foreground">Detected Category</p>
                        <CardTitle className="font-heading text-5xl text-primary">{result.category}</CardTitle>
                      </div>
                      <Badge className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full ${getCategoryColor(result.category)}`}>
                        Classification Successful
                      </Badge>
                    </div>
                    <CardDescription className="text-base text-muted-foreground mt-4 italic">
                      {result.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm font-bold text-secondary-foreground uppercase tracking-wider">
                        <span>Confidence Score</span>
                        <span className="text-primary">{Math.round(result.confidence * 100)}%</span>
                      </div>
                      <Progress value={result.confidence * 100} className="h-2 bg-secondary" />
                    </div>

                    <Separator className="bg-border" />

                    <div className="space-y-4">
                      <div className="flex items-center gap-2 font-bold text-secondary-foreground uppercase tracking-widest text-xs">
                        <Info className="h-4 w-4 text-primary" />
                        Recycling Tips
                      </div>
                      <div className="grid gap-3">
                        {result.recyclingTips.map((tip, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-start gap-3 rounded-2xl bg-secondary p-4 text-sm text-secondary-foreground"
                          >
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            {tip}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-secondary/30 p-6">
                    <div className="flex w-full items-center justify-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                      <Recycle className="h-3 w-3" />
                      Powered by AI-POWERED AUTOMATED SEGREGATION AND INNOVATION BINS
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-3xl border-2 border-dotted border-accent bg-white/30 p-8 text-center"
              >
                <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-white shadow-sm ring-1 ring-border">
                  <Recycle className="h-12 w-12 text-accent" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-primary">Ready to Sort</h3>
                <p className="mt-3 max-w-[280px] text-sm text-muted-foreground leading-relaxed">
                  Upload an image of waste to see the AI classification and expert recycling tips.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
