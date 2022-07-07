export interface ProductProps {
	id: string;
	name: string;
	photoUrl: string;
	price: number;
	itbis: boolean;
	barcodes: BarcodeProps[];
}

export interface BarcodeProps {
	id: string;
	barcode: string;
}

export interface ClientProps {
	id: string;
	name: string;
	dui: string;
	photoUrl: string;
	email: string;
	phone: string;
	address: string;
	hasCredit: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface TicketSummaryProps {
	id: string;
	total: number;
	discount: number;
	payments: {
		amount: number;
		type: string;
	}[];
	change: number;
	cashReceived: number;
}

export interface TicketProps {
	id: string;
	ticketNumber: string;
	businessId: string;
	clientId: string;
	client: ClientProps;
	products: TicketProductProps[];
	sellerId: string;
	deviceId: string;
	amount: number;
	discount: number;
	shiftId: string;
	orderType: 'DELIVERY' | 'PICKUP';
	paymentTypeId: string;
	paymentType: string;
	shippingAddress?: string;
	status: 'DONE' | 'CANCELLED';
	createdAt: string;
	updatedAt: string;
}

export interface TicketProductProps {
	id: string;
	ticketId: string;
	productId: string;
	product: ProductProps;
	quantity: number;
	price: number;
	cost: number;
}
