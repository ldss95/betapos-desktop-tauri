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