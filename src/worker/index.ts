import { Hono } from "hono";
import { cors } from "hono/cors";
import { sign, verify } from "hono/jwt";

const app = new Hono<{ Bindings: Env }>();

// Enable CORS for API requests
app.use(
	"/api/*",
	cors({
		allowHeaders: ["Content-Type", "Authorization"],
	})
);

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

// JWT configuration
const JWT_EXPIRATION = 60 * 60 * 24 * 7; // 7 days in seconds

// Helper to get JWT secret from environment
function getJwtSecret(c: any): string {
	const secret = c.env?.JWT_SECRET;
	if (!secret) {
		throw new Error("JWT_SECRET environment variable is not configured");
	}
	return secret;
}

// Helper to generate a JWT token
async function generateToken(userId: string, secret: string): Promise<string> {
	const payload = {
		sub: userId,
		exp: Math.floor(Date.now() / 1000) + JWT_EXPIRATION,
		iat: Math.floor(Date.now() / 1000),
	};
	return await sign(payload, secret);
}

// Helper to verify JWT token and extract user ID
async function verifyToken(token: string, secret: string): Promise<string | null> {
	try {
		const payload = await verify(token, secret);
		return payload.sub as string;
	} catch {
		return null;
	}
}

// Test endpoint
app.get("/api/", (c) => c.json({ name: "Cloudflare" }));

// Login endpoint
app.post("/api/auth/login", async (c) => {
	let body: any;

	// Parse and validate request body
	try {
		body = await c.req.json();
	} catch {
		return c.json({ message: "Invalid request body" }, 400);
	}

	// Validate required fields
	const { email, password } = body;
	if (!email || !password || typeof email !== "string" || typeof password !== "string") {
		return c.json({ message: "Email and password are required" }, 400);
	}

	try {
		// Find user
		const user = MOCK_USERS.find(
			(u) => u.email === email && u.password === password
		);

		if (!user) {
			return c.json({ message: "Invalid credentials" }, 401);
		}

		// Get JWT secret and generate token
		const secret = getJwtSecret(c);
		const token = await generateToken(user.id, secret);

		// Return user data (without password) and token
		const { password: _, ...userWithoutPassword } = user;

		return c.json({
			user: userWithoutPassword,
			token,
		});
	} catch (error) {
		// Check if it's a JWT_SECRET configuration error
		if (error instanceof Error && error.message.includes("JWT_SECRET")) {
			return c.json({ message: "Server configuration error" }, 500);
		}
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
		const secret = getJwtSecret(c);
		const userId = await verifyToken(token, secret);

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
