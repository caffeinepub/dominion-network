import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useNavigate } from '@tanstack/react-router';
import { useRequestMemberRegistration } from '../hooks/useQueries';

export function SignUpPage() {
  const navigate = useNavigate();
  const requestRegistration = useRequestMemberRegistration();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (!formData.acceptTerms) {
      alert('Please accept the terms and conditions');
      return;
    }

    try {
      await requestRegistration.mutateAsync({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-background to-primary/5 p-4">
        <Card className="w-full max-w-md border-primary/20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl gradient-text">Registration Submitted</CardTitle>
            <CardDescription>Your account is pending approval</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Thank you for registering! Your account request has been submitted and is pending admin approval.
              You will be notified once your account is approved.
            </p>
            <Button onClick={() => navigate({ to: '/' })} className="w-full">
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-background to-primary/5 p-4">
      <Card className="w-full max-w-md border-primary/20 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-4 mb-2">
            <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/' })}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <CardTitle className="text-2xl gradient-text">Sign Up</CardTitle>
          </div>
          <CardDescription>Create a new account to access the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={formData.acceptTerms}
                onCheckedChange={(checked) => setFormData({ ...formData, acceptTerms: checked as boolean })}
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I accept the{' '}
                <button
                  type="button"
                  onClick={() => navigate({ to: '/terms' })}
                  className="text-primary hover:underline"
                >
                  terms and conditions
                </button>
              </label>
            </div>

            <Button type="submit" className="w-full" disabled={requestRegistration.isPending}>
              {requestRegistration.isPending ? 'Submitting...' : 'Sign Up'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
