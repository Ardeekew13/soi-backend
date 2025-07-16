"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const client_1 = require("@prisma/client");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const resolvers_1 = require("./resolvers");
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
const typeDefs = (0, fs_1.readFileSync)(path_1.default.join(__dirname, "schema.graphql"), "utf8");
const app = (0, express_1.default)();
const server = new server_1.ApolloServer({
    typeDefs,
    resolvers: resolvers_1.resolvers,
    introspection: true,
});
(async () => {
    await server.start();
    app.use((0, cors_1.default)({
        origin: [
            "http://localhost:3000",
            "https://soi-inventory.vercel.app",
            "https://studio.apollographql.com",
        ],
        credentials: true,
    }));
    app.set("trust proxy", 1);
    app.use((0, express_session_1.default)({
        name: "sid",
        secret: process.env.SESSION_SECRET || "your_super_secret", // Use env var in production
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 1000 * 60 * 60 * 24, // 1 day
        },
    }));
    app.use(express_1.default.json());
    app.use("/graphql", express_1.default.json(), (0, express4_1.expressMiddleware)(server, {
        context: async ({ req, res }) => {
            return {
                req,
                res,
                session: req.session,
                prisma,
            };
        },
    }));
    const PORT = process.env.PORT || 4000;
    app.get("/health", (_req, res) => {
        res.send("OK");
    });
    app.listen(PORT, () => {
        console.log(`🚀 Server ready at http://localhost:${PORT}/`);
    });
})();
