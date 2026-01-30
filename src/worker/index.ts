import { Hono } from "hono";
import { cors } from "hono/cors";
import { sign, verify } from "hono/jwt";

const app = new Hono<{ Bindings: Env }>();

// Enable CORS for API requests with origin validation
app.use(
	"/api/*",
	cors({
		origin: (origin: string, c) => {
			// Get allowed origins from environment or use default for development
			const allowedOriginsStr = c.env?.ALLOWED_ORIGINS || "http://localhost:5173,http://localhost:4173";
			const allowedOrigins = allowedOriginsStr.split(",").map((o: string) => o.trim());

			// Check if the origin is in the allowlist
			if (allowedOrigins.includes(origin)) {
				return origin;
			}

			// Reject unauthorized origins by returning first allowed origin
			return allowedOrigins[0];
		},
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
function getJwtSecret(c: { env?: { JWT_SECRET?: string } }): string {
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
	let body: { email?: unknown; password?: unknown };

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
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password: _password, ...userWithoutPassword } = user;

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

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password: _password, ...userWithoutPassword } = user;

		return c.json(userWithoutPassword);
	} catch {
		return c.json({ message: "Failed to fetch profile" }, 500);
	}
});

// Logout endpoint
app.post("/api/auth/logout", async (c) => {
	// SECURITY LIMITATION: JWT tokens remain valid until expiration (7 days)
	// even after logout. The client removes the token from localStorage,
	// but the token itself is not invalidated server-side.
	//
	// For production, implement one of these solutions:
	// 1. Token Blacklist with KV: Store logged-out tokens in Cloudflare KV
	//    and check against blacklist in verifyToken()
	// 2. Shorter Expiration: Reduce JWT_EXPIRATION to 1-2 hours and
	//    implement refresh tokens with longer expiration
	// 3. Token Versioning: Add version field to user records, increment
	//    on logout, and verify version matches in verifyToken()
	//
	// Current behavior: Client-side logout only (removes token from browser)
	return c.json({ message: "Logged out successfully" });
});

export default app;
