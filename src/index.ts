import { PrismaClient } from "@prisma/client";
import { ApolloServer } from "apollo-server";
import { readFileSync } from "fs";
import path from "path";
import { resolvers } from "./resolvers";

const prisma = new PrismaClient();
const typeDefs = readFileSync(path.join(__dirname, "schema.graphql"), "utf8");

const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: () => ({ prisma }),
});

server.listen().then(({ url }) => {
	console.log(`🚀 Server ready at ${url}`);
});
