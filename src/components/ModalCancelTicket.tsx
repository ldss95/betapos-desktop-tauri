import { memo, useEffect, useState } from 'react';
import { Modal, Button, Typography, Row } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';

import http from '../http';
import { format } from '../helper';
import { TicketProps } from '../utils/interfaces';

const { Text } = Typography;

interface ModalCancelTicketProps {
	visible: boolean;
	close: () => void;
	id: string | null;
}

function ModalCancelTicket({ visible, close, id }: ModalCancelTicketProps) {
	const [ticket, setTicket] = useState<TicketProps>({} as TicketProps);

	useEffect(() => {
		http.get('/tickets/by-id/' + id)
			.then(({ data }) => setTicket(data))
			.catch(() => {
				close();
				Swal.fire('Error', 'No se pudo obtener la informacion de la factura', 'error');
			});
	}, [id])

	return (
		<Modal
			visible={visible}
			onCancel={close}
			title={'Factura #' + ticket?.ticketNumber?.toString().padStart(8, '0')}
			footer={null}
			maskClosable={false}
			bodyStyle={{ background: 'rgba(0, 0, 0, 0.05)' }}
		>

			{ticket?.products?.map(({ quantity, price, product }) => (
				<div
					key={product.id}
					style={{
						boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.05)',
						borderRadius: 5,
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						padding: 10,
						marginBottom: 10,
						background: '#fff'
					}}
				>
					<div>
						<Text strong style={{ fontSize: 16 }}>{quantity} x {product.name}</Text>
						<br />
						<Text strong style={{ fontSize: 16 }}>$ {format.cash(price * quantity)}</Text>
					</div>

					<div>
						<Button danger>
							<DeleteOutlined style={{ color: '#ff4d4f' }} />
						</Button>
					</div>
				</div>
			))}
			<br />

			<Row justify='center'>
				<Button key="cancel" danger style={{ background: '#ff4d4f', color: '#fff' }}>
					<Text style={{ color: '#fff' }}>Cancelar Factura</Text>
				</Button>
			</Row>
		</Modal>
	)
}

export default memo(ModalCancelTicket);
