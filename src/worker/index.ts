import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono<{ Bindings: Env }>();

// Enable CORS for API requests
app.use("/api/*", cors());

// Mock user database (in production, use a real database)
const MOCK_USERS = [
	{
		id: "1",
		email: "demo@example.com",
		password: "demo123",
		firstName: "Demo",
		lastName: "User",
	},
];

// Helper to generate a simple token
function generateToken(userId: string): string {
	return `token_${userId}_${Date.now()}`;
}

// Helper to verify token and extract user ID
function verifyToken(token: string): string | null {
	if (!token || !token.startsWith("token_")) {
		return null;
	}
	const parts = token.split("_");
	return parts[1] || null;
}

// Test endpoint
app.get("/api/", (c) => c.json({ name: "Cloudflare" }));

// Login endpoint
app.post("/api/auth/login", async (c) => {
	try {
		const { email, password } = await c.req.json();

		// Find user
		const user = MOCK_USERS.find(
			(u) => u.email === email && u.password === password
		);

		if (!user) {
			return c.json({ message: "Invalid credentials" }, 401);
		}

		// Generate token
		const token = generateToken(user.id);

		// Return user data (without password) and token
		const { password: _, ...userWithoutPassword } = user;

		return c.json({
			user: userWithoutPassword,
			token,
		});
	} catch (error) {
		return c.json({ message: "Login failed" }, 500);
	}
});

// Get customer profile endpoint
app.get("/api/customer/profile", async (c) => {
	try {
		const authHeader = c.req.header("Authorization");

		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return c.json({ message: "Unauthorized" }, 401);
		}

		const token = authHeader.substring(7);
		const userId = verifyToken(token);

		if (!userId) {
			return c.json({ message: "Invalid token" }, 401);
		}

		const user = MOCK_USERS.find((u) => u.id === userId);

		if (!user) {
			return c.json({ message: "User not found" }, 404);
		}

		const { password: _, ...userWithoutPassword } = user;

		return c.json(userWithoutPassword);
	} catch (error) {
		return c.json({ message: "Failed to fetch profile" }, 500);
	}
});

// Logout endpoint (for future use)
app.post("/api/auth/logout", async (c) => {
	// In a real app, you would invalidate the token here
	return c.json({ message: "Logged out successfully" });
});

export default app;
