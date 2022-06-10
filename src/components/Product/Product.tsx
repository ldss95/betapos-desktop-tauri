import { memo } from 'react';
import { Typography, InputNumber, Avatar } from 'antd';
import {
	MinusOutlined,
	DeleteOutlined,
	PlusOutlined
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
	imageUrl: string;
	price: number;
	quantity: number;
	index: number;
}
const Product = ({ id, name, barcode, price, imageUrl, quantity, index }: ProductProps) => {
	const dispatch = useDispatch();

	return (
		<div className="product">
			<div className="content">
				<Avatar size={100} src={imageUrl} />

				<div className="description">
					<Title>{name.substr(0, 15)}</Title>
					<Text>{barcode}</Text>
				</div>
				
				<div className="quantity">
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
					<div className="quantity-controls">
						<div className="btn" onClick={() => dispatch(increase(id))}>
							<PlusOutlined style={{ fontSize: 16 }} />
						</div>
						<div className="btn"  onClick={() => dispatch(decrease(id))}>
							<MinusOutlined style={{ fontSize: 16 }} />
						</div>
					</div>
				</div>

				<div className="price">
					<Text className="price-u">
						$ {format.cash(price)} /U
					</Text>
					<Text className="price-t">
						$ {format.cash(price * quantity)}
					</Text>
				</div>
			</div>

			<div
				className="delete"
				onClick={() => dispatch(removeProductFromCart(index))}
			>
				<DeleteOutlined />
			</div>
		</div>
	);
};

export default memo(Product);
