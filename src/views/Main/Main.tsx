import { useEffect, useState } from 'react';
import { Layout } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import http from '../../http';
import { wait } from '../../helper';
import { increase, decrease } from '../../redux/actions/cart'

import NavBar from '../../components/Navbar/Navbar';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import Product from '../../components/Product/Product';
import ModalSummay from '../../components/ModalSummary/ModalSummary';
import ModalProductQty from '../../components/ModalProductQty/ModalProductQty';

const { Content } = Layout;

const Main = () => {
	const navigate = useNavigate();
	const cart = useSelector((state: any) => state.cart);
	const dispatch = useDispatch();

	const [summary, setSummary] = useState<any>({});

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
				case 'F12':
					event.preventDefault();
					if (cart.products.length > 0) {
						navigate('/')
					}

					break;
				case 'F10':
					const input: any = document.querySelector('.quantity-input input')
					if (input) {
						input.focus()
						input.select()
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
			<ModalSummay
				visible={summary.visible}
				close={() => setSummary({ ...summary, visible: false })}
				items={[
					{
						title: 'Total',
						amount: summary.total
					},
					{
						title: 'Descuento',
						amount: summary.discount
					},
					{
						title: 'Total a pagar',
						amount: (summary.total - summary.discount)
					},
					{
						title: 'Efectivo',
						amount: summary.payed
					},
					{
						title: 'Devuelto',
						amount: summary.payed - (summary.total - summary.discount),
						main: true,
						class: 'danger'
					}
				]}
			/>

			{/* Quantity adjusments */}
			<ModalProductQty
				visible={cart.qtyCalculator.visible}
				productId={cart.qtyCalculator.productId}
			/>
		</Layout>
	);
};

export default Main;
