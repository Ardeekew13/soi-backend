import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import "express-session";

export interface MyContext {
	prisma: PrismaClient;
	req: Request & { session: any };
	res: Response;
}
