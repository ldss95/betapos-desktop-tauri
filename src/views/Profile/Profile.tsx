import { useEffect } from 'react';
import { Layout, Row, Form, Input, DatePicker, Button, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import moment from 'moment';

import http from '../../http';
import { setSession } from '../../redux/actions/session';
import { toggleMenu } from '../../redux/actions/navbar';
import { Header } from '../../components';

const { Content } = Layout;

const Profile = () => {
	const dispatch = useDispatch();
	const session = useSelector((state: any) => state.session);

	useEffect(() => {
		dispatch(toggleMenu());
	}, [])

	const handleSubmit = (form: any) => {
		http.put('/users', form)
			.then(() => {
				Swal.fire('Actualizado', '', 'success');
				dispatch(setSession({ ...session, ...form }));
			})
			.catch((error) => {
				if (error.response.status === 400) {
					Swal.fire('Oops!', error.response.data, 'warning');
					return;
				}
				Swal.fire(
					'Error',
					'Se ha producido un error desconocido.',
					'error'
				);
			});
	};

	return (
		<Layout style={{ height: '100vh' }}>
			<Header title="Mi Perfil" />

			<Content className="main">
				<Row justify="center" align="middle">
					<Form
						layout="vertical"
						style={{ width: 350 }}
						initialValues={{
							nickName: session.nickName,
							name: session.name,
							...(session.birthday && {
								birthday: moment(session.birthday)
							}),
							role: session.role,
							phone: session.phone,
							dui: session.dui
						}}
						onFinish={handleSubmit}
					>
						<Row justify="center">
							<Avatar size={120} icon={<UserOutlined />} src="" />
						</Row>
						<br />
						<br />

						<Form.Item label="Nombre" name="name">
							<Input />
						</Form.Item>

						<Form.Item label="Nombre de usuario" name="nickName">
							<Input />
						</Form.Item>

						<Form.Item label="Contraseña" name="password">
							<Input type="password" placeholder="**********" />
						</Form.Item>

						<Form.Item label="Fecha de Nacimiento" name="birthday">
							<DatePicker />
						</Form.Item>

						<Form.Item label="Telefono" name="phone">
							<Input />
						</Form.Item>

						<Form.Item label="Cedula" name="dui">
							<Input />
						</Form.Item>

						<Form.Item label="Rol" name="role">
							<Input disabled />
						</Form.Item>

						<Row justify="center">
							<Button type="primary" htmlType="submit">
								Guardar
							</Button>
						</Row>
						<br />
					</Form>
				</Row>
			</Content>
		</Layout>
	);
};

export default Profile;
