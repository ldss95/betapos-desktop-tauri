import { memo } from 'react';
import { Typography, InputNumber, Avatar } from 'antd';
import {
	MinusOutlined,
	DeleteOutlined,
	PlusOutlined
} from '@ant-design/icons';
import { FaBalanceScaleRight } from 'react-icons/fa';
import { useDispatch } from 'react-redux';

import '../styles/Product.scss';
import {
	removeProductFromCart,
	increase,
	decrease,
	setQuantity,
	showQtyCalculator
} from '../redux/actions/cart';
import { avoidNotNumerics, format } from '../helper';
import RenderIf from './RenderIf';

const { Title, Text } = Typography;

interface ProductProps {
	id: string;
	name: string;
	barcode: string;
	imageUrl: string;
	price: number;
	isFractionable: boolean;
	quantity: number;
	index: number;
	no: number;
}
const Product = ({ id, name, barcode, price, imageUrl, quantity, index, isFractionable, no }: ProductProps) => {
	const dispatch = useDispatch();

	return (
		<div className="product">
			<div
				style={{
					height: 30,
					borderBottomRightRadius: 10,
					paddingLeft: 5,
					paddingRight: 5,
					background: '#cdcdcd',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					position: 'absolute'
				}}
			>
				<span style={{ fontSize: 18 }}>
					#{no}
				</span>
			</div>
			<div className="content">
				<Avatar size={60} style={{ marginTop: 10 }} src={imageUrl} />

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
						onKeyDown={(event) => avoidNotNumerics(event, isFractionable ? 4 : 0)}
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
					<RenderIf condition={isFractionable}>
						<div className="quantity-controls">
							<div className="btn" onClick={() => dispatch(showQtyCalculator(id))}>
								<FaBalanceScaleRight style={{ fontSize: 16 }} />
							</div>
						</div>
					</RenderIf>
					<RenderIf condition={!isFractionable}>
						<div className="quantity-controls">
							<div className="btn" style={{ opacity: 0, cursor: 'default' }}>
								<FaBalanceScaleRight style={{ fontSize: 16 }} />
							</div>
						</div>
					</RenderIf>
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
