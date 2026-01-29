// src/react-app/types/auth.ts

export interface User {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
}

export interface AuthState {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
}

export interface LoginCredentials {
	email: string;
	password: string;
}

export interface AuthResponse {
	user: User;
	token: string;
}
