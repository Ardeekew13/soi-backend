"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toGraphQLSale = exports.toGraphQLProduct = exports.toGraphQLItem = void 0;
const toGraphQLItem = (item) => ({
    ...item,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
});
exports.toGraphQLItem = toGraphQLItem;
const toGraphQLProduct = (product) => {
    const availableUnits = product.ingredientsUsed.length > 0
        ? Math.floor(Math.min(...product.ingredientsUsed.map((ingredient) => {
            const stock = ingredient.item.currentStock ?? 0;
            const requiredQty = ingredient.quantityUsed ?? 1;
            return stock / requiredQty;
        })))
        : 0;
    return {
        id: product.id,
        name: product.name,
        price: product.price,
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
        availableUnits: isFinite(availableUnits) ? availableUnits : 0,
        ingredientsUsed: product.ingredientsUsed.map((usage) => ({
            id: usage.id,
            productId: usage.productId,
            itemId: usage.itemId,
            quantityUsed: usage.quantityUsed,
            item: {
                id: usage.item.id,
                name: usage.item.name,
                unit: usage.item.unit,
                pricePerUnit: usage.item.pricePerUnit,
                currentStock: usage.item.currentStock,
                createdAt: usage.item.createdAt.toISOString(),
                updatedAt: usage.item.updatedAt.toISOString(),
            },
        })),
    };
};
exports.toGraphQLProduct = toGraphQLProduct;
const toGraphQLSale = (sale) => ({
    id: sale?.id,
    status: sale?.status,
    voidReason: sale?.voidReason,
    totalAmount: sale?.totalAmount,
    createdAt: sale?.createdAt?.toISOString(),
    grossProfit: sale?.grossProfit,
    costOfGoods: sale?.costOfGoods,
    orderNo: sale?.orderNo,
    saleItems: sale?.saleItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        priceAtSale: item.priceAtSale,
        product: {
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            createdAt: item.product.createdAt.toISOString(),
            updatedAt: item.product.updatedAt.toISOString(),
            availableUnits: (() => {
                const units = item.product.ingredientsUsed.length > 0
                    ? Math.floor(Math.min(...item.product.ingredientsUsed.map((ing) => {
                        const stock = ing.item.currentStock ?? 0;
                        const requiredQty = ing.quantityUsed ?? 1;
                        return stock / requiredQty;
                    })))
                    : 0;
                return isFinite(units) ? units : 0;
            })(),
            ingredientsUsed: item.product.ingredientsUsed.map((ing) => ({
                id: ing.id,
                productId: ing.productId,
                itemId: ing.itemId,
                quantityUsed: ing.quantityUsed,
                item: {
                    id: ing.item.id,
                    name: ing.item.name,
                    unit: ing.item.unit,
                    pricePerUnit: ing.item.pricePerUnit,
                    currentStock: ing.item.currentStock,
                    createdAt: ing.item.createdAt.toISOString(),
                    updatedAt: ing.item.updatedAt.toISOString(),
                },
            })),
        },
    })),
});
exports.toGraphQLSale = toGraphQLSale;
