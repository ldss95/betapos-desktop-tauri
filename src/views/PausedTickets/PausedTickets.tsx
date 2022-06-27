import { Layout, Row, Typography } from 'antd';
import { useSelector } from 'react-redux';

import { Header, PausedTicket } from '../../components';

const { Content } = Layout;
const { Title } = Typography;

const PausedTickets = () => {
	const paused = useSelector((state: any) => state.cart.paused);

	return (
		<Layout style={{ height: '100vh' }}>
			<Header title="Facturas en pausa" />

			<Content className="main">
				{!paused.length && (
					<Row
						justify="center"
						align="middle"
						style={{ height: 'calc(100vh - 160px)' }}
					>
						<Title level={1}>No hay facturas pausadas.</Title>
					</Row>
				)}

				{paused.map((ticket: any) => (
					<PausedTicket
						name={ticket.clientName}
						products={ticket.products.length}
						date={ticket.date}
						userName={ticket.userName}
						id={ticket.id}
					/>
				))}
			</Content>
		</Layout>
	);
};

export default PausedTickets;
