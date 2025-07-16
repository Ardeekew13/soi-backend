import "express-session";

declare module "express-session" {
	interface SessionData {
		userId?: string;
		role?: string;
	}
}

declare module "express-serve-static-core" {
	import session from "express-session";

	interface Request {
		session: session.Session & Partial<session.SessionData>;
	}
}
