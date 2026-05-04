import { Link } from 'react-router';
import { Button, buttonVariants } from '@/components/ui/button';
import { ShieldCheck, ArrowRight, Activity, Zap, CheckCircle2, Sparkles, MessageSquareDot, BarChart3, Database } from 'lucide-react';
import { motion } from 'framer-motion';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-50 font-sans selection:bg-indigo-500/30 overflow-hidden transition-colors duration-500">
      {/* Background gradients */}
      <div className="fixed inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-900/30 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-violet-900/30 blur-[120px]" />
      </div>

      {/* Navbar with glass effect */}
      <nav className="fixed top-0 w-full z-50 border-b border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-black/50 backdrop-blur-md transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-lg flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">Veritas</span>
          </div>
          <div className="hidden md:flex space-x-8 text-sm font-medium text-zinc-600 dark:text-zinc-400">
            <a href="#features" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Features</a>
            <a href="#demo" className="hover:text-zinc-900 dark:hover:text-white transition-colors">How it works</a>
          </div>
          <div className="flex space-x-4 items-center">
            <Link to="/login" className={buttonVariants({ variant: "ghost", className: "text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-white/10" })}>
              Sign In
            </Link>
            <Link to="/login" className={buttonVariants({ className: "bg-zinc-900 text-white dark:bg-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-full px-6 transition-all shadow-lg dark:shadow-[0_0_20px_rgba(255,255,255,0.3)]" })}>
              Try Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Hero Section */}
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-8"
            >
              <div className="inline-flex items-center space-x-2 bg-indigo-50 dark:bg-white/5 border border-indigo-100 dark:border-white/10 px-3 py-1 rounded-full text-sm font-medium text-indigo-600 dark:text-indigo-300 backdrop-blur-sm transition-colors duration-500">
                <Sparkles className="h-4 w-4" />
                <span>Capstone Project Demonstration</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-900 dark:text-white leading-[1.1] transition-colors duration-500">
                Detect Fake Reviews with <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-500 dark:from-indigo-400 dark:via-violet-400 dark:to-indigo-400 animate-pulse">Generative AI</span>
              </h1>
              
              <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-xl leading-relaxed transition-colors duration-500">
                A demonstration of utilizing large language models to analyze sentiment, identify bot-generated patterns, and extract suspicious keywords in real-time.
              </p>
              
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
                <Link to="/login" className={buttonVariants({ size: "lg", className: "h-14 px-8 text-base bg-zinc-900 text-white dark:bg-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-full transition-all shadow-lg dark:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-xl dark:hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]" })}>
                  Start Detecting <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Button size="lg" variant="outline" className="h-14 px-8 text-base border-zinc-300 dark:border-white/20 text-zinc-700 dark:text-white hover:bg-zinc-100 dark:hover:bg-white/10 rounded-full backdrop-blur-md transition-colors duration-500">
                  View Source Code
                </Button>
              </div>

              <div className="flex items-center space-x-6 pt-8 border-t border-zinc-200 dark:border-white/10 transition-colors duration-500">
                <div className="text-sm text-zinc-500 dark:text-zinc-400 transition-colors duration-500">
                  Built as a proof-of-concept for detecting <br/>fraudulent product reviews using AI.
                </div>
              </div>
            </motion.div>

            {/* Interactive Hero Visual */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-violet-500/20 rounded-3xl blur-3xl opacity-50" />
              
              <div className="relative glass-card rounded-3xl p-6 md:p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-200 dark:border-white/10 pb-4 transition-colors duration-500">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <span className="text-xs font-mono text-zinc-500 dark:text-zinc-500">Live Detection Demo</span>
                </div>
                
                <div className="bg-white/50 dark:bg-black/50 border border-zinc-200 dark:border-white/5 rounded-xl p-4 transition-colors duration-500">
                  <p className="text-sm text-zinc-700 dark:text-zinc-300 italic transition-colors duration-500">"This is absolutely the best product I have ever purchased. I highly recommend everyone buys it immediately! 5 stars!"</p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-sm text-zinc-400">Verdict</span>
                    <span className="text-red-400 font-bold uppercase tracking-wider text-sm flex items-center">
                      <Zap className="w-4 h-4 mr-1" /> Bot Generated
                    </span>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-zinc-600 dark:text-zinc-500 transition-colors duration-500">Confidence Score</span>
                      <span className="text-zinc-900 dark:text-white font-mono transition-colors duration-500">98.2%</span>
                    </div>
                    <div className="h-2 bg-zinc-200 dark:bg-white/10 rounded-full overflow-hidden transition-colors duration-500">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '98.2%' }}
                        transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-red-500 to-rose-500"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-zinc-200 dark:border-white/10 transition-colors duration-500">
                    <p className="text-xs text-zinc-500 dark:text-zinc-500 mb-2 transition-colors duration-500">Detected Patterns</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-300 text-xs rounded-md transition-colors duration-500">Repetitive Phrasing</span>
                      <span className="px-2 py-1 bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 text-xs rounded-md transition-colors duration-500">High Sentiment Velocity</span>
                      <span className="px-2 py-1 bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 text-xs rounded-md transition-colors duration-500">Generic Praise</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Features Section */}
          <div id="features" className="mt-40">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-zinc-900 dark:text-white transition-colors duration-500">Project Capabilities</h2>
              <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto transition-colors duration-500">Demonstrating modern web technologies mixed with AI.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <FeatureCard 
                icon={Activity}
                title="Generative AI Models"
                description="Our pipeline uses large language models to analyze contextual nuance and detect subtle fake reviews."
                delay={0}
              />
              <FeatureCard 
                icon={Database}
                title="Batch Analytics"
                description="Process sets of reviews to determine wide-spread bot campaigns targeting specific products."
                delay={0.1}
              />
              <FeatureCard 
                icon={BarChart3}
                title="Interactive Dashboard"
                description="A beautiful React-based dashboard to visualize detection trends and statistics."
                delay={0.2}
              />
            </div>
          </div>
          
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-white/10 py-12 mt-20 relative z-10 bg-white/80 dark:bg-black/80 backdrop-blur-lg transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-zinc-500 text-sm">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
             <div className="w-6 h-6 bg-indigo-500 rounded flex items-center justify-center">
              <ShieldCheck className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-zinc-900 dark:text-white transition-colors duration-500">Veritas</span>
          </div>
          <p>© 2024 College Demo Project. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description, delay }: { icon: any, title: string, description: string, delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay }}
      className="p-8 rounded-3xl glass hover:bg-zinc-100/50 dark:hover:bg-white/[0.08] transition-colors group cursor-default shadow-sm hover:shadow-md"
    >
      <div className="h-12 w-12 bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
        <Icon className="h-6 w-6 text-indigo-500 dark:text-indigo-400 transition-colors" />
      </div>
      <h3 className="text-xl font-semibold mb-3 text-zinc-900 dark:text-white transition-colors duration-500">{title}</h3>
      <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm transition-colors duration-500">{description}</p>
    </motion.div>
  );
}

