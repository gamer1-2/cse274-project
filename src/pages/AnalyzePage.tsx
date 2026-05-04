import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertTriangle, ShieldCheck, Search, Tag, Sparkles } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';

interface AnalysisResult {
  prediction: 'real' | 'fake';
  confidence: number;
  explanation: string;
  suspiciousKeywords: string[];
}

function AnimatedConfidence({ score, isFake }: { score: number, isFake: boolean }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, latest => latest.toFixed(1) + '%');

  useEffect(() => {
    const controls = animate(count, score * 100, { duration: 1.5, ease: "easeOut" });
    return controls.stop;
  }, [score]);

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <span className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Confidence Score</span>
        <motion.span className="text-3xl font-bold font-mono tracking-tight text-zinc-900 dark:text-white transition-colors duration-500">{rounded}</motion.span>
      </div>
      <div className="h-3 w-full bg-zinc-200 dark:bg-black/40 rounded-full overflow-hidden border border-zinc-300 dark:border-white/5 transition-colors duration-500">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${score * 100}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className={`h-full ${isFake ? 'bg-gradient-to-r from-red-600 to-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]' : 'bg-gradient-to-r from-emerald-600 to-teal-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]'}`}
        />
      </div>
    </div>
  );
}

export function AnalyzePage() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to analyze review');
      }
      
      setResult(data);
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : 'An error occurred during analysis');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight flex items-center transition-colors duration-500">
          Evaluate Review <Sparkles className="ml-2 w-5 h-5 text-indigo-500" />
        </h1>
        <p className="text-zinc-600 dark:text-zinc-500 mt-2 transition-colors duration-500">Run generative AI models to detect fraudulent patterns in raw text.</p>
      </div>

      <Card className="border-zinc-200 dark:border-zinc-800 shadow-lg bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl transition-all duration-500">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Search className="w-5 h-5 text-indigo-500" />
            <span>Review Source</span>
          </CardTitle>
          <CardDescription>Paste the raw text of the review below to begin analysis.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-lg blur opacity-0 group-focus-within:opacity-30 transition duration-500"></div>
            <Textarea 
              placeholder="e.g. This is the most amazing product ever! I highly recommend it..."
              className="relative min-h-[160px] resize-y font-sans text-base bg-white dark:bg-zinc-950 border-zinc-300 dark:border-zinc-800 transition-colors focus-visible:ring-indigo-500"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          <div className="flex justify-end pt-2">
            <Button 
              onClick={handleAnalyze} 
              disabled={loading || !text.trim()} 
              className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 px-8 py-6 rounded-xl text-md transition-all font-semibold"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                    <Loader2 className="h-5 w-5" />
                  </motion.div>
                  <span>Processing...</span>
                </div>
              ) : (
                'Run Analysis'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, type: 'spring', bounce: 0.2 }}
          >
              <div className={`relative overflow-hidden rounded-2xl border ${
              result.prediction === 'fake' 
                ? 'border-red-500/20 bg-white/80 dark:bg-zinc-950' 
                : 'border-emerald-500/20 bg-white/80 dark:bg-zinc-950'
            } shadow-2xl transition-colors duration-500`}>
              
              {/* Background gradient hint */}
              <div className={`absolute top-0 right-0 w-[500px] h-[500px] -translate-y-1/2 translate-x-1/3 rounded-full blur-[100px] opacity-20 ${
                result.prediction === 'fake' ? 'bg-red-500' : 'bg-emerald-500'
              }`} />

              <div className="relative p-8">
                <div className="flex flex-col lg:flex-row gap-10">
                  
                  {/* Left Column: Verdict */}
                  <div className="flex-1 space-y-6 lg:border-r border-zinc-200 dark:border-white/10 lg:pr-10 transition-colors duration-500">
                    <div className="flex items-center space-x-4">
                      <div className={`p-4 rounded-2xl ${
                        result.prediction === 'fake' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                      }`}>
                        {result.prediction === 'fake' ? <AlertTriangle className="w-8 h-8" /> : <ShieldCheck className="w-8 h-8" />}
                      </div>
                      <div>
                        <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-1">Model Verdict</h3>
                        <div className={`text-4xl font-bold capitalize ${result.prediction === 'fake' ? 'text-red-400' : 'text-emerald-400'}`}>
                          {result.prediction}
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-zinc-50 dark:bg-black/50 p-5 rounded-xl border border-zinc-200 dark:border-white/5 shadow-inner transition-colors duration-500">
                      <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed text-sm transition-colors duration-500">
                        {result.explanation}
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Stats & Keywords */}
                  <div className="flex-1 space-y-8 flex flex-col justify-center">
                    <AnimatedConfidence score={result.confidence} isFake={result.prediction === 'fake'} />

                    {result.suspiciousKeywords && result.suspiciousKeywords.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium tracking-tight text-zinc-900 dark:text-white flex items-center transition-colors duration-500">
                          <Tag className="w-4 h-4 mr-2 text-indigo-400" /> Detected Keywords
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {result.suspiciousKeywords.map((kw, i) => (
                            <motion.span 
                              key={i} 
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.5 + (i * 0.1) }}
                              className={
                                result.prediction === 'fake' 
                                  ? 'px-3 py-1.5 bg-red-100/50 dark:bg-red-950/50 text-red-600 dark:text-red-300 border border-red-200/50 dark:border-red-900/50 text-xs rounded-lg font-medium shadow-sm transition-colors duration-500'
                                  : 'px-3 py-1.5 bg-zinc-100/50 dark:bg-white/5 text-zinc-600 dark:text-zinc-300 border border-zinc-200/50 dark:border-white/10 text-xs rounded-lg font-medium shadow-sm transition-colors duration-500'
                              }
                            >
                              {kw}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
