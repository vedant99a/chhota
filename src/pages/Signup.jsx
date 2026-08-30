import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import FormError from '../components/FormError';
import RolePicker from '../components/RolePicker';
import TextField from '../components/TextField';
import { useAuth } from '../contexts/AuthContext';
import { authErrorMessage } from '../lib/authErrors';
import { signUp } from '../services/authService';

export default function Signup() {
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (!name.trim()) return setError('Enter your name.');
    if (password.length < 6) return setError('Password is too short. Use at least 6 characters.');

    setSubmitting(true);
    try {
      await signUp({ name: name.trim(), email: email.trim(), password, role });
      // The user document exists now, so pull it in before navigating —
      // "/" reads the role to decide where to send this person.
      await refreshProfile();
      navigate('/', { replace: true });
    } catch (caught) {
      setError(authErrorMessage(caught));
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-content flex-col justify-center px-4 py-[22px]">
      <span className="text-heading font-medium">Chhota</span>
      <p className="mt-1 text-body text-muted">Order ahead, skip the queue.</p>

      <form onSubmit={handleSubmit} className="mt-[22px] flex flex-col gap-[18px]">
        <TextField
          id="name"
          label="Name"
          type="text"
          autoComplete="name"
          placeholder="Your name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
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
          autoComplete="new-password"
          placeholder="At least 6 characters"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <RolePicker value={role} onChange={setRole} />

        <FormError message={error} />

        <Button type="submit" fullWidth disabled={submitting}>
          {submitting ? 'Creating account' : 'Create account'}
        </Button>
      </form>

      <p className="mt-[18px] text-body text-muted">
        Already have an account?{' '}
        <Link to="/login" className="text-accent transition-colors hover:text-text">
          Log in
        </Link>
      </p>
    </div>
  );
}
