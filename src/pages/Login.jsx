import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import FormError from '../components/FormError';
import TextField from '../components/TextField';
import { authErrorMessage } from '../lib/authErrors';
import { logIn } from '../services/authService';

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await logIn({ email: email.trim(), password });
      // "/" reads the role off the user document and redirects from there.
      navigate('/', { replace: true });
    } catch (caught) {
      setError(authErrorMessage(caught));
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-content flex-col justify-center px-4 py-[22px]">
      <span className="text-heading font-medium">Chhota</span>
      <p className="mt-1 text-body text-muted">Log in to order or to run the queue.</p>

      <form onSubmit={handleSubmit} className="mt-[22px] flex flex-col gap-[18px]">
        <TextField
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@college.edu"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <TextField
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="Your password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <FormError message={error} />

        <Button type="submit" fullWidth disabled={submitting}>
          {submitting ? 'Logging in' : 'Log in'}
        </Button>
      </form>

      <p className="mt-[18px] text-body text-muted">
        No account yet?{' '}
        <Link to="/signup" className="text-accent transition-colors hover:text-text">
          Sign up
        </Link>
      </p>
    </div>
  );
}
