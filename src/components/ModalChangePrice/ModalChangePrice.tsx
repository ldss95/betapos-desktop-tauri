import { memo, useState } from 'react';
import { Form, Button, Space, Row, Divider, Input, InputNumber, Modal } from 'antd'
import Swal from 'sweetalert2'
import { useDispatch, useSelector } from 'react-redux'

import http from '../../http'

const API_URL = import.meta.env.REACT_APP_API_URL

interface ModalChangePriceProps {
	visible: boolean;
	close: () => void;
	id: number;
	name: string;
	price: number;
	fetchProducts: () => void;
	setPrice?: any;
}
const ModalChangePrice = ({ visible, close, id, name, price, fetchProducts, setPrice }: ModalChangePriceProps) => {
	const dispatch = useDispatch();
	const shopId = useSelector((state: any) => state.shop?.id)
	
	const [loading, setLoading] = useState(false)

	const saveNewPrice = async (form: any) => {
		try {
			const { price, nickName, token } = form
			setLoading(true)

			await http.post('/auth/authorize', { nickName, token })
			await http.put(`/products/${id}`, { price })
			
			if (fetchProducts)
				fetchProducts()
			
			if (setPrice)
				dispatch(setPrice(id, price))

			const { isConfirmed } = await Swal.fire({
				title: 'Precio Actualizado',
				icon: 'success',
				text: 'Actualizas en las otras tiendas?',
				confirmButtonText: 'Si, actualizar.',
				showCancelButton: true,
				cancelButtonText: 'No'
			})
			
			if (isConfirmed) {
				await http.put(API_URL + '/prices-and-stock', {
					productId: id,
					price,
					name: name,
					updateProduct: true
				})
			} else {
				await http.put(`${API_URL}/prices-and-stock/${shopId}`, {
					productId: id,
					price
				})
			}
			
			setLoading(false)
			close()

			await Swal.fire('Precio Actualizado', '', 'success')
			const barcodeInput: any = document.querySelector('#barcode_input')
			barcodeInput.focus()
		} catch (error: any) {
			setLoading(false)
			if (error?.response?.status === 401)
				return Swal.fire(
					'Oops!',
					error?.response?.data?.message,
					'warning'
				)
			
			if(error?.response?.status === 403)
				return Swal.fire(
					'No autorizado',
					'El cambio de precio debe ser autorizado por un administrador',
					'error'
				)

			Swal.fire('Error', 'No se ha podido actualizar el precio del producto', 'error')
			console.error(error)
		}
	}

	const handlePriceInputEnter = (event: any) => {
		event.preventDefault();
		const usernameInput: any = document.querySelector('#username_input');
		usernameInput.focus();
	}

	const handleUsernameInputEnter = (event: any) => {
		event.preventDefault();
		const tokenInput: any = document.querySelector('#token_input');
		tokenInput.focus();
	}

	return (
		<Modal
			title={`${name} (${price})`}
			visible={visible}
			onCancel={close}
			footer={null}
			width={300}
		>
			<Form layout='vertical' onFinish={saveNewPrice}>
				<Form.Item
					label='Nuevo Precio'
					name='price'
					rules={[{ required: true }]}
				>
					<InputNumber
						formatter={(value: any) => value.replace(/[^0-9]/g, '')}
						autoFocus
						onPressEnter={handlePriceInputEnter}
					/>
				</Form.Item>
				
				<Form.Item
					label='Nombre de Usuario'
					name='nickName'
					rules={[{ required: true }]}
				>
					<Input
						onPressEnter={handleUsernameInputEnter} 
						id='username_input'
					/>
				</Form.Item>

				<Form.Item
					label='Token'
					name='token'
					rules={[{ required: true }]}
				>
					<Input id='token_input' maxLength={6} />
				</Form.Item>
				<Divider/>

				<Row justify='end'>
					<Space>
						<Button onClick={close}>Cerrar</Button>
						<Button
							type='primary'
							htmlType='submit'
							loading={loading}
						>
							Guardar
						</Button>
					</Space>
				</Row>
			</Form>
		</Modal>
	);
}

export default memo(ModalChangePrice);
