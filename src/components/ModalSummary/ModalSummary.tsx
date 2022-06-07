import { memo } from 'react';
import { Modal, Row, Typography, Divider } from 'antd';

import { format } from '../../helper';

const { Title, Text } = Typography;

interface ModalSummaryProps {
	  visible: boolean;
	  close: () => void;
	  items: any[];
}
const ModalSummary = ({ visible, close, items }: ModalSummaryProps) => {
	return (
		<Modal
			visible={visible}
			onCancel={close}
			title="Resumen"
			width={600}
			footer={null}
			className="summary"
			destroyOnClose
		>
			<Row justify="center">
				{items.filter(item => !item.main).map((item, index) => 
					<div className="summary-tile" key={`SI-${index}`}>
						<Title level={3}>{format.cash(item.amount)}</Title>
						<Text>{item.title}</Text>
					</div>
				)}
			</Row>
			<Divider />

			<Row justify="center">
				{items.filter(item => item.main).map(item => 
					<div className={`summary-tile ${item.class}`} key='SIM'>
						<Title>{format.cash(item.amount)}</Title>
						<Text>{item.title}</Text>
					</div>
				)}
			</Row>
		</Modal>
	);
};

export default memo(ModalSummary);
