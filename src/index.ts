import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import dotenv from "dotenv";
import "dotenv/config";
import express from "express";
import session from "express-session";
import { readFileSync } from "fs";
import path from "path";
import { resolvers } from "./resolvers";
dotenv.config();

const prisma = new PrismaClient();
const typeDefs = readFileSync(path.join(__dirname, "schema.graphql"), "utf8");

const app = express();
const server = new ApolloServer({
	typeDefs,
	resolvers,
	introspection: true,
});

(async () => {
	await server.start();

	app.use(
		cors({
			origin: [
				"http://localhost:3000",
				"https://soi-inventory.vercel.app",
				"https://studio.apollographql.com",
			],
			credentials: true,
		})
	);

	app.use(
		session({
			name: "sid",
			secret: "your_super_secret", // Use env var in production
			resave: false,
			saveUninitialized: false,
			cookie: {
				httpOnly: true,
				// secure: process.env.NODE_ENV === "production" do this when production,
				secure: false,
				sameSite: "lax",
				maxAge: 1000 * 60 * 60 * 24, // 1 day
			},
		})
	);

	app.use(express.json());

	app.use(
		"/graphql",
		express.json(),
		expressMiddleware(server, {
			context: async ({ req, res }) => {
				return {
					req,
					res,
					session: req.session,
					prisma,
				};
			},
		})
	);

	const PORT = process.env.PORT || 4000;
	app.get("/health", (_req, res) => {
		res.send("OK");
	});
	app.listen(PORT, () => {
		console.log(`🚀 Server ready at http://localhost:${PORT}/`);
	});
})();
