'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/firebase/firebase';
import { Lock, Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [nextPath, setNextPath] = useState('/admin');
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const next = params.get('next');
    if (next && next.startsWith('/')) {
      setNextPath(next);
    }
  }, []);

  const completeLogin = async (payload: Record<string, string>) => {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data?.error || 'Login failed');
    }

    router.push(nextPath);
    router.refresh();
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });

      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      await completeLogin({ idToken });
      await signOut(auth);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in with Google');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await completeLogin({ key });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to log in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-mesh flex items-center justify-center px-4">
      <Card className="w-full max-w-md glass-effect-strong border border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" /> Admin Access
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Sign in with an approved Google account for admin access.
              </p>
              <Button type="button" className="w-full" onClick={handleGoogleSignIn} disabled={googleLoading || loading}>
                {googleLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Continue with Google'}
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Fallback</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="key">Admin Key</Label>
              <Input
                id="key"
                type="password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="Enter admin key"
                required
              />
            </div>

              <p className="text-xs text-muted-foreground">
                The admin key remains available during migration, but Google sign-in is the preferred path.
              </p>

              <Button type="submit" className="w-full" disabled={loading || googleLoading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign In with Admin Key'}
              </Button>
            </form>

            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
