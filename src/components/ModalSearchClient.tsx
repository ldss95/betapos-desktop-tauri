import { useState, useEffect, memo } from 'react';
import {
	Modal,
	Table,
	Input,
	Form,
	Row,
	Col,
	Avatar,
	Tag,
	Button,
	Typography,
	Image
} from 'antd';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';

import http from '../http';
import { format } from '../helper';
import { ClientProps } from '../utils/interfaces';
import { setClient } from '../redux/actions/cart';

const { Text } = Typography;

interface ModalSearchProps {
	visible: boolean;
	close: () => void;
	input?: string;
}
const ModalSearchClient = ({ visible, close, input }: ModalSearchProps) => {
	const [form] = Form.useForm();
	const dispatch = useDispatch();

	const [clients, setClients] = useState<ClientProps[]>([]);
	const [loading, setLoading] = useState(false);
	const [search, setSearch] = useState('');

	useEffect(() => {
		getClients();

		// eslint-disable-next-line
	}, []);

	function getClients() {
		setLoading(true);
		http.get('/clients')
			.then(({ data }) => setClients(data))
			.catch((error) => {
				setLoading(false);
				Swal.fire(
					'Error',
					'No se ha podido obtener la lista de clientes.',
					'error'
				);
				console.error(error);
			})
			.finally(() => setLoading(false))
	};

	function filteredClients() {
		return clients.filter((client) =>
			client.name.toLowerCase().includes(search.toLowerCase()) ||
			(Number(search) && client.phone && client.phone.replace(/^D/g, '') == search) ||
			(Number(search) && client.dui && client.dui.replace(/^D/g, '') == search)
		);
	}

	return (
		<Modal
			visible={visible}
			onCancel={close}
			footer={null}
			width={900}
			destroyOnClose
			title="Buscar Cliente"
		>
			<Form layout="vertical" form={form}>
				<Row gutter={15}>
					<Col span={8}>
						<Form.Item label="Buscar" name="search">
							<Input
								className="default"
								autoFocus
								onChange={({ target }) => setSearch(target.value)}
							/>
						</Form.Item>
					</Col>
				</Row>
			</Form>
			<Table
				columns={[
					{
						title: 'Foto',
						dataIndex: 'photoUrl',
						render: (photoUrl) => (
							<Avatar
								src={
									<Image src={photoUrl} />
								}
							/>
						)
					},
					{
						title: 'Nombre',
						dataIndex: 'name'
					},
					{
						title: 'Cédula',
						dataIndex: 'dui',
						render: (dui: string) => format.dui(dui)
					},
					{
						title: 'Email',
						dataIndex: 'email',
						render: (email) => <a href={`mailto:${email}`} target='_blank'>{email}</a>
					},
					{
						title: 'Teléfono',
						dataIndex: 'phone',
						render: (phone) => format.phone(phone)
					},
					{
						title: 'Credito',
						dataIndex: 'hasCredit',
						render: (hasCredit) => {
							if (hasCredit) {
								return <Tag color='success'>Activo</Tag>
							}

							return <Tag color='error'>Inactivo</Tag>
						}
					},
					{
						title: 'Optiones',
						align: 'center',
						render: (client) => (
							<Button
								type='ghost'
								style={{
									padding: 10,
									paddingTop: 0,
									paddingBottom: 0
								}}
								onClick={() => {
									dispatch(setClient(client));
									close();
								}}
							>
								<Text style={{ fontSize: 12, fontWeight: 'normal', margin: 0, lineHeight: 1 }}>Seleccionar</Text>
							</Button>
						)
					}
				]}
				size='small'
				rowKey={({ id }) => id}
				dataSource={filteredClients()}
				loading={loading}
				pagination={false}
			/>
		</Modal>
	);
};

export default memo(ModalSearchClient);
