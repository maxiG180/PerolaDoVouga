export function calculateOrderTotals(
    subtotal: number,
    paymentMethod: 'online' | 'pickup'
) {
    const stripeFee = paymentMethod === 'online' ? subtotal * 0.04 : 0;
    const total = subtotal + stripeFee;

    return {
        subtotal: Number(subtotal.toFixed(2)),
        stripeFee: Number(stripeFee.toFixed(2)),
        total: Number(total.toFixed(2)),
    };
}

export function generateOrderNumber(): string {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `PDV-${timestamp}${random}`;
}
