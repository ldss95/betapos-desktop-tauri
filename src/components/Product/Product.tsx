import { memo } from 'react';
import { Typography, InputNumber, Avatar } from 'antd';
import {
	CaretDownOutlined,
	CaretUpOutlined,
	CloseOutlined,
	FieldTimeOutlined
} from '@ant-design/icons';
import { useDispatch } from 'react-redux';

import './Product.scss';
import {
	removeProductFromCart,
	increase,
	decrease,
	setQuantity
} from '../../redux/actions/cart';
import { format } from '../../helper';

const { Title, Text } = Typography;

interface ProductProps {
	id: string;
	name: string;
	barcode: string;
	price: number;
	quantity: number;
	index: number;
}
const Product = ({ id, name, barcode, price, quantity, index }: ProductProps) => {
	const dispatch = useDispatch();

	return (
		<div className="product">
			<Avatar size={100} icon={<FieldTimeOutlined />} />

			<div className="description">
				<Title>{name.substr(0, 15)}</Title>
				<Text>{barcode}</Text>
			</div>
			<div className="price">
				<Text className="price-u">
					$ {format.cash(price)} /U
				</Text>
				<Text className="price-t">
					$ {format.cash(price * quantity)}
				</Text>
			</div>
			<div className="quantity">
				<CaretUpOutlined onClick={() => dispatch(increase(id))} />
				<InputNumber
					type="number"
					value={quantity}
					onPressEnter={(event: any) => {
						let quantity = Number(event.target.value) || 1;
						dispatch(setQuantity(id, quantity));
						const barcodeInput: any = document.querySelector('#barcode_input');
						barcodeInput?.focus()
					}}
					className="quantity-input"
				/>
				<CaretDownOutlined onClick={() => dispatch(decrease(id))} />
			</div>
			<div
				className="delete"
				onClick={() => dispatch(removeProductFromCart(index))}
			>
				<CloseOutlined />
			</div>
		</div>
	);
};

export default memo(Product);
