import { memo, useRef, useEffect } from 'react';
import { Modal, Row, Typography, Divider, Button } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';

import { format } from '../helper';
import http from '../http';

const { Title, Text } = Typography;

interface ModalSummaryProps {
	visible: boolean;
	id: string;
	close: () => void;
	items: any[];
}
const ModalSummary = ({ visible, close, items, id }: ModalSummaryProps) => {
	const printBtnRef = useRef<any>(null);

	useEffect(() => {
		if (visible && printBtnRef.current) {
			printBtnRef.current?.focus();
		}

	}, [visible, printBtnRef]);

	function print() {
		http.post(`/tickets/print/${id}`)
	}

	return (
		<Modal
			visible={visible}
			onCancel={close}
			maskClosable={false}
			title="Resumen"
			width={600}
			footer={null}
			className="summary"
			destroyOnClose
		>
			<Row justify='center'>
				<Button
					icon={<PrinterOutlined />}
					ref={printBtnRef}
					onClick={print}
					autoFocus
				>
					Imprimir
				</Button>
			</Row>
			<Row justify="center">
				{items
					.filter(item => !item.main && item.amount)
					.map((item, index) => 
						<div className="summary-tile" key={`SI-${index}`}>
							<Title level={3} style={{ margin: 0 }}>{format.cash(item.amount)}</Title>
							<Text style={{ margin: 0 }}>{item.title}</Text>
						</div>
					)}
			</Row>
			<Divider />

			<Row justify="center">
				{items
					.filter(item => item.main)
					.map(item => 
						<div className={`summary-tile ${item.class}`} key='SIM'>
							<Title style={{ margin: 0 }}>{format.cash(item.amount)}</Title>
							<Text style={{ margin: 0 }}>{item.title}</Text>
						</div>
					)}
			</Row>
		</Modal>
	);
};

export default memo(ModalSummary);
