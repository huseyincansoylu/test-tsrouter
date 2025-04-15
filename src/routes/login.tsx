import { useState } from 'react';
import { useAuth } from '../auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createFileRoute, redirect, useRouter } from '@tanstack/react-router';

export const Route = createFileRoute('/login')({
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: '/dashboard' });
    }
  },
  component: LoginComponent,
});

function LoginComponent() {
  const auth = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState<string>('');

  const handleLogin = async (provider: 'google' | 'github' | 'email_passwordless') => {
    try {
      if (provider === 'email_passwordless') {
        if (!email) {
          throw new Error('Email or phone is required');
        }
        await auth.login('email_passwordless', email);
      } else {
        await auth.login(provider);
      }

      await router.invalidate();
      await router.navigate({ to: '/dashboard' });
    } catch (err) {
      console.error('Login failed', err);
    }
  };

  return (
    <div className="mx-auto mt-40 grid max-w-[420px] gap-6">
      <div className="grid place-items-center gap-4">
        <Button className="w-full" onClick={() => handleLogin('google')}>
          Login with Google
        </Button>

        <div className="grid w-full grid-cols-1 gap-4">
          <Button className="w-full" variant="secondary" onClick={() => handleLogin('github')}>
            Github
          </Button>
        </div>
      </div>
      <div className="grid gap-4">
        <Input placeholder="Email/Phone" value={email} onChange={e => setEmail(e.target.value)} />

        <Button
          className="bg-purple-400 hover:bg-purple-300"
          onClick={() => handleLogin('email_passwordless')}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
