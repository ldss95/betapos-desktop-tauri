const SHOW_CANCEL_TICKET = 'SHOW_CANCEL_TICKET';
const HIDE_CANCEL_TICKET = 'HIDE_CANCEL_TICKET';
const SET_CANCEL_TICKET_ID = 'SER_CANCEL_TICKET_ID';

const showCancelTicket = () => ({ type: SHOW_CANCEL_TICKET });
const hideCancelTicket = () => ({ type: HIDE_CANCEL_TICKET });
const setCancelTicketId = (ticketId: string) => ({
    type: SET_CANCEL_TICKET_ID,
    payload: { ticketId }
});

export {
    SHOW_CANCEL_TICKET,
    HIDE_CANCEL_TICKET,
    SET_CANCEL_TICKET_ID,

    showCancelTicket,
    hideCancelTicket,
    setCancelTicketId
}