import { useState, memo } from 'react';
import {
	Modal,
	Form,
	Row,
	Col,
	Input,
	Typography,
	Button,
	Space,
	message
} from 'antd'
import axios from 'axios'
import Swal from 'sweetalert2'

const { Text } = Typography
const API_URL = import.meta.env.VITE_API_URL

interface ModalNewProductProps {
	visible: boolean
	barcode: string;
	hide: () => void;
}
const ModalNewProduct = ({ visible, barcode, hide }: ModalNewProductProps) => {
	const [creating, setCreating] = useState(false)

	const handleSubmit = (form: any) => {
		setCreating(true)
		const data = {
			...form,
			barcodes: [{
				barcode: form.barcode
			}]
		}

		if (form.name.charAt(0).replace(/[^a-zA-Z]/, '') === '') {
			Swal.fire(
				'Advertencia',
				'El nombre debe comenzar con un carater de tipo alfa (A-Z)',
				'warning'
			);
			return;
		}

		axios.post(API_URL + '/products', data)
			.then(() => {
				setCreating(false)
				hide()
			}).catch(error => {
				setCreating(false)
				let text = 'Error desconocido'
				if (error.response && error.response.status === 400) {
					text = error.response.data.message
				}

				message.error(text)
				console.error(error)
			})
	}

	return (
		<Modal
			visible={visible}
			title="Nuevo Producto"
			width={500}
			footer={null}
			onCancel={hide}
			destroyOnClose
		>
			<Text>
				El producto: <b>{barcode}</b> no fue encontrado.
				<br />
				Por favor, ingrese los datos para registrarlos.
			</Text>
			<br />
			<br/>
			
			<Form
				layout="vertical"
				initialValues={{ barcode }}
				onFinish={handleSubmit}
			>
				<Row gutter={15}>
					<Col span={12}>
						<Form.Item
							label="Nombre"
							name="name"
							rules={[{ required: true }]}
						>
							<Input autoFocus />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							label="Código de Barras"
							name="barcode"
							rules={[{required: true}]}
						>
							<Input
								onKeyPress={(event: any) => {
									const { value } = event.target
									
									if (value.length > 12) {
										event.preventDefault();
									}
								}}
								type='number'
								maxLength={13}
							/>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							label="Referencia"
							rules={[{required: true}]}
							name="reference"
						>
							<Input/>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							label="Precio"
							name="price"
							rules={[{required: true}]}
						>
							<Input type="number" />
						</Form.Item>
					</Col>
				</Row>
				<br />

				<Space align='end'>	
					<Button type='default' onClick={hide}>Cerrar</Button>	
					<Button
						type='primary'
						htmlType='submit'
						loading={creating}
					>Crear</Button>
				</Space>
			</Form>
		</Modal>
	);
}

export default memo(ModalNewProduct);
