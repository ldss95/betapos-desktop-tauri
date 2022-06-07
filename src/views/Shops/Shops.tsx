import { useState, useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Button, Typography, Spin, Space } from 'antd';
import { ShopOutlined, LoadingOutlined } from '@ant-design/icons';
import { useNavigate, NavLink, useLocation } from 'react-router-dom';
import axios from 'axios';

import './Shops.scss';
import { setShop } from '../../redux/actions/shop';

const { Title } = Typography;

const API_URL = import.meta.env.REACT_APP_API_URL;
const BACKEND_URL = import.meta.env.REACT_APP_BACKEND_URL;

const Shops = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const dispatch = useDispatch();
	const selectedShop = useSelector((state: any) => state.shop);

	const [shops, setShops] = useState([]);
	const [loading, setLoading] = useState(false);
	const [loadingMessage, setLoadingMessage] = useState('Cargando');
	const [error, setError] = useState<any>(false);
	const [isChange, setIsChange] = useState(false);

	useEffect(() => {
		if (location.search.includes('change=true')) {
			setIsChange(true);
		}

		if (!navigator.onLine) {
			setError({
				title: 'No hay conexion a internet.',
				text:
					'Para el primer inicio o cambio de sucursal se necesita conexion a internet.'
			});

			window.addEventListener('online', () => {
				setError(false);
			});

			return;
		}

		setLoading(true);
		axios
			.get(API_URL + '/shops')
			.then((res) => {
				setLoading(false);
				const { data } = res;
				setShops(data.filter((shop: any) => shop.id !== 0));
			})
			.catch(() => {
				setLoading(false);
				setError({
					title: 'Error desconocido.',
					text: 'No se ha podido obtener la lista de tiendas.'
				});
			});
		
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const selectShop = (shop: any) => {
		dispatch(
			setShop({
				id: shop.id,
				prefix: shop.prefix,
				address: shop.address,
				name: shop.name
			})
		);
	};

	const getAndSetShopData = () => {
		setLoading(true);
		const url = `${BACKEND_URL}/settings/shop/${selectedShop.id}`;
		const server = new EventSource(url);

		server.onmessage = (event) => {
			const { data } = event;

			if (data === 'done') {
				server.close();
				navigate('/login');
				return;
			}

			if (data === 'error') {
				server.close();
				setError({
					title: 'Error desconocido!',
					text: ''
				});
				setLoading(false);
				dispatch(setShop({}))
				return;
			}

			setLoadingMessage(event.data);
		};
	};

	return (
		<Fragment>
			{loading && (
				<Row
					justify="center"
					align="middle"
					style={{ height: '100vh', flexDirection: 'column' }}
				>
					<Spin
						indicator={
							<LoadingOutlined style={{ fontSize: 150 }} />
						}
						style={{ marginBottom: 30 }}
					/>

					<Title level={3}>{loadingMessage}</Title>
				</Row>
			)}

			{!error && !loading && (
				<div id="shops_selector_container">
					<div>
						<Title>Seleccionar Tienda</Title>
						<br />

						<ul>
							{shops.map((shop: any) => (
								<li
									className={
										selectedShop.id === shop.id
											? 'active'
											: ''
									}
									key={shop.id}
									onClick={() => selectShop(shop)}
								>
									<ShopOutlined />
									<p>{shop.name}</p>
								</li>
							))}
						</ul>
					</div>

					<div id="buttons">
						<Space>
							{isChange && (
								<NavLink to="/main">
									<Button>Cancelar</Button>
								</NavLink>
							)}

							{selectedShop.id && (
								<Button
									type="primary"
									onClick={getAndSetShopData}
								>
									Continuar
								</Button>
							)}
						</Space>
					</div>
				</div>
			)}

			{error && !loading && (
				<Row
					justify="center"
					align="middle"
					style={{ height: '100vh', flexDirection: 'column' }}
				>
					<Title level={1} type="danger" style={{ fontSize: 54 }}>
						{error.title}
					</Title>
					<Title level={3}>{error.text}</Title>
				</Row>
			)}
		</Fragment>
	);
};

export default Shops;
