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
	const [loading, setLoading] = useState(false);
	const [deleting, setDeleting] = useState<string | null>(null);
	const [canceling, setCancelling] = useState(false);

	useEffect(() => {
		fetchData();
	}, [id])

	async function fetchData() {
		try {
			setLoading(true);
			const { data } = await http.get('/tickets/by-id/' + id);
			setTicket(data);
		} catch (error) {
			close();
			Swal.fire('Error', 'No se pudo obtener la informacion de la factura', 'error');
		} finally {
			setLoading(false);
		}
	}

	async function deleteProduct(id: string) {
		try {
			setDeleting(id);
			await http.delete('/tickets/product/' + id)
			Swal.fire('Listo', 'Producto eliminado', 'success')
			await fetchData();
		} catch (error) {
			Swal.fire('Error', 'No se pudo eliminar el producto', 'error');
			console.error(error);
		} finally {
			setDeleting(null)
		}
	}

	async function cancellTicket() {
		try {
			setCancelling(true);
			await http.delete('/tickets/' + id)
			Swal.fire('Listo', 'Factura cancelada', 'success')
			await fetchData();
		} catch (error) {
			Swal.fire('Error', 'No se pudo cancelar la factura', 'error');
			console.error(error);
		} finally {
			setCancelling(false);
		}
	}

	return (
		<Modal
			visible={visible}
			onCancel={close}
			title={'Factura #' + ticket?.ticketNumber?.toString().padStart(8, '0')}
			footer={null}
			maskClosable={false}
			bodyStyle={{ background: 'rgba(0, 0, 0, 0.05)' }}
		>

			{ticket?.products?.map(({ quantity, price, product, id }) => (
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
						<Button
							loading={deleting == id}
							onClick={() => deleteProduct(id)}
							danger
						>
							<DeleteOutlined style={{ color: '#ff4d4f' }} />
						</Button>
					</div>
				</div>
			))}
			<br />

			<Row justify='center'>
				<Button
					style={{ background: '#ff4d4f', color: '#fff' }}
					onClick={cancellTicket}
					loading={canceling}
					danger
				>
					<Text style={{ color: '#fff' }}>Cancelar Factura</Text>
				</Button>
			</Row>
		</Modal>
	)
}

export default memo(ModalCancelTicket);
