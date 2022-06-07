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
import { useNavigate } from 'react-router-dom';

import './Settings.scss';
import Header from '../../components/Header/Header';
import http from '../../http';
import { setMeta } from '../../redux/actions/meta'

const { Content } = Layout;
const { Title } = Typography;

const Settings = () => {
	const navigate = useNavigate();
	const { shop, session, meta } = useSelector((state: any) => ({
		shop: state.shop,
		session: state.session,
		meta: state.meta
	}));
	const dispatch = useDispatch()

	const [loading, setLoading] = useState(false);
	const [syncing, setSyncing] = useState(false);

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

	const changeShop = async () => {
		try {
			setSyncing(true);
			if (session.role !== 'ADMIN') {
				Swal.fire(
					'Acceso Negado!',
					'Usted no cuenta con permiso para esta accion.',
					'warning'
				);
				setSyncing(false);
				return;
			}

			if (!navigator.onLine) {
				Swal.fire(
					'Sin conexion',
					'Se requiere conexion a internet para descargar la informacion necesaria.',
					'error'
				);
				setSyncing(false);
				return;
			}

			const { data } = await http.get('/sync');

			if (data.length > 0) {
				const res = await http.post('/sync', { wait: true });
				if (!res.data.allIsDone) {
					Swal.fire(
						'Oops!',
						'Aun hay informacion pendiente por enviar a la nube, por favor intentar mas tarde.',
						'warning'
					);
					setSyncing(false);
					return;
				}
			}

			setSyncing(false);
			navigate('/shops?change=true');
		} catch (error) {
			setSyncing(false);
			Swal.fire('Error', 'Error desconocido', 'error');
			console.error(error);
		}
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
							<Title level={1}>20&10</Title>
							<Title level={2}>
								{shop.name} (D-{shop.prefix})
							</Title>

							<Button
								type="text"
								onClick={changeShop}
								loading={syncing}
							>
								{syncing
									? 'Sincronizando con la nube...'
									: 'Cambiar de tienda'}
							</Button>
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
