import { useState, memo } from 'react';
import {
	Layout,
	Typography,
	Button,
	Input,
	Modal,
	Form,
	Row
} from 'antd';
import { PauseCircleOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { NavLink, useNavigate } from 'react-router-dom';

import '../styles/Sidebar.scss';
import { pause } from '../redux/actions/cart';
import { format } from '../helper';

const { Sider } = Layout;
const { Title } = Typography;

const Sidebar = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const { cart, userName, shift, businessName } = useSelector((state: any) => ({
		cart: state.cart,
		userName: state.session.name,
		businessName: state.session.businessName,
		shift: state.session.shift
	}));

	const [showPauseModal, setShowPauseModal] = useState(false);

	const amount = () =>
		cart.products.reduce(
			(accumulated: number, currValue: any) =>
				(accumulated += currValue.price * currValue.quantity),
			0
		);

	const handlePauseForm = (form: any) => {
		const { clientName } = form;
		dispatch(pause(clientName, userName));
		setShowPauseModal(false);
	};

	return (
		<>
			<Sider width={350} className="right-sider">
				<Title>{businessName}</Title>

				<div>
					<Button
						type="primary"
						icon={<PauseCircleOutlined />}
						onClick={async () => {
							if (!cart.products.length) {
								await Swal.fire(
									'Oops!',
									'No se puede pausar una factura vacia',
									'warning'
								);
								return;
							}

							setShowPauseModal(true);
						}}
						disabled={(!shift)}
					>
						Pausar Factura
					</Button>

					<NavLink
						to="/paused"
						onClick={event => {
							if(!shift){
								event.preventDefault();
							}
						}}
					>
						<Button type="primary" icon={<PlayCircleOutlined />}>
							Continuar Factura
						</Button>
					</NavLink>

					<div className="data">
						<Title level={4}>Descuento</Title>
						<Title level={3}>$ {format.cash(cart.discount, 2)}</Title>
					</div>

					<div className="data">
						<Title level={4}>Total</Title>

						<Title level={3} style={{ width: '100%' }}>
							$ {format.cash(amount() - cart.discount, 2)}
						</Title>
					</div>

					<Button
						type="primary"
						className="big"
						onClick={() => {
							if (shift && cart.products.length > 0) {
								navigate('/save-ticket')
							}
						}}
						style={{
							marginBottom: 0,
							opacity: (shift && cart.products.length > 0) ? 1 : 0.5
						}}
					>
						Facturar
					</Button>
				</div>
			</Sider>

			<Modal
				visible={showPauseModal}
				title="Pausar Factura"
				width={300}
				footer={null}
				onCancel={() => setShowPauseModal(false)}
				destroyOnClose
			>
				<Form onFinish={handlePauseForm} layout="vertical">
					<Form.Item
						label="Nombre del cliente"
						name="clientName"
						rules={[{ required: true }]}
					>
						<Input />
					</Form.Item>
					<br />

					<Row justify="center">
						<Button type="primary" htmlType="submit">
							Pausar
						</Button>
					</Row>
				</Form>
			</Modal>
		</>
	);
};

export default memo(Sidebar);
