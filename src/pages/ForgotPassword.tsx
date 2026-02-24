import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ArrowRight, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { getPasswordResetToken } from "@/services/operations/authAPI";
import { validateEmail } from "@/lib/utils";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Email Required", {
        description: "Please enter your email address."
      });
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Invalid Email", {
        description: "Please enter a valid email address."
      });
      return;
    }

    getPasswordResetToken(email, setSent);
  };

  return (
    <div className="min-h-screen bg-secondary flex flex-col items-center justify-center px-6">
      {/* Logo */}
      <Link to="/" className="text-sm text-muted-foreground mb-6 hover:text-foreground flex items-center gap-1">
        ← Back to home
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-card rounded-2xl p-8 shadow-sm border border-border text-center"
      >
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Mail className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-2xl font-bold mb-2 font-lora">Restore Access</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Enter your registered email address and we'll send you instructions to reset your password.
        </p>

        {sent ? (
          <div className="space-y-4">
            <div className="bg-eco-light rounded-lg p-4">
              <p className="text-sm text-eco font-medium">✓ Reset link sent to {email}</p>
            </div>
            <button onClick={() => setSent(false)} className="text-sm text-primary hover:underline">
              Didn't receive it? Send again
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-left">
              <label className="text-sm font-semibold mb-2 block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g., alex@ecolife.com"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>Send Reset Link <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>
        )}

        <div className="relative flex items-center justify-center my-6">
          <div className="border-t border-border flex-1" />
          <span className="mx-4 text-xs text-muted-foreground uppercase">OR</span>
          <div className="border-t border-border flex-1" />
        </div>

        <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground flex items-center justify-center gap-1">
          <ChevronLeft className="w-4 h-4" /> Return to Login
        </Link>
      </motion.div>

      {/* Bottom text */}
      <div className="flex items-center gap-4 mt-8 text-xs text-muted-foreground uppercase tracking-widest">
        <span>BIODEGRADABLE</span>
        <span>SUSTAINABLE</span>
        <span>RICE STRAW BASED</span>
      </div>
    </div>
  );
}
