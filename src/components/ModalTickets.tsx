import { memo, useState, useEffect } from 'react';
import {
	Modal,
	Table,
	Button,
	Menu,
	Dropdown,
	Tag,
	Typography,
	Input
} from 'antd';
import {
	EllipsisOutlined,
	SettingOutlined,
	PrinterOutlined,
	WarningOutlined,
	DollarOutlined,
	CreditCardOutlined,
	ClockCircleOutlined
} from '@ant-design/icons'
import { GrMultiple } from 'react-icons/gr';
import Swal from 'sweetalert2';
import { useSelector, useDispatch } from 'react-redux';

import http from '../http';
import moment from 'moment';
import { format } from '../helper';
import { ClientProps, TicketProps } from '../utils/interfaces';
import { setCancelTicketId, showCancelTicket } from '../redux/actions/common'

const { Text } = Typography;

interface ModalCTicketsProps {
	visible: boolean;
	close: () => void;
}

function ModalTickets({ visible, close }: ModalCTicketsProps) {
	const dispatch = useDispatch();
	const shiftId = useSelector(({ session }: any) => session?.shift?.id);

	const [tickets, setTickets] = useState<TicketProps[]>([]);
	const [loading, setLoading] = useState(false);
	const [paymentTypes, setPaymentTypes] = useState([]);
	const [search, setSearch] = useState('');

	useEffect(() => {
		fetchPaymentTypes();
	}, []);

	useEffect(() => {
		if (visible) {
			fetchTickets();
		}
	}, [visible]);

	async function fetchTickets(){
		try {
			setLoading(true);
			const { data } = await http.get('/tickets', {
				params: { shiftId }
			});
			setTickets(data);
		} catch (error) {
			Swal.fire({}
				)
		} finally {
			setLoading(false);
		}
	}

	function fetchPaymentTypes() {
		http.get('/payment-types')
			.then(({ data }) => setPaymentTypes(data))
			.catch(error => console.log(error))
	}

	function filteredTickets() {
		if (search == '') {
			return tickets;
		}

		return tickets.filter(({ ticketNumber, client, amount }) => 
			ticketNumber.toString().padStart(8, '0').includes(search) ||
			(client && client.name.toLowerCase().includes(search.toLowerCase())) ||
			amount == Number(search)
		)
	}

	return (
		<Modal
			visible={visible}
			onCancel={close}
			footer={null}
			title='Tus Ventas'
			width={900}
			maskClosable={false}
		>
			<Input
				style={{ width: 200 }}
				placeholder='Buscar'
				onChange={({ target }) => setSearch(target.value)}
				autoFocus
			/>
			<br />
			<br />

			<Table
				dataSource={filteredTickets()}
				pagination={false}
				loading={loading}
				rowKey={({ id }) => 'ticket-' + id}
				columns={[
					{
						title: 'Nro. Factura',
						dataIndex: 'ticketNumber',
						render: (ticketNumber: number) => ticketNumber.toString().padStart(8, '0'),
						sorter: (a: TicketProps, b: TicketProps) => Number(a.ticketNumber) - Number(b.ticketNumber)
					},
					{
						title: 'Cliente',
						dataIndex: 'client',
						render: (client: ClientProps) => {
							if (client) {
								return client.name
							}

							return 'N/A';
						}
					},
					{
						title: 'Monto',
						dataIndex: 'amount',
						render: (amount: number) => `$ ${format.cash(amount)}`,
						sorter: (a: TicketProps, b: TicketProps) => a.amount - b.amount
					},
					{
						title: 'Hora',
						dataIndex: 'createdAt',
						render: (createdAt: string) => moment(createdAt).format('hh:mm A'),
						sorter: (a: TicketProps, b: TicketProps) => moment(a.createdAt).toDate().getTime() - moment(b.createdAt).toDate().getTime()
					},
					{
						title: 'Pago',
						dataIndex: 'paymentType',
						filters: paymentTypes.map(({ name, id }) => ({ text: name, value: id })),
						onFilter: (value, { paymentTypeId }) => paymentTypeId === value,
						render: ({ name }) => {
							const icon: any = {
								'Efectivo': <DollarOutlined />,
								'Tarjeta': <CreditCardOutlined />,
								'Mixto': <GrMultiple />,
								'Fiao': <ClockCircleOutlined />
							};

							return (
								<>
									{icon[name]}

									<Text style={{ marginLeft: 10 }}>{name}</Text>
								</>
							)
						}
					},
					{
						title: 'Estado',
						dataIndex: 'status',
						filters: [
							{
								text: 'Guardada',
								value: 'DONE'
							},
							{
								text: 'Cancelada',
								value: 'CANCELLED'
							}
						],
						onFilter: (value, { status }) => status === value,
						render: (status: 'DONE' | 'CANCELED') => {
							if (status === 'DONE') {
								return <Tag color='success'>Guardada</Tag>
							}

							return <Tag color='error'>Cancelada</Tag>
						}
					},
					{
						title: <SettingOutlined />,
						align: 'center',
						render: ({ id }) => {
							return (
								<Dropdown
									overlay={
										<Menu
											items={[
												{
													label: 'Imprimir',
													onClick: () => http.post(`/tickets/print/${id}`),
													key: 'print',
													icon: <PrinterOutlined />
												},
												{
													label: 'Cancelar',
													onClick: () => {
														dispatch(setCancelTicketId(id));
														dispatch(showCancelTicket());
														close();
													},
													key: 'cancel',
													icon: <WarningOutlined />
												}
											]}
										/>
									}
								>
									<Button style={{ paddingTop: 0, paddingBottom: 0 }} size='small'>
										<EllipsisOutlined />
									</Button>
								</Dropdown>
								
							)
						}
					}
				]}
			/>
		</Modal>
	)
}

export default memo(ModalTickets);
