// src/react-app/context/AuthContext.tsx

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, AuthState, LoginCredentials } from '../types/auth';

interface AuthContextType extends AuthState {
	login: (credentials: LoginCredentials) => Promise<void>;
	logout: () => void;
	refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'cc3_auth_token';
const USER_STORAGE_KEY = 'cc3_user';

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	// Initialize auth state from localStorage
	useEffect(() => {
		const initAuth = () => {
			try {
				const token = localStorage.getItem(AUTH_STORAGE_KEY);
				const storedUser = localStorage.getItem(USER_STORAGE_KEY);

				if (token && storedUser) {
					setUser(JSON.parse(storedUser));
				}
			} catch (error) {
				console.error('Failed to initialize auth:', error);
				localStorage.removeItem(AUTH_STORAGE_KEY);
				localStorage.removeItem(USER_STORAGE_KEY);
			} finally {
				setIsLoading(false);
			}
		};

		initAuth();
	}, []);

	const login = async (credentials: LoginCredentials) => {
		setIsLoading(true);
		try {
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(credentials),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message || 'Login failed');
			}

			const data = await response.json();

			// Store token and user data
			localStorage.setItem(AUTH_STORAGE_KEY, data.token);
			localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));

			setUser(data.user);
		} catch (error) {
			console.error('Login error:', error);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	const logout = () => {
		localStorage.removeItem(AUTH_STORAGE_KEY);
		localStorage.removeItem(USER_STORAGE_KEY);
		setUser(null);

		// Redirect to home
		window.location.href = '/';
	};

	const refreshUser = async () => {
		const token = localStorage.getItem(AUTH_STORAGE_KEY);

		if (!token) {
			setUser(null);
			return;
		}

		try {
			const response = await fetch('/api/customer/profile', {
				headers: {
					'Authorization': `Bearer ${token}`,
				},
			});

			if (!response.ok) {
				throw new Error('Failed to fetch user profile');
			}

			const userData = await response.json();
			localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
			setUser(userData);
		} catch (error) {
			console.error('Failed to refresh user:', error);
			logout();
		}
	};

	const value: AuthContextType = {
		user,
		isAuthenticated: !!user,
		isLoading,
		login,
		logout,
		refreshUser,
	};

	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
}
