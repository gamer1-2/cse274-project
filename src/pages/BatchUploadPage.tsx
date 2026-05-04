import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, UploadCloud, File, LayoutGrid, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export function BatchUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        setResults([]);
      } else {
        toast.error('Please upload a valid CSV file.');
      }
    }
  };

  const processBatch = async () => {
    if (!file) return;
    setLoading(true);
    
    // Simulate reading a CSV
    setTimeout(async () => {
      try {
        const mockReviews = [
          "This is amazing, highly recommend it to everyone!",
          "Arrived broken, the packaging was terrible. Returning it.",
          "Perfect gift! Best product ever.",
          "It's okay, does the job but a bit overpriced.",
          "Do not buy! Fake seller and terrible quality."
        ];

        const res = await fetch('/api/analyze/batch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reviews: mockReviews }),
        });
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || 'Failed to process batch.');
        }
        
        setResults(data.results);
        toast.success(`Successfully analyzed ${data.results.length} reviews.`);
      } catch (err) {
        console.error(err);
        toast.error(err instanceof Error ? err.message : 'An error occurred during batch analysis.');
      } finally {
        setLoading(false);
      }
    }, 2000);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selectedFile = e.dataTransfer.files[0];
      if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        setResults([]);
      } else {
        toast.error('Please upload a valid CSV file.');
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight flex items-center transition-colors duration-500">
          Batch Processing <LayoutGrid className="ml-2 h-6 w-6 text-indigo-500" />
        </h1>
        <p className="text-zinc-600 dark:text-zinc-500 mt-2 transition-colors duration-500">Upload a CSV file containing reviews to run full AI analysis in bulk.</p>
      </div>

      <Card className="border-zinc-200 dark:border-white/5 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-xl shadow-2xl transition-all duration-500">
        <CardContent className="pt-6">
          <div 
            className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border-2 border-dashed border-zinc-300 dark:border-white/10 hover:border-indigo-500/50 transition-colors bg-white/50 dark:bg-white/[0.02]"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {file ? (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center">
                <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mb-4">
                  <File className="w-10 h-10 text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight transition-colors duration-500">{file.name}</h3>
                <p className="text-zinc-500 text-sm mb-8 mt-1 font-mono transition-colors duration-500">{(file.size / 1024).toFixed(2)} KB</p>
                <div className="flex space-x-4">
                  <Button variant="outline" onClick={() => setFile(null)} className="border-zinc-300 dark:border-white/10 text-zinc-700 dark:text-white hover:bg-zinc-100 dark:hover:bg-white/5 disabled:opacity-50 transition-colors duration-500" disabled={loading}>
                    Remove File
                  </Button>
                  <Button onClick={processBatch} disabled={loading} className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]">
                    {loading ? (
                      <>
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                          <Loader2 className="mr-2 h-4 w-4" />
                        </motion.div>
                        Processing Rows...
                      </>
                    ) : (
                      'Run Batch Analysis'
                    )}
                  </Button>
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center pointer-events-none transition-colors duration-500">
                <div className="w-24 h-24 bg-zinc-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6 shadow-inner border border-zinc-200 dark:border-white/5 group-hover:bg-zinc-200 dark:group-hover:bg-white/10 transition-colors">
                  <UploadCloud className="w-10 h-10 text-indigo-500 dark:text-indigo-400 transition-colors duration-500" />
                </div>
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2 transition-colors duration-500">Drag & drop your CSV file</h3>
                <p className="text-zinc-600 dark:text-zinc-500 mb-8 max-w-sm transition-colors duration-500">
                  System supports up to <span className="text-zinc-800 dark:text-zinc-300 transition-colors duration-500">50,000 rows</span> per batch. Must contain "review_text" column.
                </p>
                <div className="pointer-events-auto">
                  <input 
                    type="file" 
                    accept=".csv" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleFileChange}
                  />
                  <Button className="bg-zinc-900 text-white dark:bg-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors duration-500" onClick={() => fileInputRef.current?.click()}>
                    Browse Local Files
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", bounce: 0.2 }}
          >
            <Card className="border-zinc-200 dark:border-white/5 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-xl shadow-2xl overflow-hidden transition-colors duration-500">
              <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-violet-500" />
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-zinc-900 dark:text-white transition-colors duration-500">Batch Results</CardTitle>
                  <CardDescription className="text-zinc-600 dark:text-zinc-400 transition-colors duration-500">Successfully processed {results.length} reviews.</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="border-zinc-300 dark:border-white/10 text-zinc-700 dark:text-white hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors duration-500">
                  Export CSV Report
                </Button>
              </CardHeader>
              <CardContent>
                <div className="rounded-xl border border-zinc-200 dark:border-white/10 overflow-hidden bg-white/50 dark:bg-black/40 transition-colors duration-500">
                  <Table>
                    <TableHeader className="bg-zinc-100/50 dark:bg-white/5 border-b border-zinc-200 dark:border-white/10 transition-colors duration-500">
                      <TableRow className="hover:bg-transparent border-b-0">
                        <TableHead className="w-[100px] text-zinc-600 dark:text-zinc-400 font-medium transition-colors duration-500">Row ID</TableHead>
                        <TableHead className="max-w-[400px] text-zinc-600 dark:text-zinc-400 font-medium transition-colors duration-500">Original Text</TableHead>
                        <TableHead className="text-zinc-600 dark:text-zinc-400 font-medium transition-colors duration-500">Prediction</TableHead>
                        <TableHead className="text-zinc-600 dark:text-zinc-400 font-medium text-right transition-colors duration-500">Confidence</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {results.map((res, index) => (
                        <motion.tr 
                          key={res.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="border-b border-zinc-200 dark:border-white/5 hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors"
                        >
                          <TableCell className="font-mono text-zinc-500 dark:text-zinc-500 text-xs transition-colors duration-500">#{res.id}</TableCell>
                          <TableCell className="max-w-[400px]">
                            <div className="truncate text-zinc-900 dark:text-zinc-300 text-sm transition-colors duration-500" title={res.text}>{res.text}</div>
                            {res.suspiciousKeywords && res.suspiciousKeywords.length > 0 && (
                              <div className="flex gap-1 mt-1">
                                {res.suspiciousKeywords.slice(0, 3).map((k: string) => (
                                  <span key={k} className="text-[10px] bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20 px-1.5 py-0.5 rounded transition-colors duration-500">
                                    {k}
                                  </span>
                                ))}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            {res.prediction === 'fake' ? (
                              <Badge className="bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-500/20 border-0 flex items-center w-fit transition-colors duration-500">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2" /> Fake
                              </Badge>
                            ) : (
                              <Badge className="bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-500/20 border-0 flex items-center w-fit transition-colors duration-500">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2" /> Real
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right text-sm">
                            <span className="font-mono text-zinc-900 dark:text-zinc-300 transition-colors duration-500">{(res.confidence * 100).toFixed(1)}%</span>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
