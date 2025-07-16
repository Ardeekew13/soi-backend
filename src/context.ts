import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import session from "express-session";

export interface MyContext {
	prisma: PrismaClient;
	req: Request & { session: session.Session & Partial<session.SessionData> };
	res: Response;
}
