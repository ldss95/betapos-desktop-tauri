import React, { useState } from 'react';
import { Typography, InputNumber, Avatar } from 'antd';
import {
	CaretDownOutlined,
	CaretUpOutlined,
	CloseOutlined,
	FieldTimeOutlined
} from '@ant-design/icons';
import { useDispatch } from 'react-redux';

import './Product.scss';
import ModalChangePrice from '../ModalChangePrice/ModalChangePrice'
import {
	removeProductFromCart,
	increase,
	decrease,
	setQuantity,
	setPrice
} from '../../redux/actions/cart';
import { format } from '../../helper';

const { Title, Text } = Typography;

const Product = ({ id, name, barcode, price, quantity, index }) => {
	const dispatch = useDispatch();

	const [showChangePrice, setShowChangePrice] = useState(false)

	return (
		<div className="product">
			<Avatar size={100} icon={<FieldTimeOutlined />} />

			<div className="description">
				<Title>{name.substr(0, 15)}</Title>
				<Text>{barcode}</Text>
				<Text>#{id}</Text>
			</div>
			<div className="price">
				<Text
					className="price-u"
					onDoubleClick={() => setShowChangePrice(true)}
				>
					$ {format.cash(price)} /U
				</Text>
				<Text
					className="price-t"
					onDoubleClick={() => setShowChangePrice(true)}
				>
					$ {format.cash(price * quantity)}
				</Text>
			</div>
			<div className="quantity">
				<CaretUpOutlined onClick={() => dispatch(increase(id))} />
				<InputNumber
					type="number"
					value={quantity}
					onPressEnter={(event) => {
						let quantity = Number(event.target.value) || 1;
						dispatch(setQuantity(id, quantity));
						document.querySelector('#barcode_input').focus()
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

			<ModalChangePrice 
				visible={showChangePrice}
				close={() => setShowChangePrice(false)}
				name={name}
				price={price}
				setPrice={setPrice}
				id={id}
			/>
		</div>
	);
};

export default React.memo(Product);
