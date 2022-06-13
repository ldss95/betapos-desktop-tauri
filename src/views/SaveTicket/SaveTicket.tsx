import { useState, useEffect } from 'react';
import {
	Layout,
	Divider,
	Input,
	Row,
	Button,
	Avatar,
	message
} from 'antd';
import {
	CreditCardTwoTone,
	DollarTwoTone,
	CalculatorTwoTone,
	ClockCircleTwoTone,
	EditTwoTone
} from '@ant-design/icons';
import { MdOutlineDeliveryDining } from 'react-icons/md';
import { IoBagCheckOutline } from 'react-icons/io5';
import { useNavigate, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Swal from 'sweetalert2';

import http from '../../http';
import { format } from '../../helper'
import { clear } from '../../redux/actions/cart'
const { Sider } = Layout;

const Tile = ({ text, Icon, selected, onClick }: any) => (
	<div
		style={{
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			marginRight: 15,
			background: '#fff',
			padding: 15,
			borderRadius: 5,
			width: 180,
			height: 100,
			fontSize: 40,
			cursor: 'pointer',
			borderWidth: 4,
			borderStyle: 'solid',
			borderColor: selected ? '#ebc444' : '#fff'
		}}
		onClick={onClick}
	>
		<Icon twoToneColor={selected ? '#ebc444' : '#cdcdcd'} />
		<span
			style={{
				fontSize: 16,
				marginTop: 15,
				color: selected ? '#ebc444' : '#8c8c8c',
			}}
		>
			{text}
		</span>
	</div>
)

function SaveTicket() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { cart, shiftId } = useSelector(({ cart, session }: any) => ({ cart, shiftId: session?.shift?.id, }));

	const [paymentTypes, setPaymentTypes] = useState<{ id: string; name: string }[]>([]);
	const [paymentMethod, setPaymentMethod] = useState<'cash' | 'credit_card' | 'mixed' | 'credit'>('cash');
	const [orderType, setOrderType] = useState<'DELIVERY' | 'PICKUP'>('PICKUP');
	const [cash, setCash] = useState(0);
	const [shippingAddress, setShippingAddress] = useState<string | null>(null);
	const [client, setClient] = useState<any>();
	const [showClientSelector, setShowClientSector] = useState(false);

	useEffect(() => {
		http.get('/payment-types')
			.then(({ data }: any) => setPaymentTypes(data))
			.catch(() => message.error('Error loading payment types'));
	}, [])

	const itbis = cart.products.reduce((total: number, { price, quantity, itbis }: any) => {
		if(!itbis) {
			return total;
		}

		return total + ((price * quantity / 100) * itbis);
	}, 0)
	const total = cart.products.reduce((total: number, { price, quantity }: any) => total + (price * quantity), 0)
	const subTotal = cart.products.reduce((total: number, { price, quantity, itbis }: any) => {
		if(!itbis) {
			return total + (price * quantity);
		}

		return total + (price * quantity / 1.18);
	}, 0)

	const saveTicket = async (form: any) => {
		try {
			const total = amount();
			const { cash } = form;
			const { discount } = cart;

			if (cash && (cash <= total - discount)) {
				return message.warning('Dinero recibido insuficiente.')
			}

			const products = cart.products.map((product: any) => ({
				productId: product.id,
				quantity: product.quantity,
				price: product.price
			}));

			await http.post('/tickets', {
				ticket: {
					amount: total,
					status: 'DONE',
					shiftId,
					discount,
					shippingAddress,
					clientId: client?.id,
					orderType
				},
				products,
				payments: [
					{
						typeId: paymentTypes.find(({ name }: any) => name === 'Efectivo')?.id,
						amount: total - discount
					}
				]
			})
			dispatch(clear());
			// setSummary({
			// 	visible: true,
			// 	total,
			// 	discount,
			// 	payed: cash
			// });
			navigate('/main');
		} catch (error) {
			Swal.fire('Oops!', 'No se pudo guardar la factura.', 'error');
			console.error(error)	
		}
	};

	const amount = () =>
		cart.products.reduce(
			(accumulated: number, currValue: any) =>
				(accumulated += currValue.price * currValue.quantity),
			0
		);

	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				height: '100vh'
			}}
		>
			<Layout
				style={{
					height: '100vh',
					maxWidth: 1200,
					maxHeight: 700,
					borderRadius: 10,
					overflow: 'hidden'
				}}
			>
				<Sider
					width={350}
					style={{ background: '#404040', padding: 30 }}
				>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'space-between',
							height: '100%'
						}}
						>
						<div>
							<h1
								style={{
									textAlign: 'center',
									color: '#fff',
									fontWeight: 'bold',
									fontSize: 30
								}}
							>
								Resumen de factura
							</h1>
							<br />
							<br />

							<Row justify='center'>
								<Avatar
									// src={}
									size={100}
								>
									<h2>CF</h2>
								</Avatar>
							</Row>
							<br />
							<Row justify='center'>
								<h3 style={{ color: '#fff', fontWeight: 'bold' }}>
									Consumidor Final
									<Button
										onClick={() => setShowClientSector(true)}
										style={{
											border: 'none',
											background: 'none',
											padding: 0,
											marginLeft: 15
										}}
									>
										<EditTwoTone twoToneColor='#cdcdcd' style={{ fontSize: 24 }} />
									</Button>
								</h3>
							</Row>
							<Divider style={{ background: '#fbde44' }} />

							<Row justify='space-between'>
								<h3 style={{ color: '#fff' }}>Subtotal:</h3>
								<h3 style={{ color: '#fff', fontWeight: 'bold' }}>$ {format.cash(subTotal, 2)}</h3>
							</Row>
							<Row justify='space-between'>
								<h3 style={{ color: '#fff' }}>ITBIS:</h3>
								<h3 style={{ color: '#fff', fontWeight: 'bold' }}>$ {format.cash(itbis, 2)}</h3>
							</Row>
							<Row justify='space-between'>
								<h3 style={{ color: '#fff' }}>Descuento:</h3>
								<h3 style={{ color: '#fff', fontWeight: 'bold' }}>$ {format.cash(cart.discount, 2)}</h3>
							</Row>
							<Row justify='space-between'>
								<h3 style={{ color: '#fff' }}>Total:</h3>
								<h3 style={{ color: '#fff', fontWeight: 'bold' }}>$ {format.cash(total - cart.discount, 2)}</h3>
							</Row>
						</div>


						<NavLink
							to='/main'
							style={{
								fontSize: 24,
								fontWeight: 'bold',
								textAlign: 'center',
								color: '#fbde44'
							}}
						>
							Volver al carrito
						</NavLink>
					</div>
				</Sider>

				<Layout style={{ padding: 30, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
					<div>
						<h2>Selecciona un metodo de pago</h2>
						<div style={{ display: 'flex' }}>
							<Tile
								text='Efectivo'
								Icon={DollarTwoTone}
								selected={paymentMethod === 'cash'}
								onClick={() => setPaymentMethod('cash')}
							/>
							<Tile
								text='Tarjeta de crédito'
								Icon={CreditCardTwoTone}
								selected={paymentMethod === 'credit_card'}
								onClick={() => setPaymentMethod('credit_card')}
							/>
							<Tile
								text='Mixto'
								Icon={CalculatorTwoTone}
								selected={paymentMethod === 'mixed'}
								onClick={() => setPaymentMethod('mixed')}
							/>
							<Tile
								text='Fiao'
								Icon={ClockCircleTwoTone}
								selected={paymentMethod === 'credit'}
								onClick={() => setPaymentMethod('credit')}
							/>
						</div>
						<Divider />

						<h2>Tipo de orden</h2>
						<div style={{ display: 'flex' }}>
							<Tile
								text='Recoger'
								Icon={IoBagCheckOutline}
								selected={orderType === 'PICKUP'}
								onClick={() => setOrderType('PICKUP')}
							/>

							<Tile
								text='Delivery'
								Icon={MdOutlineDeliveryDining}
								selected={orderType === 'DELIVERY'}
								onClick={async () => {
									setOrderType('DELIVERY');
									// await wait(1000);
									// const deliveryAddressInput: any = document.querySelector('#delivery_address_input');
									// deliveryAddressInput.focus();
								}}
							/>
						</div>
						{orderType === 'DELIVERY' && (
							<>
								<br />
								<label>Direccion de entrega</label>
								<Input
									id='delivery_address_input'
									onChange={({ target: { value } }) => setShippingAddress(value || null)}
									autoFocus
								/>
							</>
						)}
					</div>

					<Row justify='end'>
						<Button
							type="primary"
							className="big"
							onClick={saveTicket}
						>
							Guardar
						</Button>
					</Row>
				</Layout>
			</Layout>
		</div>
	)
}

export default SaveTicket;