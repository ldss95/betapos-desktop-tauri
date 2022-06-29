import { memo } from 'react';
import { Modal, Form, InputNumber, Row, Button } from 'antd';
import Swal from 'sweetalert2';

import { avoidNotNumerics } from '../helper';

interface ModalMixedPaymentProps {
	visible: boolean;
	close: () => void;
	hasCredit?: boolean;
	onDone: (details: { cash: number; credit: number; card: number; }) => void;
	total: number;
}
const ModalMixedPayment = ({ visible, close, hasCredit, onDone, total }: ModalMixedPaymentProps) => {
	function handleSubmit({ cash, credit, card }: any) {
		if ((cash || 0) + (credit || 0) + (card || 0) != total) {
			return Swal.fire('Oops!', 'El total de los pagos debe ser igual a la factuar', 'warning');
		}

		onDone({ cash, credit, card });
		close();
	}

	return (
		<Modal
			visible={visible}
			width={300}
			title='Detalles de los pagos'
			onCancel={close}
			footer={null}
		>
			<Form layout='vertical' onFinish={handleSubmit}>
				<Form.Item label='Efectivo' name='cash'>
					<InputNumber autoFocus min={0} onKeyDown={avoidNotNumerics} />
				</Form.Item>

				<Form.Item label='Tarjeta' name='card'>
					<InputNumber min={0} onKeyDown={avoidNotNumerics} />
				</Form.Item>

				<Form.Item label='Fiao' name='credit'>
					<InputNumber disabled={!hasCredit} min={0} onKeyDown={avoidNotNumerics} />
				</Form.Item>

				<Row justify='center'>
					<Button type='primary' htmlType='submit'>
						Guardar
					</Button>
				</Row>
			</Form>
		</Modal>
	)
}

export default memo(ModalMixedPayment);