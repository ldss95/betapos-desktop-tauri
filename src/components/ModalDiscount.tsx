import { useState, useEffect, memo } from 'react';
import {
	Row,
	Modal,
	Form,
	Input,
	InputNumber,
	Button,
	Typography,
	Space
} from 'antd';
import { DollarOutlined, PercentageOutlined, LockOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2'

import '../styles/ModalDiscount.scss';
import { setDiscount } from '../redux/actions/cart';
import http from '../http'
import { focusBarcodeInput } from '../helper';

const { Text } = Typography;

interface ModalDiscountProps {
	visible: boolean;
	close: () => void;
}
const ModalDiscount = ({ visible, close }: ModalDiscountProps) => {
	const dispatch = useDispatch();
	const { actualDiscount, products } = useSelector((state: any) => ({
		actualDiscount: state.cart.discount,
		products: state.cart.products
	}));

	const [loading, setLoading] = useState(false)
	const [type, setType] = useState('amount');
	const [discount, setTmpDiscount] = useState(0)
	const [error, setError] = useState<any>(null);
	const [step, setStep] = useState('discount')

	useEffect(() => {
		if (!visible) {
			setLoading(false)
			setType('amount')
			setTmpDiscount(0)
			setError(null)
			setStep('discount')
		}
	}, [visible])

	const handleDiscount = ({ discount }: any) => {
		if (products.length === 0) {
			Swal.fire(
				'Oops!',
				'No se puede establecer descuento sin productos en la lista.',
				'warning'
			).then(() =>  {
				focusBarcodeInput();
			})
			return close()
		}

		const total = products.reduce((total: number, { price, quantity }: any) => total + (price * quantity), 0)
		if (type === 'percent') {
			discount = (total / 100) * discount;
		}

		if (discount > total) {
			Swal.fire(
				'Oops!',
				'El descuento no puede ser mayor al total de la factura.',
				'warning'
			)
			return
		}

		setStep('authorization')
		setTmpDiscount(discount)
	}

	const handleAuthorization = (form: any) => {
		setLoading(true)
		http.post('/auth/authorize', form)
			.then(() => {
				setLoading(false)
				setError(null)
				dispatch(setDiscount(discount));
				close();
				focusBarcodeInput();
			}).catch(error => {
				setLoading(false)

				const { status, data } = error.response
				switch (status) {
					case 401:
						setError(data);
						break;
					case 403:
						Swal.fire('Oops!', 'No cuentas con provilegios suficientes.', 'warning')
						break;
					default:
						Swal.fire(
							'Error',
							'No hemos podido completar tu solicitud, por favor intentalo mas tarde.',
							'error'
						);
						console.error(error)
						break;
				}
			})
	}

	const content = () => {
		if (step === 'discount') {
			return (
				<Form
					onFinish={handleDiscount}
					initialValues={{ discount: actualDiscount }}
				>
					<Row justify="center">
						<Space>
							<div
								className={`tile ${type === 'amount' && 'active'}`}
								onClick={() => setType('amount')}
							>
								<DollarOutlined />
								<Text>Monto</Text>
							</div>
							<div
								className={`tile ${type === 'percent' && 'active'}`}
								onClick={() => setType('percent')}
							>
								<PercentageOutlined />
								<Text>Porciento</Text>
							</div>
						</Space>
					</Row>
					<br />

					<Form.Item name="discount">
						<InputNumber
							formatter={(value: any) => value.replace(/[^0-9]/g, '')}
							autoFocus
						/>
					</Form.Item>
					<Space>
						<Button onClick={close}>Cancelar</Button>
						<Button type="primary" htmlType="submit">
							Continuar
						</Button>
					</Space>
				</Form>
			)
		}

		if (step === 'authorization') {
			return (
				<Form layout='vertical' onFinish={handleAuthorization}>
					<Row justify="center">
						<div className="lock-icon">
							<LockOutlined/>
						</div>
					</Row>
					<Row justify="center">
						<p>Autorizacion requerida.</p>
					</Row>
					<br />
					<br/>

					<Form.Item
						name='nickName'
						label='Nombre de usuario'
						rules={[{ required: true }]}
						validateStatus={
							error?.error && error?.error === 'Nick'
								? 'error'
								: ''
						}
						help={
							error?.error && error?.error === 'Nick'
								? error?.message
								: null
						}
					>
						<Input autoFocus />
					</Form.Item>

					<Form.Item
						name='token'
						label='Token'
						rules={[{ required: true }]}
						validateStatus={
							error?.error && error?.error === 'Token'
								? 'error'
								: ''
						}
						help={
							error?.error && error?.error === 'Token'
								? error?.message
								: null
						}
					>
						<Input type='number' />
					</Form.Item>

					<Space>
						<Button onClick={close}>Cancelar</Button>
						<Button type="primary" htmlType="submit" loading={loading}>
							Continuar
						</Button>
					</Space>
				</Form>
			)
		}
	}

	return (
		<Modal
			visible={visible}
			onCancel={close}
			destroyOnClose
			footer={null}
			width={300}
			title='Descuento'
		>
			{content()}
		</Modal>
	);
};

export default memo(ModalDiscount);
