import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Copy, Check } from 'lucide-react';

function generateRoomCode(): string {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz';
  const digits = '23456789';
  const specials = '#@$&!%';

  const pick = (pool: string) => pool.charAt(Math.floor(Math.random() * pool.length));

  // Guarantee at least 1 letter, 1 digit, 1 special char
  const guaranteed = [pick(letters), pick(digits), pick(specials)];

  // Fill the remaining 5 slots from the combined pool
  const all = letters + digits + specials;
  for (let i = 0; i < 5; i++) {
    guaranteed.push(pick(all));
  }

  // Shuffle (Fisher-Yates) so the guaranteed chars aren't always first
  for (let i = guaranteed.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [guaranteed[i], guaranteed[j]] = [guaranteed[j], guaranteed[i]];
  }

  return guaranteed.join('');
}

export default function Login() {
  const [secretCode, setSecretCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (secretCode.trim()) {
      navigate(`/workspace/${encodeURIComponent(secretCode.trim())}`);
    }
  };

  const handleCreateRoom = () => {
    const code = generateRoomCode();
    setGeneratedCode(code);
    setCopied(false);
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = generatedCode;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleEnterRoom = () => {
    if (generatedCode) {
      navigate(`/workspace/${encodeURIComponent(generatedCode)}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-950 to-black">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md p-8 glass rounded-2xl shadow-2xl z-10 mx-4"
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <img src="/favicon.svg" alt="Stellar Logo" className="w-20 h-20 mb-4" />
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Stellar</h1>
          <p className="text-neutral-400 text-center text-sm">
            Real-time collaborative workspace. No account required.
          </p>
        </div>

        {/* JOIN EXISTING ROOM */}
        <form onSubmit={handleJoin} className="space-y-4">
          <div>
            <label htmlFor="secretCode" className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
              Join Existing Room
            </label>
            <input
              id="secretCode"
              type="text"
              value={secretCode}
              onChange={(e) => setSecretCode(e.target.value)}
              placeholder="Enter Room Code"
              className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
              autoFocus
            />
          </div>
          <button
            type="submit"
            disabled={!secretCode.trim()}
            className="w-full py-4 px-6 bg-white text-black font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            Join Workspace
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        {/* DIVIDER */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">or</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* CREATE NEW ROOM */}
        {!generatedCode ? (
          <button
            onClick={handleCreateRoom}
            className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:from-blue-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all group"
          >
            Create New Room
          </button>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Your Room Code
            </p>

            {/* Generated Code Display */}
            <div className="flex items-center gap-2">
              <div className="flex-1 px-5 py-4 bg-black/40 border border-purple-500/30 rounded-xl text-center font-mono text-2xl font-bold text-white tracking-[0.3em] select-all">
                {generatedCode}
              </div>
              <button
                onClick={handleCopyCode}
                className="p-4 bg-white/5 border border-white/10 rounded-xl text-neutral-300 hover:bg-white/10 hover:text-white transition-all"
                title="Copy code"
              >
                {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>

            <p className="text-xs text-neutral-500 text-center">
              Share this code with others to collaborate in real-time
            </p>

            {/* Enter Room Button */}
            <button
              onClick={handleEnterRoom}
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:from-blue-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all group"
            >
              Enter Room
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Generate Another */}
            <button
              onClick={handleCreateRoom}
              className="w-full py-2 text-sm text-neutral-500 hover:text-neutral-300 transition-colors"
            >
              Generate a different code
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
