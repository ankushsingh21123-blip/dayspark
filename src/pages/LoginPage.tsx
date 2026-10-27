import { useState, type FormEvent } from 'react';
import { Field } from '../components/Field';

export function LoginPage({ onLogin, error }: { onLogin(input: { email: string; password: string }): Promise<void>; error?: string | null }) {
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState('ankushsingh21123@gmail.com');
  const [password, setPassword] = useState('demo1234');

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    try {
      await onLogin({ email, password });
    } finally {
      setBusy(false);
    }
  };

  const handleInstantDemo = async () => {
    setBusy(true);
    try {
      await onLogin({ email: 'ankushsingh21123@gmail.com', password: 'demo' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-mark">✦</div>
        <p className="eyebrow">Welcome to DaySpark</p>
        <h1>Pick up your rhythm.</h1>
        <form onSubmit={submit}>
          <Field label="Email">
            <input
              name="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </Field>
          <Field label="Password">
            <input
              name="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </Field>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="primary-button" type="submit" disabled={busy}>
            {busy ? 'Opening…' : 'Open DaySpark'}
          </button>
          <button
            type="button"
            className="secondary-button"
            style={{ marginTop: '0.75rem', width: '100%', opacity: 0.9 }}
            onClick={handleInstantDemo}
            disabled={busy}
          >
            ⚡ Instant Access (Demo)
          </button>
        </form>
      </section>
    </main>
  );
}
