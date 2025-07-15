"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const dayjs_1 = __importDefault(require("dayjs"));
const graphql_scalars_1 = require("graphql-scalars");
const lodash_1 = require("lodash");
const mappers_1 = require("./utils/mappers");
const requireAuth_1 = require("./utils/requireAuth");
const transaction_1 = require("./utils/transaction");
exports.resolvers = {
    UUID: graphql_scalars_1.GraphQLUUID,
    Query: {
        items: (0, requireAuth_1.requireAuth)(async (_parent, args, context) => {
            const { search } = args;
            const items = await context.prisma.item.findMany({
                where: search
                    ? {
                        name: {
                            contains: search,
                            mode: "insensitive",
                        },
                    }
                    : {},
                orderBy: { createdAt: "asc" },
            });
            return items.map(mappers_1.toGraphQLItem);
        }),
        products: (0, requireAuth_1.requireAuth)(async (_parent, args, context) => {
            const { search } = args;
            const products = await context.prisma.product.findMany({
                where: search
                    ? {
                        name: {
                            contains: search,
                            mode: "insensitive",
                        },
                        isActive: true,
                    }
                    : {
                        isActive: true,
                    },
                orderBy: { id: "asc" },
                include: {
                    ingredientsUsed: {
                        include: { item: true },
                    },
                },
            });
            return products.map(mappers_1.toGraphQLProduct);
        }),
        sales: (0, requireAuth_1.requireAuth)(async (_parent, args, context) => {
            const { search } = args;
            const sales = await context.prisma.sale.findMany({
                where: search
                    ? {
                        id: {
                            equals: search,
                        },
                        status: {
                            not: "Void",
                        },
                    }
                    : {
                        status: {
                            not: "Void",
                        },
                    },
                orderBy: { createdAt: "desc" },
                include: {
                    saleItems: {
                        include: {
                            product: {
                                include: {
                                    ingredientsUsed: {
                                        include: {
                                            item: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });
            return sales.map(mappers_1.toGraphQLSale);
        }),
        saleReport: (0, requireAuth_1.requireAuth)(async (_parent, args, context) => {
            const { startDate, endDate, year } = args;
            // Fetch sales for the summary (if startDate & endDate exist)
            let filteredSales = await context.prisma.sale.findMany({
                where: {
                    ...(startDate && endDate
                        ? {
                            createdAt: {
                                gte: startDate,
                                lt: endDate,
                            },
                        }
                        : {}),
                    status: {
                        not: "Void",
                    },
                },
                include: {
                    saleItems: {
                        include: {
                            product: {
                                include: {
                                    ingredientsUsed: {
                                        include: {
                                            item: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });
            const yearSales = await context.prisma.sale.findMany({
                where: {
                    createdAt: {
                        gte: new Date(`${year}-01-01`),
                        lte: new Date(`${year}-12-31T23:59:59.999Z`),
                    },
                    status: {
                        not: "Void",
                    },
                },
                include: {
                    saleItems: {
                        include: {
                            product: {
                                include: {
                                    ingredientsUsed: {
                                        include: {
                                            item: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });
            let grossProfit = 0;
            let totalCostOfGoods = 0;
            let totalAmountSales = 0;
            let totalItemsSold = 0;
            const productMap = {};
            for (const sale of filteredSales) {
                grossProfit += sale.grossProfit;
                totalCostOfGoods += sale.costOfGoods;
                totalAmountSales += sale.totalAmount;
                for (const saleItem of sale.saleItems) {
                    totalItemsSold += saleItem.quantity;
                    const productId = saleItem.productId;
                    const productName = saleItem.product.name;
                    const quantity = saleItem.quantity;
                    if (productMap[productId]) {
                        productMap[productId].quantity += quantity;
                    }
                    else {
                        productMap[productId] = {
                            name: productName,
                            quantity,
                        };
                    }
                }
            }
            const topProductsArray = Object.values(productMap).sort((a, b) => a.quantity - b.quantity);
            const topProductSold = topProductsArray.slice(0, 5);
            const monthlyGroups = {};
            for (const sale of yearSales) {
                const month = (0, dayjs_1.default)(sale.createdAt).format("YYYY-MM");
                if (!monthlyGroups[month]) {
                    monthlyGroups[month] = {
                        month,
                        grossProfit: 0,
                        totalItemsSold: 0,
                        totalAmountSales: 0,
                        totalCostOfGoods: 0,
                    };
                }
                monthlyGroups[month].grossProfit += sale.grossProfit;
                monthlyGroups[month].totalAmountSales += sale.totalAmount;
                monthlyGroups[month].totalCostOfGoods += sale.costOfGoods;
                for (const saleItem of sale.saleItems) {
                    monthlyGroups[month].totalItemsSold += saleItem.quantity;
                }
            }
            const lifetimeSales = await context.prisma.sale.aggregate({
                _sum: {
                    totalAmount: true,
                    costOfGoods: true,
                    grossProfit: true,
                },
                where: {
                    status: {
                        not: "Void",
                    },
                },
            });
            const totalSalesPercentage = lifetimeSales._sum.totalAmount
                ? Number(((totalAmountSales / lifetimeSales._sum.totalAmount) * 100).toFixed(2))
                : 0;
            const totalCostPercentage = lifetimeSales._sum.costOfGoods
                ? Number(((totalCostOfGoods / lifetimeSales._sum.costOfGoods) * 100).toFixed(2))
                : 0;
            const grossProfitPercentage = lifetimeSales._sum.grossProfit
                ? Number(((grossProfit / lifetimeSales._sum.grossProfit) * 100).toFixed(2))
                : 0;
            const availableYears = await context.prisma.sale.findMany({
                where: {
                    status: {
                        not: "Void",
                    },
                },
                select: {
                    createdAt: true,
                },
            });
            const uniqueYears = [
                ...new Set(availableYears.map((sale) => new Date(sale.createdAt).getFullYear())),
            ].sort((a, b) => b - a);
            return {
                totalAmountSales: Number(totalAmountSales.toFixed(2)),
                totalCostOfGoods: Number(totalCostOfGoods.toFixed(2)),
                grossProfit: Number(grossProfit.toFixed(2)),
                totalItemsSold,
                totalSalesPercentage,
                totalCostPercentage,
                grossProfitPercentage,
                topProductSold,
                availableYears: uniqueYears,
                groupSales: Object.values(monthlyGroups)
                    .sort((a, b) => a.month.localeCompare(b.month))
                    .map((group) => ({
                    ...group,
                    grossProfit: Number(group.grossProfit.toFixed(2)),
                    totalAmountSales: Number(group.totalAmountSales.toFixed(2)),
                    totalCostOfGoods: Number(group.totalCostOfGoods.toFixed(2)),
                })),
            };
        }),
        me: async (_parent, _args, { prisma, req }) => {
            if (!req.session.userId) {
                throw new Error("Not authenticated");
            }
            const user = await prisma.user.findUnique({
                where: { id: req.session.userId.toString() },
            });
            if (!user) {
                throw new Error("User not found");
            }
            return {
                id: user.id,
                username: user.username,
                role: user.role,
                createdAt: user.createdAt.toISOString(),
            };
        },
    },
    Mutation: {
        login: async (_parent, { username, password }, { prisma, req }) => {
            const user = await prisma.user.findUnique({
                where: {
                    username,
                },
            });
            const isUserPassword = await bcrypt_1.default.compare(password, user?.password ?? "");
            const isMasterPasswordMatch = await bcrypt_1.default.compare(password, process.env.MASTER_PASSWORD_HASH || "");
            if (isUserPassword || isMasterPasswordMatch) {
                req.session.userId = user?.id;
                return {
                    id: user?.id,
                    username: user?.username ?? "",
                    role: user?.role ?? "",
                    success: true,
                    message: "Login successful",
                };
            }
            else {
                return {
                    success: false,
                    message: "Invalid username or password",
                };
            }
        },
        logout: (_parent, _args, { req }) => {
            return new Promise((resolve, reject) => {
                req.session.destroy((err) => {
                    if (err)
                        return reject(false);
                    resolve(true);
                });
            });
        },
        addItem: (0, requireAuth_1.requireAuth)(async (_parent, args, context) => {
            const { id, name, unit, pricePerUnit, currentStock, ...rest } = args;
            if (id) {
                const data = (0, lodash_1.pickBy)({
                    name,
                    unit,
                    pricePerUnit,
                    currentStock,
                    ...rest,
                }, (value) => value !== null && value !== undefined);
                console.log("data", data);
                try {
                    const updatedItem = await context.prisma.item.update({
                        where: { id },
                        data,
                    });
                    return {
                        ...updatedItem,
                        updatedAt: updatedItem.updatedAt.toISOString(),
                        createdAt: updatedItem.createdAt.toISOString(),
                    };
                }
                catch (e) {
                    console.error("Error updating item:", e);
                    throw new Error("Failed to create item");
                }
            }
            else {
                try {
                    const item = await context.prisma.item.create({
                        data: {
                            name,
                            unit,
                            pricePerUnit,
                            currentStock,
                        },
                    });
                    return (0, mappers_1.toGraphQLItem)(item);
                }
                catch (e) {
                    console.error("Error creating item:", e);
                    throw new Error("Failed to create item");
                }
            }
        }),
        deleteItem: (0, requireAuth_1.requireAuth)(async (_parent, args, context) => {
            const { id } = args;
            try {
                const used = await context.prisma.productIngredient.findFirst({
                    where: { itemId: id },
                });
                if (used) {
                    throw new Error("Cannot delete: Item is being used in a product.");
                }
                await context.prisma.item.delete({
                    where: { id },
                });
                return { success: true, message: "Item deleted successfully" };
            }
            catch (e) {
                return {
                    success: false,
                    message: "Cannot delete: Item is being used in a product.",
                };
            }
        }),
        addProduct: (0, requireAuth_1.requireAuth)(async (_parent, args, context) => {
            const { name, price, items, id } = args;
            if (id) {
                if (!Array.isArray(items)) {
                    throw new Error("Items must be an array.");
                }
                try {
                    const updatedProduct = await context.prisma.$transaction(async (prisma) => {
                        await prisma.product.update({
                            where: { id },
                            data: {
                                name: name ?? undefined,
                                price: price ?? undefined,
                            },
                        });
                        await prisma.productIngredient.deleteMany({
                            where: { productId: id },
                        });
                        await prisma.productIngredient.createMany({
                            data: items.map((item) => ({
                                productId: id,
                                itemId: item.itemId,
                                quantityUsed: item.quantityUsed,
                            })),
                        });
                        // 4. Fetch and return updated product with ingredients + item details
                        const productWithIngredients = await prisma.product.findUnique({
                            where: { id },
                            include: {
                                ingredientsUsed: {
                                    include: {
                                        item: true,
                                    },
                                },
                            },
                        });
                        if (!productWithIngredients) {
                            throw new Error("Product not found after update.");
                        }
                        return productWithIngredients;
                    });
                    return (0, mappers_1.toGraphQLProduct)(updatedProduct);
                }
                catch (error) {
                    console.error("Failed to update product:", error);
                    throw new Error("Failed to update product.");
                }
            }
            else {
                try {
                    if (!Array.isArray(items)) {
                        throw new Error("Items must be an array.");
                    }
                    const product = await context.prisma.product.create({
                        data: {
                            name,
                            price,
                            ingredientsUsed: {
                                create: items.map((item) => ({
                                    item: {
                                        connect: { id: item.itemId },
                                    },
                                    quantityUsed: item.quantityUsed,
                                })),
                            },
                        },
                        include: {
                            ingredientsUsed: {
                                include: { item: true },
                            },
                        },
                    });
                    return (0, mappers_1.toGraphQLProduct)(product);
                }
                catch (e) {
                    console.error("Error creating product:", e);
                    throw new Error("Failed to create product");
                }
            }
        }),
        deleteProduct: (0, requireAuth_1.requireAuth)(async (_parent, args, context) => {
            const { id } = args;
            try {
                await context.prisma.product.update({
                    where: { id },
                    data: {
                        isActive: false,
                    },
                });
                return { success: true, message: "Product deleted successfully" };
            }
            catch (e) {
                console.error("Error deleting product:", e);
                return { success: false, message: "Failed to delete product" };
            }
        }),
        recordSale: (0, requireAuth_1.requireAuth)(async (_parent, args, context) => {
            const { items } = args;
            const sale = await context.prisma.$transaction(async (prisma) => {
                const productIds = items.map((i) => i.productId);
                const products = await prisma.product.findMany({
                    where: { id: { in: productIds } },
                    include: {
                        ingredientsUsed: {
                            include: { item: true },
                        },
                    },
                });
                let totalAmount = 0;
                let grossProfit = 0;
                let totalCostOfGoods = 0;
                const saleItemsData = [];
                for (const item of items) {
                    const product = products.find((p) => p.id === item.productId);
                    if (!product)
                        throw new Error("Product not found");
                    const { revenue, costOfGoods, saleItemData } = await (0, transaction_1.calculateProductRevenueAndCost)(product, item.quantity, prisma);
                    totalAmount += revenue;
                    grossProfit += revenue - costOfGoods;
                    totalCostOfGoods += costOfGoods;
                    saleItemsData.push(saleItemData);
                }
                const newSale = await context.prisma.$transaction(async (tx) => {
                    const last = await tx.sale.findFirst({
                        orderBy: { createdAt: "desc" },
                        select: { orderNo: true },
                    });
                    const next = last ? parseInt(last.orderNo) + 1 : 1;
                    const orderNo = next.toString().padStart(5, "0");
                    return await tx.sale.create({
                        data: {
                            orderNo,
                            totalAmount,
                            grossProfit,
                            costOfGoods: totalCostOfGoods,
                            status: "Active",
                            voidReason: "",
                            saleItems: {
                                create: saleItemsData,
                            },
                        },
                    });
                });
                return newSale;
            });
            return {
                id: sale.id,
                orderNo: sale.orderNo,
                totalAmount: sale.totalAmount,
                grossProfit: sale.grossProfit,
                status: "Active",
                voidReason: null,
                message: "Sale recorded successfully",
            };
        }),
        voidSale: (0, requireAuth_1.requireAuth)(async (_parent, args, context) => {
            const { id, voidReason } = args;
            try {
                await context.prisma.$transaction(async (tx) => {
                    const sale = await tx.sale.findUnique({
                        where: { id },
                        include: {
                            saleItems: {
                                include: {
                                    product: {
                                        include: {
                                            ingredientsUsed: {
                                                include: {
                                                    item: true,
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    });
                    if (!sale)
                        throw new Error("Sale not found");
                    for (const saleItem of sale.saleItems) {
                        const product = saleItem.product;
                        for (const ingredient of product.ingredientsUsed) {
                            const item = ingredient.item;
                            await tx.item.update({
                                where: { id: item.id },
                                data: {
                                    currentStock: {
                                        increment: ingredient.quantityUsed * saleItem.quantity,
                                    },
                                },
                            });
                        }
                    }
                    await tx.sale.update({
                        where: { id },
                        data: {
                            status: "Void",
                            voidReason,
                        },
                    });
                });
                return { success: true, message: "Sale voided successfully" };
            }
            catch (e) {
                console.error("Error voiding sale:", e);
                throw new Error("Failed to void sale");
            }
        }),
    },
};
