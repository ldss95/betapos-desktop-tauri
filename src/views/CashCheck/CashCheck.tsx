import { useState, useEffect } from 'react';
import {
	Layout,
	Row,
	Col,
	Typography,
	InputNumber,
	Button,
	Space
} from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import './CashCheck.scss';
import { format } from '../../helper';
import http from '../../http';
import { logOut } from '../../redux/actions/session';
import { Header, ModalSummary } from '../../components';
import { toggleMenu } from '../../redux/actions/navbar';

const { Content } = Layout;
const { Text, Title } = Typography;

const CashingOut = () => {
	const { shift, sellerName, role } = useSelector((state: any) => ({
		shift: state.session.shift,
		role: state.session.role,
		sellerName: state.session.name
	}));
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [loading, setLoading] = useState(false);
	const [summary, setSummary] = useState<any>({ vivisble: false })

	const [cashDetail, setCashDetail] = useState([
		{ type: 'coin', quantity: 0, amount: 1 },
		{ type: 'coin', quantity: 0, amount: 5 },
		{ type: 'coin', quantity: 0, amount: 10 },
		{ type: 'coin', quantity: 0, amount: 25 },
		{ type: 'bill', quantity: 0, amount: 20 },
		{ type: 'bill', quantity: 0, amount: 50 },
		{ type: 'bill', quantity: 0, amount: 100 },
		{ type: 'bill', quantity: 0, amount: 200 },
		{ type: 'bill', quantity: 0, amount: 500 },
		{ type: 'bill', quantity: 0, amount: 1000 },
		{ type: 'bill', quantity: 0, amount: 2000 }
	]);

	useEffect(() => {
		dispatch(toggleMenu());

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const totalCoins = () =>
		cashDetail
			.filter(item => item.type === 'coin')
			.reduce((acumulated, coin) => acumulated + coin.quantity * coin.amount, 0);

	const totalBills = () =>
		cashDetail
			.filter(item => item.type === 'bill')
			.reduce((acumulated, bill) => acumulated + bill.quantity * bill.amount, 0);

	const endShift = () => {
		setLoading(true);
		http.put('/shifts', {
			shift,
			endAmount: totalBills() + totalCoins(),
			cashDetail,
			sellerName
		})
			.then(() => {
				handleLogOut();
			})
			.catch(() => {
				setLoading(false);
				Swal.fire('Error', 'No se ha podido cerrar su turno', 'error');
			});
	};

	const handleLogOut = () => {
		http.post('/auth/logout')
			.then(() => {
				dispatch(logOut());
				setLoading(false);
				navigate('/login');
			})
			.catch(() => {
				setLoading(false);
				Swal.fire('Oops!', 'No se pudo cerrar la sesion', 'error');
				navigate('/main');
			});
	};

	return (
		<Layout>
			<Header title='Cierre de Caja' />

			<Content className="main">
				<Row gutter={120}>
					<Col span={12}>
						<Row justify="center">
							<Title level={3}>Monedas</Title>
						</Row>
						<Row justify="space-between">
							<Text>Cantidad</Text>
							<Text>Denominacion</Text>
							<Text>Valor</Text>
						</Row>
						{cashDetail.map((item, index) =>
							item.type === 'coin' && (
								<div
									key={`C-${index}`}
									className="coin-row"
								>
									<InputNumber
										onChange={(value) =>
											setCashDetail(
												cashDetail.map((c: any, i: number) => (i === index)
													? { ...c, quantity: value }
													: c
												)
											)
										}
										placeholder='0'
									/>
									<Text>{item.amount}</Text>
									<Text>
										{format.cash(item.amount * item.quantity)}
									</Text>
								</div>
							)
						)}
					</Col>
					<Col span={12}>
						<Row justify="center">
							<Title level={3}>Billetes</Title>
						</Row>
						<Row justify="space-between">
							<Text>Cantidad</Text>
							<Text>Denominacion</Text>
							<Text>Valor</Text>
						</Row>
						{cashDetail.map((item, index) => (item.type === 'bill') &&
							<div
								key={`B-${index}`}
								className="coin-row"
							>
								<InputNumber
									onChange={(value) =>
										setCashDetail(
											cashDetail.map((b: any, i: number) => (i === index)
												? { ...b, quantity: value }
												: b
											)
										)
									}
									placeholder='0'
								/>
								<Text>{item.amount}</Text>
								<Text>
									{format.cash(item.amount * item.quantity)}
								</Text>
							</div>
						)}
					</Col>
				</Row>
				<br />
				<br />
				<br />

				{(role === 'ADMIN') &&
					<Row justify="center">
						<Space size="large">
							<div className="cashing-out-total">
								<Text>Total Monedas</Text>
								<Title level={2}>
									{format.cash(totalCoins())}
								</Title>
							</div>
							<div className="cashing-out-total">
								<Text>Total Billetes</Text>
								<Title level={2}>
									{format.cash(totalBills())}
								</Title>
							</div>
							<div className="cashing-out-total">
								<Text>Total Efectivo</Text>
								<Title level={2}>
									{format.cash(
										totalBills() + totalCoins()
									)}
								</Title>
							</div>
						</Space>
					</Row>
				}
					
				<br />

				<Row justify="center">
					<Button
						type="primary"
						loading={loading}
						onClick={endShift}
					>
						Cerrar Turno
					</Button>
				</Row>
				<br />
				<br />
			</Content>
		
			<ModalSummary
				visible={summary.visible}
				close={() => {
					setSummary({ ...summary, visible: false })
					navigate(-1);
				}}
				items={[
					{
						title: 'Inicio',
						amount: shift?.startAmount
					},
					{
						title: 'Vendido',
						amount: summary.sold
					},
					{
						title: 'Descuentos',
						amount: summary.discount
					},
					{
						title: 'Ingresos',
						amount: summary.income
					},
					{
						title: 'Egresos',
						amount: summary.expenses
					},
					{
						title: 'Efectivo',
						amount: summary.amount
					},
					{
						class: summary.mainClass,
						title: summary.mainTitle,
						amount: summary.results,
						main: true
					}
				]}
			/>
		</Layout>
	);
};

export default CashingOut;
