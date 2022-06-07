import { useEffect, useState } from 'react';
import { Layout, InputNumber, Modal, Form, Row, Button, message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import Swal from 'sweetalert2';

import http from '../../http';
import { finishTicket, clear, increase, decrease } from '../../redux/actions/cart'

import NavBar from '../../components/Navbar/Navbar';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import Product from '../../components/Product/Product';
import ModalSummay from '../../components/ModalSummary/ModalSummary';
import ModalNewProduct from '../../components/ModalNewProducts/ModalNewProduct'

const { Content } = Layout;

const Main = () => {
	const { cart, shop, shiftId, role } = useSelector((state: any) => ({
		cart: state.cart,
		shop: state.shop,
		shiftId: state.session?.shift?.id,
		role: state.session.role
	}));
	const dispatch = useDispatch()

	const [summary, setSummary] = useState<any>({});
	const [createProduct, setCreateProduct] = useState({ visible: false, barcode: '' })

	useEffect(() => {
		document.addEventListener('keydown', (event) => {
			switch (event.code) {
				case 'F12':
					event.preventDefault();
					if (role !== 'ADMIN') {
						dispatch(finishTicket(true))
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

	const saveTicket = (form: any) => {
		const total = amount();
		const { cash } = form;
		const { discount } = cart;

		if (cash >= total - discount) {
			dispatch(finishTicket(false))
			const products = cart.products.map((product: any) => ({
				productId: product.id,
				quantity: product.quantity,
				price: product.price
			}));

			http.post('/tickets', {
				ticket: { amount: total, status: 'DONE', shiftId, discount },
				products,
				shop
			})
				.then(() => {
					dispatch(clear());
					setSummary({
						visible: true,
						total,
						discount,
						payed: cash
					});
				})
				.catch((error) => {
					Swal.fire('Oops!', 'No se pudo guardar la factura.', 'error');
					console.error(error)
				});
		} else {
			message.warning('Dinero recibido insuficiente.')
		}
	};

	const amount = () =>
		cart.products.reduce(
			(accumulated: number, currValue: any) =>
				(accumulated += currValue.price * currValue.quantity),
			0
		);

	return (
		<Layout style={{ height: '100vh' }}>
			{/* Navigation Menu */}
			<NavBar createProduct={setCreateProduct} />

			<Layout>
				{/* Top Bar */}
				<Header main createProduct={setCreateProduct} />

				<Content className="main">
					{cart.products.map((product: any, index: number) => (
						<Product key={`${product.id} - ${index}`} {...product} index={index} />
					))}
				</Content>
			</Layout>
			
			{/* Right Sidebar */}
			<Sidebar />

			{/* Modal to finish billin process */}
			<Modal
				width={300}
				visible={cart.finish}
				onCancel={() => dispatch(finishTicket(false))}
				footer={null}
				title="Efectivo Recibido"
				destroyOnClose
			>
				<Form layout="vertical" onFinish={saveTicket}>
					<Form.Item
						label=""
						name="cash"
						rules={[{ required: true }]}
					>
						<InputNumber
							formatter={(value: any) => value?.replace(/[^0-9]/g, '')}
							id="cash_input"
							autoFocus 
						/>
					</Form.Item>

					<Row justify="center">
						<Button type="primary" htmlType="submit" className="sm">
							Continuar
						</Button>
					</Row>
				</Form>
			</Modal>

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

			{/* Modal to create new product */}
			<ModalNewProduct
				{ ...createProduct }
				hide={() => setCreateProduct({ visible: false, barcode: '' })}
			/>
		</Layout>
	);
};

export default Main;
