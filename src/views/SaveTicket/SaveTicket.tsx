import { useState, useEffect } from 'react';
import {
	Layout,
	Divider,
	Input,
	Row,
	Button,
	Avatar,
	message,
	Typography,
	Modal,
	Form,
	InputNumber
} from 'antd';
import {
	CreditCardTwoTone,
	DollarTwoTone,
	CalculatorTwoTone,
	ClockCircleTwoTone,
	EditTwoTone,
	CloseOutlined
} from '@ant-design/icons';
import { MdOutlineDeliveryDining } from 'react-icons/md';
import { IoBagCheckOutline } from 'react-icons/io5';
import { useNavigate, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Swal from 'sweetalert2';

import http from '../../http';
import { avoidNotNumerics, format } from '../../helper'
import { clear, removeClient, showLastTicketSummary, setSummary } from '../../redux/actions/cart'
import { ModalSearchClient, Tile, RenderIf } from '../../components';
import ModalMixedPayment from '../../components/ModalMixedPayment';

const { Sider } = Layout;
const { Text } = Typography;

type PaymentTypeName = 'Efectivo' | 'Mixto' | 'Tarjeta' | 'Fiao';

function SaveTicket() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { cart, shiftId } = useSelector(({ cart, session }: any) => ({ cart, shiftId: session?.shift?.id, }));

	const [paymentTypes, setPaymentTypes] = useState<{ id: string; name: PaymentTypeName }[]>([]);
	const [paymentMethod, setPaymentMethod] = useState<{ id: string; name: PaymentTypeName } | null>(null);
	const [payments, setPayments] = useState({
		cash: 0,
		credit: 0,
		card: 0
	})
	const [showMixedPaymentDetails, setShowMixedPaymentDetails] = useState(false);
	const [orderType, setOrderType] = useState<'DELIVERY' | 'PICKUP'>('PICKUP');
	const [shippingAddress, setShippingAddress] = useState<string | null>(null);
	const [showClientSelector, setShowClientSelector] = useState(false);
	const [showReceivedCashModal, setShowReceivedCashModal] = useState(false);

	useEffect(() => {
		http.get('/payment-types')
			.then(({ data }: any) => {
				if (!data) {
					return;
				}

				setPaymentTypes(data);
				const _default = data.find((item: any) => item.name === 'Efectivo');
				setPaymentMethod(_default);
			})
			.catch(() => message.error('Error loading payment types'));
	}, []);

	useEffect(() => {
		if (!cart.client && paymentMethod?.name == 'Fiao') {
			const cashMethod = paymentTypes.find(({ name }) => name == 'Efectivo');
			setPaymentMethod(cashMethod!);
		}
	}, [cart.client]);

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

	const saveTicket = async ({ cash }: { cash?: number } = {}) => {
		try {
			const total = amount();
			const { discount } = cart;

			const products = cart.products.map((product: any) => ({
				productId: product.id,
				quantity: product.quantity,
				price: product.price,
				cost: product.cost
			}));

			const ticketPayments: any[] = [];
			if (paymentMethod?.name === 'Mixto') {
				if (payments.cash > 0) {
					const { id } = paymentTypes.find(({ name }) => name === 'Efectivo')!;
					ticketPayments.push({
						typeId: id,
						amount: payments.cash
					});
				}

				if (payments.card > 0) {
					const { id } = paymentTypes.find(({ name }) => name === 'Tarjeta')!;
					ticketPayments.push({
						typeId: id,
						amount: payments.card
					});
				}

				if (payments.credit > 0) {
					const { id } = paymentTypes.find(({ name }) => name === 'Fiao')!;
					ticketPayments.push({
						typeId: id,
						amount: payments.credit
					});
				}
			} else {
				ticketPayments.push({
					typeId: paymentMethod?.id,
					amount: total
				});
			}

			const { data } = await http.post('/tickets', {
				ticket: {
					amount: total,
					status: 'DONE',
					shiftId,
					discount,
					shippingAddress,
					clientId: cart.client?.id,
					orderType,
					paymentTypeId: paymentMethod?.id,
				},
				products,
				payments: ticketPayments
			})
			dispatch(clear());
			dispatch(setSummary({
				id: data.id,
				cashReceived: cash || 0,
				total,
				discount,
				change: 0,
				payments: [],
				...(paymentMethod?.name == 'Efectivo') && {
					change: cash! - total + discount,
					payments: [{
						type: 'Efectivo',
						amount: total - discount
					}]
				},
				...(paymentMethod?.name == 'Tarjeta') && {
					payments: [{
						type: 'tarjeta',
						amount: total - discount
					}]
				},
				...(paymentMethod?.name == 'Fiao') && {
					payments: [{
						type: 'Fiao',
						amount: total - discount
					}]
				},
				...(paymentMethod?.name == 'Mixto' && payments.cash > 0) && {
					change: cash! - (total - discount - payments.card - payments.credit),
					payments: [
						{
							type: 'Efectivo',
							amount: payments.cash
						},
						{
							type: 'Tarjeta',
							amount: payments.card
						},
						{
							type: 'Fiao',
							amount: payments.credit
						}
					]
				},
			}));
			dispatch(showLastTicketSummary())
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

	const paymentMethodIcon = (paymentMethod: PaymentTypeName) => {
		if(paymentMethod == 'Efectivo') {
			return DollarTwoTone
		}

		if(paymentMethod == 'Tarjeta') {
			return CreditCardTwoTone
		}

		if(paymentMethod == 'Mixto') {
			return CalculatorTwoTone
		}

		if(paymentMethod == 'Fiao') {
			return ClockCircleTwoTone
		}
	}

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
									src={cart.client?.photoUrl}
									size={100}
								>
									<RenderIf condition={!cart.client}>
										<h2>CF</h2>
									</RenderIf>

									<RenderIf condition={cart.client && !cart.client?.photoUrl}>
										<h2>
											{cart
												?.client
												?.name
												?.split(' ')
												?.map((text: string) => text.charAt(0))
												?.join('')
											}
										</h2>
									</RenderIf>
								</Avatar>
								<RenderIf condition={cart.client}>
									<div
										style={{
											marginLeft: -15,
											background: '#fff',
											width: 25,
											height: 25,
											borderRadius: 15,
											display: 'flex',
											justifyContent: 'center',
											alignItems: 'center',
											zIndex: 10,
											cursor: 'pointer'
										}}
										onClick={() => dispatch(removeClient())}
									>
										<CloseOutlined />
									</div>
								</RenderIf>
							</Row>
							<br />
							<Row justify='center'>
								<h3 style={{ color: '#fff', fontWeight: 'bold' }}>
									<RenderIf condition={cart.client}>
										<Text style={{ color: '#fff' }}>{cart.client?.name}</Text>
									</RenderIf>
									<RenderIf condition={!cart.client}>
										<Text style={{ color: '#fff' }}>Consumidor Final</Text>
									</RenderIf>
									<Button
										onClick={() => setShowClientSelector(true)}
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
							{paymentTypes.map(({ id, name }) => (
								<Tile
									key={'payment-m-' + name}
									text={name}
									Icon={paymentMethodIcon(name)}
									selected={paymentMethod?.id === id}
									onClick={() => setPaymentMethod({ id, name })}
									disabled={name == 'Fiao' && (!cart.client || !cart?.client?.hasCredit)}
								/>
							))}
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
								onClick={() => setOrderType('DELIVERY')}
							/>
						</div>
						<RenderIf condition={orderType === 'DELIVERY'}>
							<>
								<br />
								<label>Direccion de entrega</label>
								<Input
									id='delivery_address_input'
									onChange={({ target: { value } }) => setShippingAddress(value || null)}
									defaultValue={cart.client?.address || ''}
									autoFocus
								/>
							</>
						</RenderIf>
					</div>

					<Row justify='end'>
						<Button
							type="primary"
							className="big"
							onClick={() => {
								if (paymentMethod?.name == 'Mixto') {
									return setShowMixedPaymentDetails(true);
								}

								if (paymentMethod?.name == 'Efectivo') {
									return setShowReceivedCashModal(true)
								}

								saveTicket();
							}}
						>
							Guardar
						</Button>
					</Row>
				</Layout>
			</Layout>

			<ModalSearchClient
				visible={showClientSelector}
				close={() => setShowClientSelector(false)}
			/>

			<ModalMixedPayment
				visible={showMixedPaymentDetails}
				close={() => setShowMixedPaymentDetails(false)}
				hasCredit={cart.client?.hasCredit}
				total={amount()}
				onDone={({ cash, credit, card }) => {
					setPayments({
						cash: cash || 0,
						credit: credit || 0,
						card: card || 0
					});
					if (cash > 0) {
						return setShowReceivedCashModal(true);
					}

					saveTicket();
				}}
			/>

			<Modal
				width={300}
				title='Dinero recibido'
				visible={showReceivedCashModal}
				onCancel={() => setShowReceivedCashModal(false)}
				footer={null}
				destroyOnClose
			>
				<Form layout='vertical' onFinish={saveTicket}>
					<Form.Item
						name='cash'
						label='Monto'
						rules={[
							{
								required: true,
								message: 'Ingrese el monto recibido'
							},
							{
								type: 'number',
								min: payments.cash > 0 ? payments.cash : amount() - cart.discount,
								message: 'El monto recibido no puede ser menor al total'
							}
						]}
					>
						<InputNumber autoFocus onKeyDown={avoidNotNumerics} />
					</Form.Item>
					
					<Row justify='center'>
						<Button type='primary' htmlType='submit'>
							Guardar
						</Button>
					</Row>
				</Form>
			</Modal>
		</div>
	)
}

export default SaveTicket;