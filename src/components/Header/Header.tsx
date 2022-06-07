import React, { useState, useEffect } from 'react';
import { Layout, Input, Typography, Button, Form, Space, message } from 'antd';
import { LeftOutlined, SearchOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios'

import './Header.scss';
import http from '../../http';
import { toggleMenu } from '../../redux/actions/navbar';
import { addProductToCart } from '../../redux/actions/cart';
import ModalSearch from '../ModalSearch/ModalSearch';
import ModalSelectProducts from '../ModalProductSelector/ModalSelectProducts';

const { Header } = Layout;
const { Title } = Typography;
const API_URL = import.meta.env.VITE_API_URL

interface CustomHeaderProps {
	main?: boolean;
	title?: string;
	createProduct?: any;
}
const CustomHeader = ({ main, title }: CustomHeaderProps) => {
	const dispatch = useDispatch();
	const { meta, userName } = useSelector((state: any) => ({ meta: state.meta, userName: state.session.name}))
	const navigate = useNavigate();
	const [form] = Form.useForm();

	const [modalSearch, setModalSearch] = useState({ visible: false, input: '' });
	const [products, setProducts] = useState([])

	useEffect(() => {
		document.addEventListener('keydown', (event) => {
			if (main && event.code === 'F3') {
				event.preventDefault();
				setModalSearch({ visible: true, input: '' });
			}

			if (main && event.code === 'F9') {
				event.preventDefault();
				const input: any = document.querySelector('#barcode_input');
				input.focus();
			}
		});
		
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (!modalSearch.visible) {
			const input: any = document.querySelector('#barcode_input');
			if(input)
				input.focus();
		}
	}, [modalSearch.visible])

	const handleBarcodeInput = ({ barcode }: any) => {
		if (!barcode) {
			return;
		}
		
		if (barcode === '999' && !meta.allowToInvoiceGenericProduct) {
			Swal.fire('Oops!', 'Producto generico ha sido desabilitado por la administracion.', 'warning');
			return;
		}

		http.get(`/products/find/${encodeURI(barcode)}`)
			.then((res) => {
				form.resetFields();
				const { data } = res;

				if (data.length === 0) {
					setModalSearch({ visible: true, input: barcode });
					return
				}

				if (data.length > 1) {
					setProducts(data)
					return
				}

				addToCart(data[0], barcode)
			})
			.catch(() => {
				Swal.fire(
					'Error',
					'No se pudo obtener la informacion del producto',
					'error'
				);
			});
	};

	const addToCart = async (product: any, barcode = '') => {
		const priceless = !product.price

		if (barcode === '999' || barcode.toLowerCase() === 'r' || priceless) {
			let title;
			if (priceless)
				title = `Precio para: ${product.name}`
			else if (barcode === '999')
				title = 'Precio Producto Generico'
			else if (barcode.toLowerCase() === 'r')
				title = 'Monto Recarga'
					
			do {
				const { value, isDismissed } = await Swal.fire({
					title,
					input: 'number',
					showCancelButton: true,
					cancelButtonText: 'Cancelar',
					showConfirmButton: true,
					confirmButtonText: 'Guardar',
					allowOutsideClick: false
				})
						
				if (isDismissed)
					return

				product.price = Number(value)
			} while (!product.price)
					
			if (priceless && barcode !== '999' && barcode.toLocaleLowerCase() !== 'r') {
				const { price, id, name } = product
				axios.put(API_URL + '/prices-and-stock', { productId: id, price, name })
					.catch(error => {
						message.error('Error actualizando precios')
						console.error(error)
					})
			}
		}

		dispatch(addProductToCart(product));
	}

	const handleToggleMenu = () => {
		dispatch(toggleMenu());
	};

	return (
		<Header className={(main) ? 'main' : ''}>
			{main && (
				<div className="left">
					<div className="toggle-nav" onClick={handleToggleMenu}>
						<span></span>
						<span></span>
						<span></span>
					</div>

					<Form onFinish={handleBarcodeInput} form={form}>
						<Form.Item name="barcode" style={{ marginBottom: 0 }}>
							<Input
								placeholder="Código de barras:"
								id="barcode_input"
								autoFocus
							/>
						</Form.Item>
					</Form>

					<Button
						icon={<SearchOutlined />}
						onClick={() => setModalSearch({ visible: true, input: '' })}
					/>
				</div>
			)}

			{!main && (
				<div className="left">
					<LeftOutlined onClick={() => navigate(-1)} />
					<Title level={2}>{title}</Title>
				</div>
			)}

			<div>
				<Space>
					<Title level={4} id="username">{userName}</Title>
				</Space>
			</div>

			<ModalSearch
				visible={modalSearch.visible}
				close={() => setModalSearch({ visible: false, input: '' })}
				input={modalSearch.input}
			/>

			{/* Select product when barcode have more than one coincidence */}
			<ModalSelectProducts
				products={products}
				visible={products.length > 0}
				hide={() => setProducts([])}
				addToCart={addToCart}
			/>
		</Header>
	);
};

export default React.memo(CustomHeader);
