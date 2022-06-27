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
