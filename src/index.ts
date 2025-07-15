import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "@apollo/server-plugin-landing-page-graphql-playground";
import { expressMiddleware } from "@apollo/server/express4";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import "dotenv/config";
import express from "express";
import session from "express-session";
import { readFileSync } from "fs";
import path from "path";
import { resolvers } from "./resolvers";

const prisma = new PrismaClient();
const typeDefs = readFileSync(path.join(__dirname, "schema.graphql"), "utf8");

const app = express();
const server = new ApolloServer({
	typeDefs,
	resolvers,
	plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
});

(async () => {
	await server.start();

	app.use(
		cors({
			origin: ["http://localhost:3000", "https://soi-inventory.vercel.app"],
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

	app.listen(PORT, () => {
		console.log(`🚀 Server ready at http://localhost:${PORT}/`);
	});
})();
