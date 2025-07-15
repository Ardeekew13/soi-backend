"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
const graphql_1 = require("graphql");
function requireAuth(resolver) {
    return (parent, args, context, info) => {
        if (!context.req?.session?.userId) {
            throw new graphql_1.GraphQLError("Authentication required", {
                extensions: { code: "UNAUTHENTICATED" },
            });
        }
        return resolver(parent, args, context, info);
    };
}
