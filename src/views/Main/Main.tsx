import { useEffect } from 'react';
import { Layout } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import http from '../../http';
import { wait } from '../../helper';
import {
	increase,
	decrease,
	hideLastTicketSummary,
	removeProductFromCart
} from '../../redux/actions/cart'
import {
	hideCancelTicket
} from '../../redux/actions/common'

import {
	NavBar,
	Header,
	Sidebar,
	Product,
	ModalSummary,
	ModalProductQty,
} from '../../components';
import ModalCancelTicket from '../../components/ModalCancelTicket';

const { Content } = Layout;

const Main = () => {
	const navigate = useNavigate();
	const { cart, common } = useSelector(({ cart, common }: any) => ({ cart, common }));
	const dispatch = useDispatch();
	console.log(common.showCancelTicket)

	useEffect(() => {
		const barcodeInput: any = document.querySelector('#barcode_input');
		
		barcodeInput?.addEventListener('blur', async () => {
			await wait(0.01);
			const focusedElement = document.querySelector(':focus')

			if (!focusedElement) {
				barcodeInput?.focus()
			}
		})

		document.addEventListener('keydown', (event) => {
			switch (event.code) {
				// Guarda Factura
				case 'F12':
					event.preventDefault();
					if (cart.products.length > 0) {
						navigate('/save-ticket')
					}

					break;
				
				// Enfoca input de cantidad
				case 'F10':
					const input: any = document.querySelector('.quantity-input input')
					if (input) {
						input.focus()
						input.select()
					}
					break;

				// Elimina ultimo producto
				case 'F4':
					if (cart.products.length > 0) {
						const index = cart.products.length - 1;
						dispatch(removeProductFromCart(index))
					}
					break;
				case 'ArrowUp':
					event.preventDefault();
					dispatch(increase())
					break;
				case 'ArrowDown':
					event.preventDefault();
					dispatch(decrease())
					break;
				default: ;
			}
		});

		http.post('/sync');

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<Layout style={{ height: '100vh' }}>
			{/* Navigation Menu */}
			<NavBar />

			<Layout>
				{/* Top Bar */}
				<Header main />

				<Content className="main">
					{cart.products.map((product: any, index: number) => (
						<Product key={`${product.id} - ${index}`} {...product} index={index} />
					))}
				</Content>
			</Layout>
			
			{/* Right Sidebar */}
			<Sidebar />

			{/* Summary of ticket */}
			{cart.lastTicketSummary && (
				<ModalSummary
					visible={cart.showLastTicketSummary}
					close={() => dispatch(hideLastTicketSummary())}
					id={cart.lastTicketSummary.id}
					type='TICKET'
					items={[
						{
							title: 'Total',
							amount: cart.lastTicketSummary?.total
						},
						{
							title: 'Descuento',
							amount: cart.lastTicketSummary?.discount
						},
						{
							title: 'Total a pagar',
							amount: (cart.lastTicketSummary?.total - cart.lastTicketSummary?.discount)
						},
						...cart
							.lastTicketSummary
							?.payments
							?.map(({ amount, type }: any) => ({
								title: type,
								amount: amount || 0
							})),
						{
							title: 'Devuelto',
							amount: cart.lastTicketSummary?.change,
							main: true,
							class: 'danger'
						}
					]}
				/>
			)}

			{/* Quantity adjusments */}
			<ModalProductQty
				visible={cart?.qtyCalculator?.visible}
				productId={cart?.qtyCalculator?.productId}
			/>

			{/* Cancel Ticket */}
			<ModalCancelTicket
				visible={common.showCancelTicket}
				id={common.cancelTicketId}
				close={() => dispatch(hideCancelTicket())}
			/>
		</Layout>
	);
};

export default Main;
