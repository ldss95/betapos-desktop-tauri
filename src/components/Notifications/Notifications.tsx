import { useState, memo } from 'react';
import { Popover, Badge, Empty, Typography } from 'antd'
import { BellOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux';
import moment from 'moment'
import 'moment/locale/es-do'

import './Notifications.scss'
import { db } from '../../utils/firebase'

moment.locale('es-do')
const { Title, Text } = Typography

const Notifications = () => {
	const shopId = useSelector((state: any) => state.shop.id );
	const [notifications, setNotifications] = useState<any[]>([])
	const counter = notifications.filter((notification: any) => notification.status === 'DELIVERED').length

	const _delete = (event: any, id: string) => {
		event.preventDefault();
	}

	const NotificationsList = () => {
		if (notifications.length === 0) {
			return <Empty description="No hay notificaciones" />
		} else {
			return (
				<div id="notifications_box">
					{notifications.map((notification, index) =>
						<div
							key={'Notification-' + index}
							className='notification'
						>
							<div className="text">
								<Title level={4}>{notification.title}</Title>
								<Text>{notification.text}</Text>
								<br />
								<span className="date">{moment(notification.createdAt).fromNow()}</span>
							</div>

							<CloseCircleOutlined
								style={{
									fontSize: 26,
									color: '#f65058'
								}}
								onClick={(event) => _delete(event, notification.id)}
							/>
						</div>
					)}
				</div>
			)
		}
	}

	return (
		<Popover
			placement='bottomRight'
			content={<NotificationsList />}
		>
			<Badge count={counter}>
				<BellOutlined className="header-btn"/>
			</Badge>
		</Popover>
	);
}

export default memo(Notifications);
