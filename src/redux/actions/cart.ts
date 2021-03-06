import { ClientProps, TicketSummaryProps } from "../../utils/interfaces";

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
const SHOW_PRICE_CHANGE = 'SHOW_PRICE_CHANGE';
const HIDE_PRICE_CHANGE = 'HIDE_PRICE_CHANGE';
const SET_CLIENT = 'SET_CLIENT';
const REMOVE_CLIENT = 'REMOVE_CLIENT';
const SET_SUMMARY = 'SET_SUMMARY';
const SHOW_LAST_TICKET_SUMMARY = 'SHOW_LAST_TICKET_SUMMARY';
const HIDE_LAST_TICKET_SUMMARY = 'HIDE_LAST_TICKET_SUMMARY';

const addProductToCart = (payload: any) => ({
	type: ADD_PRODUCT,
	payload
});

const removeProductFromCart = (index: number) => ({
	type: REMOVE_PRODUCT,
	payload: { index }
});

const increase = (index?: number) => ({
	type: INCREASE_QUANTITY,
	payload: { index }
});

const decrease = (index?: number) => ({
	type: DECREASE_QUANTITY,
	payload: { index }
});

const setQuantity = (index: number, quantity: number) => ({
	type: SET_QUANTITY,
	payload: { index, quantity }
});

const setPrice = (index: number, price: number) => ({
	type: SET_PRICE,
	payload: { index, price }
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

const showQtyCalculator = (productId: string, index: number) => ({
	type: SHOW_QTY_CALCULATOR,
	payload: { productId, index }
});

const showPriceChange = (index: number) => ({
	type: SHOW_PRICE_CHANGE,
	payload: { index }
});

const setClient = (client: ClientProps) => ({
	type: SET_CLIENT,
	payload: { client }
});

const removeClient = () => ({ type: REMOVE_CLIENT });
const hideQtyCalculagor = () => ({ type: HIDE_QTY_CALCULATOR })
const hidePriceChange = () => ({ type: HIDE_PRICE_CHANGE })
const setSummary = (summary: TicketSummaryProps) => ({
	type: SET_SUMMARY,
	payload: { summary }
})
const showLastTicketSummary = () => ({ type: SHOW_LAST_TICKET_SUMMARY });
const hideLastTicketSummary = () => ({ type: HIDE_LAST_TICKET_SUMMARY })

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
	SHOW_PRICE_CHANGE,
	HIDE_PRICE_CHANGE,
	SET_CLIENT,
	REMOVE_CLIENT,
	SHOW_LAST_TICKET_SUMMARY,
	HIDE_LAST_TICKET_SUMMARY,
	SET_SUMMARY,

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
	hideQtyCalculagor,
	showPriceChange,
	hidePriceChange,
	setClient,
	removeClient,
	showLastTicketSummary,
	hideLastTicketSummary,
	setSummary
};
