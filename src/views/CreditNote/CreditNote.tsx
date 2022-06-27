import { useState } from 'react';
import {
	Layout,
	Form,
	Row,
	Col,
	Button,
	Switch,
	Input,
	InputNumber,
	Typography,
	Checkbox
} from 'antd';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom'

import './CreditNote.scss'
import http from '../../http';
import { format } from '../../helper';
import { Header } from '../../components';
import Product from './Product'

const { Content } = Layout;
const { TextArea } = Input;
const { Title, Text } = Typography;

const CreditNote = () => {
	const navigate = useNavigate();

	const [returnProduct, setReturnProduct] = useState(false);
	const [ticket, setTicket] = useState<any>({})
	const [loading, setLoading] = useState(false)
	const [products, setProducts] = useState([])

	const getTicket = (event: any) => {
		const ticketNumber = event.target.value;

		if(ticketNumber)
			http.get(`/tickets/${ticketNumber}`)
				.then((res) => {
					setTicket(res.data)
					setProducts([])
				})
				.catch(error => {
					Swal.fire('Error', 'Se ha producido un error desconocido al obtener la lista de productos.', 'error')
					console.error(error)
				});
	};

	const selectAll = (event: any) => {
		const { checked } = event.target
		if(checked)
			setProducts(ticket.products.map((product: any) => ({
				quantity: product.quantity,
				productId: product.productId,
				price: product.price
			})))
		else
			setProducts([])
	}

	const handleSubmit = (form: any) => {
		if (!ticket.id) {
			Swal.fire('Oops!', 'Ingrese un numero de ticket valido', 'warning')
			return
		}

		if (returnProduct) {
			form.amount = amount()
		}

		if (form.amount > ticket.amount) {
			Swal.fire(
				'Oops!',
				`El monto de la nota de credito no puede ser superior al monto de la factura "${format.cash(ticket.amount)}"`,
				'warning'
			)
			return
		}

		setLoading(true)
		const data = {
			description: form.description,
			amount: form.amount,
			ticketId: ticket.id
		}

		http.post('/credit-notes', data)
			.then(() => {
				setLoading(false)
				Swal.fire('Listo', 'Nota de credito creada.', 'success')
				navigate(-1);
			}).catch(error => {
				setLoading(false)
				let message = 'Error desconocido'
				if (error.response && error.response.data)
					message = error.response.data.message

				Swal.fire('Error', message, 'error')
				console.error(error)
			})
	};

	const amount = () => products.reduce((acumulated: number, product: any) => acumulated + (product.quantity * product.price), 0)

	return (
		<Layout style={{ height: '100vh' }}>
			<Header title="Nota de Credito" />

			<Content className="main">
				<Form onFinish={handleSubmit} layout="vertical">
					<Row gutter={30}>
						<Col span={12}>
							<Row justify="center">
								<Title level={3}>Datos</Title>
							</Row>

							<Form.Item
								label="Factura"
								name="ticket"
								rules={[{ required: true }]}
							>
								<Input onChange={getTicket} />
							</Form.Item>

							<Form.Item
								label="Descripcion"
								name="description"
								rules={[{ required: true }]}
							>
								<TextArea />
							</Form.Item>

							{(!returnProduct) &&
								<Form.Item
									label="Monto"
									name="amount"
									rules={[{ required: true }]}
								>
									<InputNumber />
								</Form.Item>
							}

							<Form.Item label="Devolucion de articulo">
								<Switch
									onChange={(value) =>
										setReturnProduct(value)
									}
								/>
							</Form.Item>
						</Col>
						{returnProduct && (
							<Col span={12}>
								<Row justify="center">
									<Title level={3}>Productos</Title>
								</Row>

								<label htmlFor='select_all' style={{cursor: 'pointer'}}>
									<Checkbox
										onChange={(event) => selectAll(event)}
										id='select_all'
										style={{ marginRight: 10 }}
									/>
									Seleccionar Todos
								</label>
								<br />
								<br/>

								{ticket.products?.map((product: any) =>
									<Product
										key={product.id}
										data={product}
										products={products}
										setProducts={setProducts}
									/>
								)}

								<br />
								<br/>
								<div className='amount-tile'>
									<Text>Monto</Text>
									<Title level={3}>
										{format.cash(amount())}
									</Title>
								</div>
								<br />
								<br/>
							</Col>
						)}
					</Row>

					<Row justify="center">
						<Button type="primary" htmlType="submit" loading={loading}>
							Guardar
						</Button>
					</Row>
				</Form>
			</Content>
		</Layout>
	);
};

export default CreditNote;
