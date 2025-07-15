"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateProductRevenueAndCost = calculateProductRevenueAndCost;
async function calculateProductRevenueAndCost(product, quantity, prisma) {
    const revenue = product.price * quantity;
    let costOfGoods = 0;
    for (const ing of product.ingredientsUsed) {
        const totalUsed = ing.quantityUsed * quantity;
        const cost = totalUsed * ing.item.pricePerUnit;
        costOfGoods += cost;
        if (totalUsed > ing.item.currentStock) {
            throw new Error(`Not enough stock for ${ing.item.name}. Required: ${totalUsed}, Available: ${ing.item.currentStock}`);
        }
        await prisma.item.update({
            where: { id: ing.itemId },
            data: {
                currentStock: { decrement: totalUsed },
            },
        });
    }
    return {
        revenue,
        costOfGoods,
        saleItemData: {
            productId: product.id,
            quantity,
            priceAtSale: product.price,
        },
    };
}
