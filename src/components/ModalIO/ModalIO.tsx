import { useState, memo } from 'react';
import {
	Modal,
	Form,
	Input,
	InputNumber,
	Button,
	Row,
	Typography,
	Space
} from 'antd';
import { LockOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';

import http from '../../http';

const { TextArea } = Input;
const { Title } = Typography;

interface ModalIOProps {
	visible: boolean;
	close: () => void;
	type: 'IN' | 'OUT';
}
const ModalIO = ({ visible, close, type }: ModalIOProps) => {
	const shiftId = useSelector((state: any) => state.session?.shift?.id);

	const [loading, setLoading] = useState(false);

	const handleSubmit = (form: any) => {
		setLoading(true);
		http.post('/cash-flow', { ...form, type, shiftId })
			.then(() => {
				setLoading(false);
				Swal.fire('Guardado', '', 'success');
				close();
			})
			.catch((error) => {
				setLoading(false);
				if (error.response.status === 400) {
					Swal.fire('Oops!', error.response.data, 'warning');
					return;
				}

				Swal.fire('Error', 'Error desconocido', 'error');
				console.error(error)
			});
	};

	return (
		<Modal visible={visible} onCancel={close} footer={null} destroyOnClose width={300}>
			<Row justify="center">
				<LockOutlined style={{ fontSize: 64, color: '#F65058' }} />
			</Row>
			<Row justify="center">
				<Title level={2}>{type === 'IN' ? 'Ingreso' : 'Egreso'}</Title>
			</Row>
			<Form layout="vertical" onFinish={handleSubmit}>
				<Form.Item
					label="Monto"
					name="amount"
					rules={[{ required: true }]}
				>
					<InputNumber />
				</Form.Item>
		
				<Form.Item
					label="Descripcion"
					name="description"
					rules={[{ required: true }]}
				>
					<TextArea rows={4} />
				</Form.Item>

				<Space>
					<Button onClick={close} className="sm">
						Cancelar
					</Button>
					<Button
						type="primary"
						htmlType="submit"
						className="sm"
						loading={loading}
					>
						Continuar
					</Button>
				</Space>
			</Form>
		</Modal>
	);
};

export default memo(ModalIO);
