import { useState } from 'react';
import {
	Layout,
	Row,
	Form,
	Switch,
	Button,
	Input,
	Typography
} from 'antd';
import Swal from 'sweetalert2';
import { useSelector, useDispatch } from 'react-redux';

import './Settings.scss';
import { Header } from '../../components';
import http from '../../http';
import { setMeta } from '../../redux/actions/meta'

const { Content } = Layout;
const { Title } = Typography;

const Settings = () => {
	const meta = useSelector((state: any) => state.meta);
	const dispatch = useDispatch()

	const [loading, setLoading] = useState(false);

	const handleSubmit = (form: any) => {
		setLoading(true);
		http.put('/meta', form)
			.then(() => {
				setLoading(false);
				Swal.fire('Actualizado', '', 'success');
				dispatch(setMeta(form))
			})
			.catch((error) => {
				setLoading(false);
				if (error.response.status === 403) {
					Swal.fire(
						'Acceso negado!',
						'No cuentas con permisos para esto.',
						'warning'
					);
					return;
				}

				Swal.fire('Error', 'No se ha podido guardar.', 'error');
			});
	};

	return (
		<Layout style={{ height: '100vh' }}>
			<Header title="Configuraciones" />

			<Content className="main">
				<Row align="middle" justify="center">
					<Form
						layout="vertical"
						style={{ width: 350 }}
						initialValues={{
							printerIp: meta.printerIp,
						}}
						onFinish={handleSubmit}
					>
						<div id="shop_card">
							<Title level={1}>--/-- Business Name Here --/--</Title>
						</div>

						<Form.Item label="IP Impresora" name="printerIp">
							<Input />
						</Form.Item>

						<Form.Item
							label="Producto generico"
							name="allowToInvoiceGenericProduct"
						>
							<Switch
								defaultChecked={meta.allowToInvoiceGenericProduct}
							/>
						</Form.Item>

						<Row justify="center">
							<Button
								type="primary"
								htmlType="submit"
								loading={loading}
							>
								Guardar
							</Button>
						</Row>
					</Form>
				</Row>
			</Content>
		</Layout>
	);
};

export default Settings;
