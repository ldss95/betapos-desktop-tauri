const ADD_PRODUCT = 'ADD_PRODUCT';
const REMOVE_PRODUCT = 'REMOVE_PRODUCT';
const REMOVE_PAUSED_TICKET = 'REMOVE_PAUSED_TICKET';
const INCREASE_QUANTITY = 'INCREASE_QUANTITY';
const DECREASE_QUANTITY = 'DECREASE_QUANTITY';
const SET_QUANTITY = 'SET_QUANTITY';
const SET_PRICE = 'SET_PRICE';
const SET_DISCOUNT = 'SET_DISCOUNT';
const PAUSE = 'PAUSE';
const RESTART_TICKET = 'RESTART_TICKET';
const FINISH_TICKET = 'FINISH_TICKET';
const CLEAR = 'CLEAR';
const SHOW_QTY_CALCULATOR = 'SHOW_QTY_CALCULATOR';
const HIDE_QTY_CALCULATOR = 'HIDE_QTY_CALCULATOR';

const addProductToCart = (payload: any) => ({
	type: ADD_PRODUCT,
	payload
});

const removeProductFromCart = (index: number) => ({
	type: REMOVE_PRODUCT,
	payload: { index }
});

const increase = (id?: string) => ({
	type: INCREASE_QUANTITY,
	payload: { id }
});

const decrease = (id?: string) => ({
	type: DECREASE_QUANTITY,
	payload: { id }
});

const setQuantity = (id: string, quantity: number) => ({
	type: SET_QUANTITY,
	payload: { id, quantity }
});

const setPrice = (id: number, price: number) => ({
	type: SET_PRICE,
	payload: { id, price }
});

const setDiscount = (discount: number) => ({
	type: SET_DISCOUNT,
	payload: { discount }
});

const pause = (clientName: string, userName: string) => ({
	type: PAUSE,
	payload: { clientName, userName }
});

const removePausedTicket = (id: number) => ({
	type: REMOVE_PAUSED_TICKET,
	payload: { id }
});

const restartTicket = (id: number) => ({
	type: RESTART_TICKET,
	payload: { id }
});

const clear = () => ({ type: CLEAR });

const showQtyCalculator = (productId: string) => ({
	type: SHOW_QTY_CALCULATOR,
	payload: { productId }
})

const hideQtyCalculagor = () => ({ type: HIDE_QTY_CALCULATOR })

export {
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
	FINISH_TICKET,
	CLEAR,
	SHOW_QTY_CALCULATOR,
	HIDE_QTY_CALCULATOR,

	addProductToCart,
	removeProductFromCart,
	increase,
	decrease,
	setQuantity,
	setPrice,
	setDiscount,
	pause,
	removePausedTicket,
	restartTicket,
	clear,
	showQtyCalculator,
	hideQtyCalculagor
};
