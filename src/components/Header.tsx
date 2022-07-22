import React, { useState, useEffect, useRef } from 'react';
import { Layout, Input, Typography, Button, Form, Space } from 'antd';
import { LeftOutlined, SearchOutlined, BarcodeOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import '../styles/Header.scss';
import http from '../http';
import { toggleMenu } from '../redux/actions/navbar';
import { addProductToCart } from '../redux/actions/cart';
import ModalSearch from './ModalSearch';
import ModalSelectProducts from './ModalProductSelector';

const { Header } = Layout;
const { Title, Text } = Typography;

interface CustomHeaderProps {
	main?: boolean;
	title?: string;
	createProduct?: any;
}
const CustomHeader = ({ main, title }: CustomHeaderProps) => {
	const dispatch = useDispatch();
	const { meta, userName } = useSelector((state: any) => ({
		meta: state.meta,
		userName: state.session.firstName + ' ' + state.session.lastName
	}))
	const navigate = useNavigate();
	const [form] = Form.useForm();

	const [modalSearch, setModalSearch] = useState({ visible: false, input: '' });
	const [products, setProducts] = useState([]);
	const [barcode, setBarcode] = useState('');

	const barcodeRef = useRef(barcode);

	useEffect(() => {
		document.addEventListener('keydown', (event) => {
			if (main && event.code === 'F3') {
				event.preventDefault();
				setModalSearch({ visible: true, input: '' });
			}
		});
		
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		barcodeRef.current = barcode;
	}, [barcode]);

	useEffect(() => {
		document.addEventListener('keydown', handleKeyDown);
		console.log('Adding event listener');
		return () => {
			document.removeEventListener('keydown', handleKeyDown)
		}
	}, [modalSearch])

	const handleKeyDown = (event: KeyboardEvent) => {
		const { keyCode } = event;
		if (modalSearch.visible) {
			return;
		}

		// Si hay algun elemento enfocado no tomar entrada como barcode
		const focusedElement = document.querySelector(':focus');
		if (focusedElement) {
			return;
		}

		// Descarga caracteres que no sen A-Z o 0-9
		if (keyCode !== 13 && keyCode !== 8 && (keyCode < 32 || keyCode > 105)) {
			return;
		}

		const barcode = barcodeRef.current;

		if (keyCode === 13) {
			return handleBarcodeInput();
		}

		if (keyCode === 8) {
			event.preventDefault();
			return setBarcode(barcode.substring(0, barcode.length - 1));
		}

		if (keyCode >= 32 && keyCode <= 126) {
			event.preventDefault();
			return setBarcode(`${barcode}${event.key}`);
		}
	}

	const handleBarcodeInput = () => {
		const barcode = barcodeRef.current;
		setBarcode('');
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
		if (!product.price && barcode != '999') {
			return Swal.fire(
				'Oops!',
				'Este producto no puede ser facturado porque no tiene precio',
				'warning'
			);
		}

		if (barcode === '999') {
			do {
				const { value, isDismissed } = await Swal.fire({
					title: 'Precio Producto Generico',
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

					<div
						style={{
							height: 40,
							minWidth: 200,
							border: 'solid 1px #ccc',
							borderRadius: 5,
							display: 'flex',
							alignItems: 'center',
							paddingLeft: 5,
							paddingRight: 5,
							overflow: 'hidden'
						}}
					>
						<BarcodeOutlined style={{ marginRight: 10, fontSize: 24 }} />
						<Text style={{ margin: 0 }}>{barcode}</Text>
					</div>

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
				close={async () => setModalSearch({ visible: false, input: '' })}
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
