import { useState } from 'react';
import {
	Layout,
	Row,
	Form,
	InputNumber,
	Button,
	Space,
	Typography
} from 'antd';
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

import './Login.scss';
import http from '../../http'
import { logOut, setShift } from '../../redux/actions/session';

const { Title } = Typography

const ShiftStart = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const session = useSelector((state: any) => state.session)

	const [loading, setLoading] = useState(false);

	const start = (form: any) => {
		setLoading(true)
		http.post('/shifts', { amount: form.cash })
			.then((res) => {
				setLoading(false)
				dispatch(setShift(res.data));
			}).catch((error) => {
				setLoading(false)
				Swal.fire('Oops!', 'No se ha podido iniciar su turno', 'error');
				console.error(error)
			});
	};

	const handleLogOut = () => {
		http.post('/auth/logout')
			.then(() => dispatch(logOut()))
			.catch((error) => {
				Swal.fire('Oops!', 'No se pudo cerrar la sesion', 'error');
				console.error(error)
			});
	};

	if (session.isLoggedIn && (session.role === 'ADMIN' || session.shift)) 
		return navigate('/main');

	return (
		<Layout id="login_container">
			<Title level={1} className="title">
				Iniciar Turno
			</Title>

			<Form layout="vertical" onFinish={start}>
				<Title level={4}>{session.name}</Title>
				<br />

				<Form.Item
					label="Efectivo en Caja"
					name="cash"
					rules={[{ required: true, message: 'Efectivo' }]}
				>
					<InputNumber autoFocus min={0} />
				</Form.Item>
				<br />

				<Row justify="center">
					<Space>
						<Button type="default" onClick={handleLogOut}>
							Salir
						</Button>

						<Button
							type="primary"
							htmlType="submit"
							loading={loading}
						>
							Ininiar
						</Button>
					</Space>
				</Row>
			</Form>
		</Layout>
	);
}

export default ShiftStart;
