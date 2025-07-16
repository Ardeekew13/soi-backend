import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { Session, SessionData } from "express-session";

export interface MyContext {
	prisma: PrismaClient;
	req: Request & { session: Session & Partial<SessionData> };
	res: Response;
}
