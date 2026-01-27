// src/react-app/routes/login.tsx

import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, type FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';

export const Route = createFileRoute('/login')({
	component: LoginPage,
});

function LoginPage() {
	const { login, isAuthenticated } = useAuth();
	const navigate = useNavigate();
	const [email, setEmail] = useState('demo@example.com');
	const [password, setPassword] = useState('demo123');
	const [error, setError] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Redirect if already authenticated
	if (isAuthenticated) {
		navigate({ to: '/account/profile' });
		return null;
	}

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError('');
		setIsSubmitting(true);

		try {
			await login({ email, password });
			// Navigate to account after successful login
			navigate({ to: '/account/profile' });
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Login failed');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="max-w-md mx-auto px-4 py-12">
			<div className="bg-white p-8 rounded-lg shadow-md">
				<h1 className="text-3xl font-bold text-gray-900 mb-6">Login</h1>

				{error && (
					<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
						{error}
					</div>
				)}

				<div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-4 text-sm">
					<p className="font-semibold">Demo Credentials:</p>
					<p>Email: demo@example.com</p>
					<p>Password: demo123</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
							Email
						</label>
						<input
							type="email"
							id="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					<div>
						<label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
							Password
						</label>
						<input
							type="password"
							id="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					<button
						type="submit"
						disabled={isSubmitting}
						className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
					>
						{isSubmitting ? 'Logging in...' : 'Login'}
					</button>
				</form>
			</div>
		</div>
	);
}
