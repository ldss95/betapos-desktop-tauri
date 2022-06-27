import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

import { ProductProps } from '../../utils/interfaces';
import {
	ADD_PRODUCT,
	REMOVE_PRODUCT,
	INCREASE_QUANTITY,
	DECREASE_QUANTITY,
	SET_QUANTITY,
	SET_PRICE,
	SET_DISCOUNT,
	PAUSE,
	REMOVE_PAUSED_TICKET,
	RESTART_TICKET,
	CLEAR,
	SHOW_QTY_CALCULATOR,
	HIDE_QTY_CALCULATOR,
} from '../actions/cart';

interface StateProps {
	discount: number;
	products: ProductProps[];
	paused: any[],
	qtyCalculator: {
		productId: string | null;
		visible: boolean;
	};
}
const initialState: StateProps = {
	discount: 0,
	products: [],
	paused: [],
	qtyCalculator: {
		productId: null,
		visible: false
	}
};

const cart = (state = initialState, action: any) => {
	switch (action.type) {
		case ADD_PRODUCT:
			const products = state.products;
			const { barcode } = action.payload
			const productAlreadyExists = products.find((product: any) => product.id === action.payload.id);

			if (productAlreadyExists && barcode !== '999') {
				return {
					...state,
					products: products.map((product: any) =>
						product.id === action.payload.id
							? { ...product, quantity: product.quantity + 1 }
							: product
					)
				};
			} else {
				return {
					...state,
					products: [
						{
							...action.payload,
							quantity: 1
						},
						...products
					]
				};
			}
		case REMOVE_PRODUCT:
			return {
				...state,
				products: state.products.filter((product: any, index: number) => index !== action.payload.index)
			};
		case INCREASE_QUANTITY: {
			const product: any = (action.payload.id)
				? state.products.find((product: any) => product.id === action.payload.id)
				: state.products[0]
			
			product.quantity++

			return {
				...state,
				products: state.products.map((item: any) =>
					(item.id === action.payload.id)
						? product
						: item
				)
			};
		}
		case DECREASE_QUANTITY: {
			const product: any = (action.payload.id)
				? state.products.find((product: any) => product.id === action.payload.id)
				: state.products[0]
			
			if(product.quantity > 1) {
				product.quantity--
			}

			return {
				...state,
				products: state.products.map((product: any) =>
					product.id === action.payload.id
						? product
						: product
				)
			};
		}
		case SET_PRICE: {
			return {
				...state,
				products: state.products.map((product: any) =>
					product.id === action.payload.id
						? { ...product, price: action.payload.price }
						: product
				)
			};
		}
		case SET_QUANTITY:
			return {
				...state,
				products: state.products.map((product: any) =>
					product.id === action.payload.id
						? { ...product, quantity: action.payload.quantity }
						: product
				)
			};
		case SET_DISCOUNT:
			return {
				...state,
				discount: action.payload.discount || 0
			};
		case PAUSE:
			const paused = [
				...state.paused,
				{
					id: uuidv4(),
					discount: state.discount,
					products: state.products,
					clientName: action.payload.clientName,
					date: moment(),
					userName: action.payload.userName
				}
			];

			return {
				discount: 0,
				products: [],
				paused
			};
		case REMOVE_PAUSED_TICKET:
			return {
				...state,
				paused: state.paused.filter(
					(ticket: any) => ticket.id !== action.payload.id
				)
			};
		case RESTART_TICKET:
			const ticket: any = {
				...state.paused.find((ticket: any) => ticket.id === action.payload.id)
			};
			delete ticket.id;
			delete ticket.userName;
			delete ticket.clientName;
			delete ticket.date;

			return {
				...ticket,
				paused: state.paused.filter((ticket: any) => ticket.id !== action.payload.id)
			};
		case CLEAR:
			return {
				...initialState,
				paused: state.paused
			};
		case SHOW_QTY_CALCULATOR:
			return {
				...state,
				qtyCalculator: {
					visible: true,
					productId: action.payload.productId
				}
			}
		case HIDE_QTY_CALCULATOR:
			return {
				...state,
				qtyCalculator: {
					visible: false,
					productId: null
				}
			}
		default:
			return state;
	}
};

export default cart;
