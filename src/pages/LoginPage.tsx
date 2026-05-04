import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '@/src/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShieldCheck, Loader2, Key } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export function LoginPage() {
  const [email, setEmail] = useState('admin@fakereview.ai');
  const [password, setPassword] = useState('admin');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      
      if (data.token) {
        login(data.user, data.token);
        toast.success(`Welcome back, ${data.user.name}`);
        if (data.user.role === 'admin') {
          navigate('/dashboard');
        } else {
          navigate('/analyze');
        }
      } else {
         toast.error('Invalid credentials. Use admin@fakereview.ai');
      }
    } catch (e) {
      console.error(e);
      toast.error('Connection error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black p-4 relative overflow-hidden font-sans selection:bg-indigo-500/30 transition-colors duration-500">
      {/* Background gradients */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-40">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-indigo-900/40 blur-[120px] animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-violet-900/40 blur-[120px] animate-pulse" style={{ animationDuration: '6s' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="max-w-md w-full space-y-8 glass-card border border-zinc-200 dark:border-white/10 p-10 rounded-3xl relative z-10 shadow-2xl backdrop-blur-2xl bg-white/60 dark:bg-zinc-950/60 transition-colors duration-500"
      >
        <div className="text-center">
          <div className="mx-auto w-14 h-14 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.5)] mb-6">
            <ShieldCheck className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white transition-colors duration-500">Sign in to Veritas</h2>
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 transition-colors duration-500">
            Enter your credentials to access the project dashboard.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 transition-colors duration-500">Email address</label>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-xl blur opacity-0 group-focus-within:opacity-40 transition duration-500"></div>
                <Input 
                  type="email" 
                  required 
                  className="relative bg-zinc-50/50 dark:bg-black/60 border-zinc-300 dark:border-white/10 text-zinc-900 dark:text-white h-12 px-4 focus-visible:ring-indigo-500 focus-visible:ring-offset-0 focus-visible:border-indigo-500 rounded-xl transition-colors duration-500"
                  placeholder="admin@fakereview.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between pointer-events-none mb-2">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-colors duration-500">Password</label>
              </div>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-xl blur opacity-0 group-focus-within:opacity-40 transition duration-500"></div>
                <Input 
                  type="password" 
                  required 
                  className="relative bg-zinc-50/50 dark:bg-black/60 border-zinc-300 dark:border-white/10 text-zinc-900 dark:text-white h-12 px-4 focus-visible:ring-indigo-500 focus-visible:ring-offset-0 focus-visible:border-indigo-500 rounded-xl transition-colors duration-500"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="bg-zinc-100/50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl p-4 flex items-start space-x-3 transition-colors duration-500">
            <Key className="w-5 h-5 text-indigo-500 dark:text-indigo-400 mt-0.5 flex-shrink-0 transition-colors duration-500" />
            <div className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed transition-colors duration-500">
              <span className="text-zinc-900 dark:text-white font-medium transition-colors duration-500">Demo Access</span><br/>
              Email: <code className="bg-zinc-200/50 dark:bg-black/30 px-1 py-0.5 rounded transition-colors duration-500">admin@fakereview.ai</code><br/>
              Password: <code className="bg-zinc-200/50 dark:bg-black/30 px-1 py-0.5 rounded transition-colors duration-500">admin</code>
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={loading} 
            className="w-full h-12 bg-zinc-900 text-white dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 dark:text-black font-semibold rounded-xl text-base transition-all shadow-lg shadow-zinc-900/10 dark:shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-xl hover:dark:shadow-[0_0_30px_rgba(255,255,255,0.3)] duration-500"
          >
            {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            {loading ? 'Authenticating...' : 'Sign in to Dashboard'}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
