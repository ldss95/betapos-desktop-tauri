import { memo } from 'react';
import { Typography } from 'antd';
import { DeleteOutlined, PlayCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import './PausedTicket.scss';
import { removePausedTicket, restartTicket } from '../../redux/actions/cart';

const { Title, Text } = Typography;

interface PausedTicketProps {
	id: number;
	name: string;
	products: any[];
	date: string;
	userName: string;
}
const PausedTicket = ({ id, name, products, date, userName }: PausedTicketProps) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	return (
		<div className="paused-ticket">
			<div className="name">
				<Title level={2}>{name}</Title>
			</div>

			<Text>{products} Productos</Text>
			<Text>{moment(date).format('DD MMM YYYY')}</Text>
			<Text>{moment(date).format('hh:mm A')}</Text>
			<Text>{userName}</Text>

			<div className="actions">
				<div className="btn">
					<PlayCircleOutlined
						onClick={() => {
							dispatch(restartTicket(id));
							navigate(-1);
						}}
					/>
				</div>

				<div
					className="btn"
					onClick={() => dispatch(removePausedTicket(id))}
				>
					<DeleteOutlined />
				</div>
			</div>
		</div>
	);
};

export default memo(PausedTicket);
