import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Row, Button, Layout, Form, Input, Typography, Space } from 'antd'
import { LockOutlined } from '@ant-design/icons'
import Swal from 'sweetalert2'

import './Login.scss';
import http from '../../http'
import { validate2FA, logOut } from '../../redux/actions/session'

const { Title } = Typography

const TFA = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const isLoggedIn = useSelector((state: any) => state.session.isLoggedIn);

	const [loading, setLoading] = useState(false);

	const handleSubmit = ({ token }: any) => {
		setLoading(true)
		http.post('/auth/2FA', { token })
			.then(({ data }) => {
				setLoading(false)

				if (data.isValid)
					dispatch(validate2FA())
				else
					Swal.fire('Oops!', 'Token invalido, intentelo otra vez.', 'warning')
			}).catch(error => {
				setLoading(false)

				Swal.fire('Error', 'Error desconocido', 'error')
				console.error(error)
			})
	}

	const handleLogOut = () => {
		http.post('/auth/logout')
			.then(() => dispatch(logOut()))
			.catch((error) => {
				Swal.fire('Oops!', 'No se pudo cerrar la sesion', 'error');
				console.error(error)
			});
	};

	if (isLoggedIn)
		return navigate('/main')

	return (
		<Layout id="login_container">
			<Title level={1} className="title">
				Ingrese Token 2FA
			</Title>

			<Form layout="vertical" onFinish={handleSubmit}>
				<Row justify="center">
					<div className="lock-icon">
						<LockOutlined/>
					</div>
				</Row>
				<br/>

				<Form.Item
					label="Token"
					name="token"
					rules={[{ required: true }]}
				>
					<Input autoFocus type='number' />
				</Form.Item>
				<br/>

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
							Ingresar
						</Button>
					</Space>
				</Row>
			</Form>
		</Layout>
	);
}

export default TFA;
