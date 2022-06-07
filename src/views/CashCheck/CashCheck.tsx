import { useState, useEffect, Fragment } from 'react';
import {
	Layout,
	Row,
	Col,
	Typography,
	Input,
	InputNumber,
	Button,
	Space,
	Card,
	Form
} from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import './CashCheck.scss';
import { format, avoidNotNumerics } from '../../helper';
import http from '../../http';
import { logOut } from '../../redux/actions/session';
import Header from '../../components/Header/Header';
import ModalSummary from '../../components/ModalSummary/ModalSummary'

const { Content } = Layout;
const { Text, Title } = Typography;

const CashingOut = () => {
	const location = useLocation();
	const { shift, shopName, sellerName, role } = useSelector((state: any) => ({
		shift: state.session.shift,
		role: state.session.role,
		shopName: state.shop.name,
		sellerName: state.session.name
	}));
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [path, setPath] = useState<string>();
	const [loading, setLoading] = useState(false);
	const [isAuthorized, setIsAuthorized] = useState(false);
	const [error, setError] = useState<any>(null);
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
		setPath(location.pathname);

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
			shopName,
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

	const saveCheck = () => {
		setLoading(true);
		http.post('/cash-flow', {
			type: 'CHECK',
			amount: totalBills() + totalCoins(),
			cashDetail,
			shiftId: shift.id
		})
			.then((res) => {
				setLoading(false);

				const { data } = res
				data.visible = true
				data.results = data.amount - (shift.startAmount + data.sold - data.discount + data.income - data.expenses)

				if (data.results > 0) {
					data.mainClass = 'info'
					data.mainTitle = 'Sobrante'
				}else if (data.results < 0) {
					data.mainClass = 'danger'
					data.mainTitle = 'Faltante'
				} else {
					data.mainTitle = 'Sin Diferencias'
				}

				setSummary(data)
			})
			.catch((error) => {
				setLoading(false);
				Swal.fire('Error', 'No se ha podido guardar el arqueo', 'error');
				console.error(error)
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

	const handleAuthorization = (form: any) => {
		setLoading(true);
		http.post('/auth/authorize', form)
			.then(() => {
				setLoading(false);
				setIsAuthorized(true);
			})
			.catch((error) => {
				setLoading(false);
				if (error.response.status === 401)
					setError(error.response.data);
				else if (error.response.status === 403)
					Swal.fire(
						'Oops!',
						'Se requiere autorizacion de un administrador',
						'warning'
					);
				else console.error(error);
			});
	};

	return (
		<Layout>
			<Header
				title={path === '/shift-end' ? 'Cierre de Caja' : 'Arqueo'}
			/>

			<Content className="main">
				{path === '/cash-check' && !isAuthorized && (
					<Row
						justify="center"
						align="middle"
						style={{
							minHeight: 'calc(100vh - 160px)',
							background: '#cdcdcd'
						}}
					>
						<Card title="Autorizacion requerida">
							<Form
								layout="vertical"
								onFinish={handleAuthorization}
							>
								<Form.Item
									label="Nombre de usuario"
									name="nickName"
									rules={[
										{
											required: true,
											message:
												'Ingrese su nombre de usuario'
										}
									]}
									validateStatus={
										error?.error && error?.error === 'Nick'
											? 'error'
											: ''
									}
									help={
										error?.error && error?.error === 'Nick'
											? error?.message
											: null
									}
								>
									<Input />
								</Form.Item>

								<Form.Item
									label="Contraseña"
									name="password"
									rules={[
										{
											required: true,
											message: 'Contraseña'
										}
									]}
									validateStatus={
										error?.error &&
										error?.error === 'Password'
											? 'error'
											: ''
									}
									help={
										error?.error &&
										error?.error === 'Password'
											? error?.message
											: null
									}
								>
									<Input.Password />
								</Form.Item>

								<Form.Item
									label="Token"
									name="token"
									rules={[
										{
											required: true,
											message: 'Token'
										}
									]}
									validateStatus={
										error?.error &&
										error?.error === 'Token'
											? 'error'
											: ''
									}
									help={
										error?.error &&
										error?.error === 'Token'
											? error?.message
											: null
									}
								>
									<Input
										onKeyDown={avoidNotNumerics}
										maxLength={6}
									/>
								</Form.Item>

								<Row justify="center">
									<Button
										type="primary"
										htmlType="submit"
										loading={loading}
									>
										Autorizar
									</Button>
								</Row>
							</Form>
						</Card>
					</Row>
				)}

				{(isAuthorized || path === '/shift-end') && (
					<Fragment>
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
							{path === '/cash-check' && (
								<Button
									type="primary"
									loading={loading}
									onClick={saveCheck}
								>
									Guardar
								</Button>
							)}

							{path === '/shift-end' && (
								<Button
									type="primary"
									loading={loading}
									onClick={endShift}
								>
									Cerrar Turno
								</Button>
							)}
						</Row>
						<br />
						<br />
					</Fragment>
				)}
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
