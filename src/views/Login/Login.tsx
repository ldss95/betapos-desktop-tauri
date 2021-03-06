import { useState, useEffect } from 'react';
import {
	Layout,
	Row,
	Form,
	Input,
	Button,
	Spin,
	Typography
} from 'antd';
import { LoadingOutlined } from '@ant-design/icons'
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
// import { getToken } from 'firebase/messaging';

import './Login.scss';
import http from '../../http';
import { setSession, setShift } from '../../redux/actions/session';
import { setMeta } from '../../redux/actions/meta';
// import { messaging } from '../../utils/firebase';
import axios from 'axios';

const { Title } = Typography

const Login = () => {
	const dispatch = useDispatch();
	const session = useSelector((state: any) => state.session);

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<any>(null);

	useEffect(() => {
		getCurrentShift();

		if (Notification.permission != 'granted') {
			Notification.requestPermission();
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const login = async (form: any) => {
		try {
			setLoading(true);
			// const token = await getToken(messaging, {
			// 	vapidKey: import.meta.env.VITE_VAPI_KEY
			// });
			const { data } = await http.post('/auth/login', {
				...form,
				// pushNotificationsToken: token
				pushNotificationsToken: ''
			})
			dispatch(setSession(data));
			window.location.reload();
		} catch (error) {
			if (axios.isAxiosError(error) && error?.response?.status === 401)
				setError(error.response.data);
			else {
				Swal.fire(
					'Error',
					'No hemos podido completar tu solicitud, por favor intentalo mas tarde.',
					'error'
				);
			}
		} finally {
			setLoading(false);
		}
	};

	const getCurrentShift = async (isLoggedIn = session.isLoggedIn) => {
		try {
			setLoading(true);

			if (isLoggedIn) {
				const { data } = await http.get('/meta')
				dispatch(setMeta(data))
			}
		
			if (isLoggedIn && !session.shift) {
				const res = await http.get('/shifts/current')
				dispatch(setShift(res.data));
			}
			setLoading(false);
		} catch (error) {
			setLoading(false);
			Swal.fire(
				'Error',
				'No se pudo obteber la informacion de turno.',
				'error'
			);
			console.error(error)
		}
	};

	if (session.isLoggedIn && (session.role === 'ADMIN' || session.shift)) 
		return <Navigate to='/main' />;

	if (!session.isLoggedIn && session.tfa)
		return <Navigate to='/2FA' />;

	if (session.isLoggedIn && !loading)
		return <Navigate to='/shift-start' />
	
	if (session.isLoggedIn && loading)
		return (
			<Layout id="login_container">
				<Spin indicator={<LoadingOutlined style={{ fontSize: 100 }} />} />
			</Layout>
		)

	return (
		<Layout id="login_container">
			<Title level={1} className="title">
				Iniciar Sesion
			</Title>

			<Form layout="vertical" onFinish={login}>
				<Form.Item
					label="Nombre de usuario:"
					name="nickName"
					rules={[
						{ required: true, message: 'Nombre de usuario' }
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
					<Input autoFocus />
				</Form.Item>

				<Form.Item
					label="Contrase??a:"
					name="password"
					rules={[{ required: true, message: 'Contrase??a' }]}
					validateStatus={
						error?.error && error?.error === 'Password'
							? 'error'
							: ''
					}
					help={
						error?.error && error?.error === 'Password'
							? error?.message
							: null
					}
				>
					<Input.Password className="default" />
				</Form.Item>
				<br />

				<Row justify="center">
					<Button
						type="primary"
						htmlType="submit"
						loading={loading}
					>
						Ingresar
					</Button>
				</Row>
			</Form>
		</Layout>
	);
};

export default Login;
