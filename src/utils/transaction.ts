import { Item, Prisma, Product, ProductIngredient } from "@prisma/client";

export async function calculateProductRevenueAndCost(
	product: Product & {
		ingredientsUsed: (ProductIngredient & { item: Item })[];
	},
	quantity: number,
	prisma: Prisma.TransactionClient
): Promise<{
	revenue: number;
	costOfGoods: number;
	saleItemData: {
		productId: string;
		quantity: number;
		priceAtSale: number;
	};
}> {
	const revenue = product.price * quantity;
	let costOfGoods = 0;

	for (const ing of product.ingredientsUsed) {
		const totalUsed = ing.quantityUsed * quantity;
		const cost = totalUsed * ing.item.pricePerUnit;
		costOfGoods += cost;
		if (totalUsed > ing.item.currentStock) {
			throw new Error(
				`Not enough stock for ${ing.item.name}. Required: ${totalUsed}, Available: ${ing.item.currentStock}`
			);
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
