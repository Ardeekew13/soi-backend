import {
	GraphQLResolveInfo,
	GraphQLScalarType,
	GraphQLScalarTypeConfig,
} from "graphql";
import { MyContext } from "../context";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
	[K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
	[SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
	[SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
	T extends { [key: string]: unknown },
	K extends keyof T
> = { [_ in K]?: never };
export type Incremental<T> =
	| T
	| {
			[P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
	  };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & {
	[P in K]-?: NonNullable<T[P]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
	ID: { input: string; output: string };
	String: { input: string; output: string };
	Boolean: { input: boolean; output: boolean };
	Int: { input: number; output: number };
	Float: { input: number; output: number };
	JSON: { input: any; output: any };
	UUID: { input: any; output: any };
};

export type DeletionResult = {
	__typename?: "DeletionResult";
	message?: Maybe<Scalars["String"]["output"]>;
	success: Scalars["Boolean"]["output"];
};

export type Item = {
	__typename?: "Item";
	createdAt: Scalars["String"]["output"];
	currentStock: Scalars["Float"]["output"];
	id: Scalars["UUID"]["output"];
	name: Scalars["String"]["output"];
	pricePerUnit: Scalars["Float"]["output"];
	unit: Scalars["String"]["output"];
	updatedAt: Scalars["String"]["output"];
};

export type LoginResponse = {
	__typename?: "LoginResponse";
	id?: Maybe<Scalars["UUID"]["output"]>;
	message: Scalars["String"]["output"];
	role?: Maybe<Scalars["String"]["output"]>;
	success: Scalars["Boolean"]["output"];
	username?: Maybe<Scalars["String"]["output"]>;
};

export type MonthlySaleReport = {
	__typename?: "MonthlySaleReport";
	grossProfit?: Maybe<Scalars["Float"]["output"]>;
	month?: Maybe<Scalars["String"]["output"]>;
	totalAmountSales?: Maybe<Scalars["Float"]["output"]>;
	totalCostOfGoods?: Maybe<Scalars["Float"]["output"]>;
	totalItemsSold?: Maybe<Scalars["Float"]["output"]>;
};

export type Mutation = {
	__typename?: "Mutation";
	addItem: Item;
	addProduct: Product;
	deleteItem: DeletionResult;
	deleteProduct: DeletionResult;
	login: LoginResponse;
	logout: Scalars["Boolean"]["output"];
	recordSale: SaleResponse;
	voidSale: DeletionResult;
};

export type MutationAddItemArgs = {
	currentStock: Scalars["Float"]["input"];
	id?: InputMaybe<Scalars["UUID"]["input"]>;
	name: Scalars["String"]["input"];
	pricePerUnit: Scalars["Float"]["input"];
	unit: Scalars["String"]["input"];
};

export type MutationAddProductArgs = {
	id?: InputMaybe<Scalars["UUID"]["input"]>;
	items?: InputMaybe<Array<ProductIngredientInput>>;
	name: Scalars["String"]["input"];
	price: Scalars["Float"]["input"];
};

export type MutationDeleteItemArgs = {
	id: Scalars["UUID"]["input"];
};

export type MutationDeleteProductArgs = {
	id: Scalars["UUID"]["input"];
};

export type MutationLoginArgs = {
	password: Scalars["String"]["input"];
	username: Scalars["String"]["input"];
};

export type MutationRecordSaleArgs = {
	items: Array<SaleItemInput>;
};

export type MutationVoidSaleArgs = {
	id: Scalars["UUID"]["input"];
	voidReason: Scalars["String"]["input"];
};

export type Product = {
	__typename?: "Product";
	availableUnits: Scalars["Int"]["output"];
	createdAt: Scalars["String"]["output"];
	id: Scalars["UUID"]["output"];
	ingredientsUsed: Array<ProductIngredient>;
	name: Scalars["String"]["output"];
	price: Scalars["Float"]["output"];
	updatedAt: Scalars["String"]["output"];
};

export type ProductIngredient = {
	__typename?: "ProductIngredient";
	id: Scalars["UUID"]["output"];
	item: Item;
	itemId: Scalars["UUID"]["output"];
	productId: Scalars["UUID"]["output"];
	quantityUsed: Scalars["Float"]["output"];
};

export type ProductIngredientInput = {
	itemId: Scalars["UUID"]["input"];
	quantityUsed: Scalars["Float"]["input"];
};

export type Query = {
	__typename?: "Query";
	items: Array<Item>;
	me: User;
	products: Array<Product>;
	saleReport?: Maybe<SaleReportGroup>;
	sales: Array<Sale>;
};

export type QueryItemsArgs = {
	search?: InputMaybe<Scalars["String"]["input"]>;
};

export type QueryProductsArgs = {
	search?: InputMaybe<Scalars["String"]["input"]>;
};

export type QuerySaleReportArgs = {
	endDate?: InputMaybe<Scalars["String"]["input"]>;
	startDate?: InputMaybe<Scalars["String"]["input"]>;
	year?: InputMaybe<Scalars["String"]["input"]>;
};

export type QuerySalesArgs = {
	search?: InputMaybe<Scalars["String"]["input"]>;
};

export type Sale = {
	__typename?: "Sale";
	costOfGoods: Scalars["Float"]["output"];
	createdAt: Scalars["String"]["output"];
	grossProfit: Scalars["Float"]["output"];
	id: Scalars["UUID"]["output"];
	orderNo: Scalars["String"]["output"];
	saleItems: Array<SaleItem>;
	status: Scalars["String"]["output"];
	totalAmount: Scalars["Float"]["output"];
	voidReason: Scalars["String"]["output"];
};

export type SaleItem = {
	__typename?: "SaleItem";
	priceAtSale: Scalars["Float"]["output"];
	product: Product;
	productId: Scalars["UUID"]["output"];
	quantity: Scalars["Float"]["output"];
};

export type SaleItemInput = {
	productId: Scalars["UUID"]["input"];
	quantity: Scalars["Float"]["input"];
};

export type SaleReportGroup = {
	__typename?: "SaleReportGroup";
	availableYears: Array<Scalars["Int"]["output"]>;
	grossProfit?: Maybe<Scalars["Float"]["output"]>;
	grossProfitPercentage?: Maybe<Scalars["Float"]["output"]>;
	groupSales: Array<MonthlySaleReport>;
	topProductSold: Array<TopProduct>;
	totalAmountSales?: Maybe<Scalars["Float"]["output"]>;
	totalCostOfGoods?: Maybe<Scalars["Float"]["output"]>;
	totalCostPercentage?: Maybe<Scalars["Float"]["output"]>;
	totalItemsSold?: Maybe<Scalars["Float"]["output"]>;
	totalSalesPercentage?: Maybe<Scalars["Float"]["output"]>;
};

export type SaleResponse = {
	__typename?: "SaleResponse";
	grossProfit: Scalars["Float"]["output"];
	id: Scalars["UUID"]["output"];
	message: Scalars["String"]["output"];
	orderNo: Scalars["String"]["output"];
	totalAmount: Scalars["Float"]["output"];
};

export type TopProduct = {
	__typename?: "TopProduct";
	name: Scalars["String"]["output"];
	quantity: Scalars["Int"]["output"];
};

export type User = {
	__typename?: "User";
	createdAt: Scalars["String"]["output"];
	id: Scalars["UUID"]["output"];
	role: Scalars["String"]["output"];
	username: Scalars["String"]["output"];
};

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
	resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
	| ResolverFn<TResult, TParent, TContext, TArgs>
	| ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
	parent: TParent,
	args: TArgs,
	context: TContext,
	info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
	parent: TParent,
	args: TArgs,
	context: TContext,
	info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
	parent: TParent,
	args: TArgs,
	context: TContext,
	info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
	TResult,
	TKey extends string,
	TParent,
	TContext,
	TArgs
> {
	subscribe: SubscriptionSubscribeFn<
		{ [key in TKey]: TResult },
		TParent,
		TContext,
		TArgs
	>;
	resolve?: SubscriptionResolveFn<
		TResult,
		{ [key in TKey]: TResult },
		TContext,
		TArgs
	>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
	subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
	resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
	TResult,
	TKey extends string,
	TParent,
	TContext,
	TArgs
> =
	| SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
	| SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
	TResult,
	TKey extends string,
	TParent = {},
	TContext = {},
	TArgs = {}
> =
	| ((
			...args: any[]
	  ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
	| SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
	parent: TParent,
	context: TContext,
	info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
	obj: T,
	context: TContext,
	info: GraphQLResolveInfo
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
	TResult = {},
	TParent = {},
	TContext = {},
	TArgs = {}
> = (
	next: NextResolverFn<TResult>,
	parent: TParent,
	args: TArgs,
	context: TContext,
	info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
	Boolean: ResolverTypeWrapper<Scalars["Boolean"]["output"]>;
	DeletionResult: ResolverTypeWrapper<DeletionResult>;
	Float: ResolverTypeWrapper<Scalars["Float"]["output"]>;
	Int: ResolverTypeWrapper<Scalars["Int"]["output"]>;
	Item: ResolverTypeWrapper<Item>;
	JSON: ResolverTypeWrapper<Scalars["JSON"]["output"]>;
	LoginResponse: ResolverTypeWrapper<LoginResponse>;
	MonthlySaleReport: ResolverTypeWrapper<MonthlySaleReport>;
	Mutation: ResolverTypeWrapper<{}>;
	Product: ResolverTypeWrapper<Product>;
	ProductIngredient: ResolverTypeWrapper<ProductIngredient>;
	ProductIngredientInput: ProductIngredientInput;
	Query: ResolverTypeWrapper<{}>;
	Sale: ResolverTypeWrapper<Sale>;
	SaleItem: ResolverTypeWrapper<SaleItem>;
	SaleItemInput: SaleItemInput;
	SaleReportGroup: ResolverTypeWrapper<SaleReportGroup>;
	SaleResponse: ResolverTypeWrapper<SaleResponse>;
	String: ResolverTypeWrapper<Scalars["String"]["output"]>;
	TopProduct: ResolverTypeWrapper<TopProduct>;
	UUID: ResolverTypeWrapper<Scalars["UUID"]["output"]>;
	User: ResolverTypeWrapper<User>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
	Boolean: Scalars["Boolean"]["output"];
	DeletionResult: DeletionResult;
	Float: Scalars["Float"]["output"];
	Int: Scalars["Int"]["output"];
	Item: Item;
	JSON: Scalars["JSON"]["output"];
	LoginResponse: LoginResponse;
	MonthlySaleReport: MonthlySaleReport;
	Mutation: {};
	Product: Product;
	ProductIngredient: ProductIngredient;
	ProductIngredientInput: ProductIngredientInput;
	Query: {};
	Sale: Sale;
	SaleItem: SaleItem;
	SaleItemInput: SaleItemInput;
	SaleReportGroup: SaleReportGroup;
	SaleResponse: SaleResponse;
	String: Scalars["String"]["output"];
	TopProduct: TopProduct;
	UUID: Scalars["UUID"]["output"];
	User: User;
};

export type DeletionResultResolvers<
	ContextType = MyContext,
	ParentType extends ResolversParentTypes["DeletionResult"] = ResolversParentTypes["DeletionResult"]
> = {
	message?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
	success?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
	__isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ItemResolvers<
	ContextType = MyContext,
	ParentType extends ResolversParentTypes["Item"] = ResolversParentTypes["Item"]
> = {
	createdAt?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
	currentStock?: Resolver<ResolversTypes["Float"], ParentType, ContextType>;
	id?: Resolver<ResolversTypes["UUID"], ParentType, ContextType>;
	name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
	pricePerUnit?: Resolver<ResolversTypes["Float"], ParentType, ContextType>;
	unit?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
	updatedAt?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
	__isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface JsonScalarConfig
	extends GraphQLScalarTypeConfig<ResolversTypes["JSON"], any> {
	name: "JSON";
}

export type LoginResponseResolvers<
	ContextType = MyContext,
	ParentType extends ResolversParentTypes["LoginResponse"] = ResolversParentTypes["LoginResponse"]
> = {
	id?: Resolver<Maybe<ResolversTypes["UUID"]>, ParentType, ContextType>;
	message?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
	role?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
	success?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
	username?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
	__isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MonthlySaleReportResolvers<
	ContextType = MyContext,
	ParentType extends ResolversParentTypes["MonthlySaleReport"] = ResolversParentTypes["MonthlySaleReport"]
> = {
	grossProfit?: Resolver<
		Maybe<ResolversTypes["Float"]>,
		ParentType,
		ContextType
	>;
	month?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
	totalAmountSales?: Resolver<
		Maybe<ResolversTypes["Float"]>,
		ParentType,
		ContextType
	>;
	totalCostOfGoods?: Resolver<
		Maybe<ResolversTypes["Float"]>,
		ParentType,
		ContextType
	>;
	totalItemsSold?: Resolver<
		Maybe<ResolversTypes["Float"]>,
		ParentType,
		ContextType
	>;
	__isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<
	ContextType = MyContext,
	ParentType extends ResolversParentTypes["Mutation"] = ResolversParentTypes["Mutation"]
> = {
	addItem?: Resolver<
		ResolversTypes["Item"],
		ParentType,
		ContextType,
		RequireFields<
			MutationAddItemArgs,
			"currentStock" | "name" | "pricePerUnit" | "unit"
		>
	>;
	addProduct?: Resolver<
		ResolversTypes["Product"],
		ParentType,
		ContextType,
		RequireFields<MutationAddProductArgs, "name" | "price">
	>;
	deleteItem?: Resolver<
		ResolversTypes["DeletionResult"],
		ParentType,
		ContextType,
		RequireFields<MutationDeleteItemArgs, "id">
	>;
	deleteProduct?: Resolver<
		ResolversTypes["DeletionResult"],
		ParentType,
		ContextType,
		RequireFields<MutationDeleteProductArgs, "id">
	>;
	login?: Resolver<
		ResolversTypes["LoginResponse"],
		ParentType,
		ContextType,
		RequireFields<MutationLoginArgs, "password" | "username">
	>;
	logout?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
	recordSale?: Resolver<
		ResolversTypes["SaleResponse"],
		ParentType,
		ContextType,
		RequireFields<MutationRecordSaleArgs, "items">
	>;
	voidSale?: Resolver<
		ResolversTypes["DeletionResult"],
		ParentType,
		ContextType,
		RequireFields<MutationVoidSaleArgs, "id" | "voidReason">
	>;
};

export type ProductResolvers<
	ContextType = MyContext,
	ParentType extends ResolversParentTypes["Product"] = ResolversParentTypes["Product"]
> = {
	availableUnits?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
	createdAt?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
	id?: Resolver<ResolversTypes["UUID"], ParentType, ContextType>;
	ingredientsUsed?: Resolver<
		Array<ResolversTypes["ProductIngredient"]>,
		ParentType,
		ContextType
	>;
	name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
	price?: Resolver<ResolversTypes["Float"], ParentType, ContextType>;
	updatedAt?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
	__isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProductIngredientResolvers<
	ContextType = MyContext,
	ParentType extends ResolversParentTypes["ProductIngredient"] = ResolversParentTypes["ProductIngredient"]
> = {
	id?: Resolver<ResolversTypes["UUID"], ParentType, ContextType>;
	item?: Resolver<ResolversTypes["Item"], ParentType, ContextType>;
	itemId?: Resolver<ResolversTypes["UUID"], ParentType, ContextType>;
	productId?: Resolver<ResolversTypes["UUID"], ParentType, ContextType>;
	quantityUsed?: Resolver<ResolversTypes["Float"], ParentType, ContextType>;
	__isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<
	ContextType = MyContext,
	ParentType extends ResolversParentTypes["Query"] = ResolversParentTypes["Query"]
> = {
	items?: Resolver<
		Array<ResolversTypes["Item"]>,
		ParentType,
		ContextType,
		Partial<QueryItemsArgs>
	>;
	me?: Resolver<ResolversTypes["User"], ParentType, ContextType>;
	products?: Resolver<
		Array<ResolversTypes["Product"]>,
		ParentType,
		ContextType,
		Partial<QueryProductsArgs>
	>;
	saleReport?: Resolver<
		Maybe<ResolversTypes["SaleReportGroup"]>,
		ParentType,
		ContextType,
		Partial<QuerySaleReportArgs>
	>;
	sales?: Resolver<
		Array<ResolversTypes["Sale"]>,
		ParentType,
		ContextType,
		Partial<QuerySalesArgs>
	>;
};

export type SaleResolvers<
	ContextType = MyContext,
	ParentType extends ResolversParentTypes["Sale"] = ResolversParentTypes["Sale"]
> = {
	costOfGoods?: Resolver<ResolversTypes["Float"], ParentType, ContextType>;
	createdAt?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
	grossProfit?: Resolver<ResolversTypes["Float"], ParentType, ContextType>;
	id?: Resolver<ResolversTypes["UUID"], ParentType, ContextType>;
	orderNo?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
	saleItems?: Resolver<
		Array<ResolversTypes["SaleItem"]>,
		ParentType,
		ContextType
	>;
	status?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
	totalAmount?: Resolver<ResolversTypes["Float"], ParentType, ContextType>;
	voidReason?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
	__isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SaleItemResolvers<
	ContextType = MyContext,
	ParentType extends ResolversParentTypes["SaleItem"] = ResolversParentTypes["SaleItem"]
> = {
	priceAtSale?: Resolver<ResolversTypes["Float"], ParentType, ContextType>;
	product?: Resolver<ResolversTypes["Product"], ParentType, ContextType>;
	productId?: Resolver<ResolversTypes["UUID"], ParentType, ContextType>;
	quantity?: Resolver<ResolversTypes["Float"], ParentType, ContextType>;
	__isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SaleReportGroupResolvers<
	ContextType = MyContext,
	ParentType extends ResolversParentTypes["SaleReportGroup"] = ResolversParentTypes["SaleReportGroup"]
> = {
	availableYears?: Resolver<
		Array<ResolversTypes["Int"]>,
		ParentType,
		ContextType
	>;
	grossProfit?: Resolver<
		Maybe<ResolversTypes["Float"]>,
		ParentType,
		ContextType
	>;
	grossProfitPercentage?: Resolver<
		Maybe<ResolversTypes["Float"]>,
		ParentType,
		ContextType
	>;
	groupSales?: Resolver<
		Array<ResolversTypes["MonthlySaleReport"]>,
		ParentType,
		ContextType
	>;
	topProductSold?: Resolver<
		Array<ResolversTypes["TopProduct"]>,
		ParentType,
		ContextType
	>;
	totalAmountSales?: Resolver<
		Maybe<ResolversTypes["Float"]>,
		ParentType,
		ContextType
	>;
	totalCostOfGoods?: Resolver<
		Maybe<ResolversTypes["Float"]>,
		ParentType,
		ContextType
	>;
	totalCostPercentage?: Resolver<
		Maybe<ResolversTypes["Float"]>,
		ParentType,
		ContextType
	>;
	totalItemsSold?: Resolver<
		Maybe<ResolversTypes["Float"]>,
		ParentType,
		ContextType
	>;
	totalSalesPercentage?: Resolver<
		Maybe<ResolversTypes["Float"]>,
		ParentType,
		ContextType
	>;
	__isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SaleResponseResolvers<
	ContextType = MyContext,
	ParentType extends ResolversParentTypes["SaleResponse"] = ResolversParentTypes["SaleResponse"]
> = {
	grossProfit?: Resolver<ResolversTypes["Float"], ParentType, ContextType>;
	id?: Resolver<ResolversTypes["UUID"], ParentType, ContextType>;
	message?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
	orderNo?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
	totalAmount?: Resolver<ResolversTypes["Float"], ParentType, ContextType>;
	__isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TopProductResolvers<
	ContextType = MyContext,
	ParentType extends ResolversParentTypes["TopProduct"] = ResolversParentTypes["TopProduct"]
> = {
	name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
	quantity?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
	__isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface UuidScalarConfig
	extends GraphQLScalarTypeConfig<ResolversTypes["UUID"], any> {
	name: "UUID";
}

export type UserResolvers<
	ContextType = MyContext,
	ParentType extends ResolversParentTypes["User"] = ResolversParentTypes["User"]
> = {
	createdAt?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
	id?: Resolver<ResolversTypes["UUID"], ParentType, ContextType>;
	role?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
	username?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
	__isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = MyContext> = {
	DeletionResult?: DeletionResultResolvers<ContextType>;
	Item?: ItemResolvers<ContextType>;
	JSON?: GraphQLScalarType;
	LoginResponse?: LoginResponseResolvers<ContextType>;
	MonthlySaleReport?: MonthlySaleReportResolvers<ContextType>;
	Mutation?: MutationResolvers<ContextType>;
	Product?: ProductResolvers<ContextType>;
	ProductIngredient?: ProductIngredientResolvers<ContextType>;
	Query?: QueryResolvers<ContextType>;
	Sale?: SaleResolvers<ContextType>;
	SaleItem?: SaleItemResolvers<ContextType>;
	SaleReportGroup?: SaleReportGroupResolvers<ContextType>;
	SaleResponse?: SaleResponseResolvers<ContextType>;
	TopProduct?: TopProductResolvers<ContextType>;
	UUID?: GraphQLScalarType;
	User?: UserResolvers<ContextType>;
};
