import { memo } from 'react';
import { Modal, Form, InputNumber, Row, Button } from 'antd';
import { useDispatch } from 'react-redux';

import { setPrice } from '../redux/actions/cart';
import { avoidNotNumerics } from '../helper';

interface ModalProductPriceProps {
	visible: boolean;
	index: number;
	close: () => void;
}
const ModalProductPrice = ({ visible, index, close }: ModalProductPriceProps) => {
	const dispatch = useDispatch();

	function savePrice({ price }: any) {
		dispatch(setPrice(index, price));
		close();
	}

	return (
		<Modal
			visible={visible}
			onCancel={close}
			width={300}
			footer={null}
			title='Cambiar Precio'
			destroyOnClose
		>
			<Form layout='vertical' onFinish={savePrice}>
				<Form.Item label='Nuevo Precio' name='price'>
					<InputNumber
						min={1}
						onKeyDown={avoidNotNumerics}
						autoFocus
					/>
				</Form.Item>

				<Row justify='center'>
					<Button type='primary' htmlType='submit'>Guardar</Button>
				</Row>
			</Form>
		</Modal>
	)
}

export default memo(ModalProductPrice);