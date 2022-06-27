import { memo } from 'react';
import { Modal, Form, InputNumber, Row, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import { hideQtyCalculagor } from '../../redux/actions/cart';
import { setQuantity } from '../../redux/actions/cart';
import { avoidNotNumerics } from '../../helper';

interface ModalProductQtyProps {
	visible: boolean;
	productId: string;
}
const ModalProductQty = ({ visible, productId }: ModalProductQtyProps) => {
	const dispatch = useDispatch();
	const cart = useSelector((state: any) => state.cart);

	function saveQuantity({ price }: any) {
		const product = cart.products.find((product: any) => product.id === productId);
		let quantity = price / product.price;

		// Previene mas 4 decimales
		const decimals = `${quantity % 1}`.substring(2);
		if (decimals.length > 4) {
			quantity = Math.round(quantity * 10000) / 10000;
		}

		dispatch(setQuantity(productId, quantity));
		dispatch(hideQtyCalculagor());
	}

	return (
		<Modal
			visible={visible}
			onCancel={() => dispatch(hideQtyCalculagor())}
			width={300}
			footer={null}
			title='Calcular cantidad'
			destroyOnClose
		>
			<Form layout='vertical' onFinish={saveQuantity}>
				<Form.Item label='Monto final' name='price'>
					<InputNumber
						min={1}
						onKeyDown={avoidNotNumerics}
						autoFocus
					/>
				</Form.Item>

				<Row justify='center'>
					<Button type='primary' htmlType='submit'>Aplicar</Button>
				</Row>
			</Form>
		</Modal>
	)
}

export default memo(ModalProductQty);