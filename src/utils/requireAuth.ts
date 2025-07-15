import { GraphQLError } from "graphql";
import { MyContext } from "../context";

export function requireAuth<TArgs = any, TReturn = any>(
	resolver: (parent: any, args: TArgs, context: MyContext, info: any) => TReturn
): (parent: any, args: TArgs, context: MyContext, info: any) => TReturn {
	return (parent, args, context, info) => {
		if (!context.req?.session?.userId) {
			throw new GraphQLError("Authentication required", {
				extensions: { code: "UNAUTHENTICATED" },
			});
		}
		return resolver(parent, args, context, info);
	};
}
