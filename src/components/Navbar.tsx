import { useState, useRef, memo } from 'react';
import { Drawer, Typography, Row, message } from 'antd';
import {
	UserOutlined,
	PoweroffOutlined,
	SettingOutlined,
	ShoppingCartOutlined,
	DollarOutlined,
	DownloadOutlined,
	UploadOutlined,
	CalculatorOutlined,
	DropboxOutlined,
	FileSearchOutlined
} from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';

import '../styles/Navbar.scss';
import { logOut } from '../redux/actions/session';
import { toggleMenu } from '../redux/actions/navbar';
import { ModalDiscount, ModalIO } from '.'
import http from '../http';
import ModalTickets from './ModalTickets';
import { focusBarcodeInput } from '../helper';

const { Title } = Typography;
const Navbar = () => {
	const subMenuBtn = useRef<any>();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { session, navbar } = useSelector((state: any) => ({
		session: state.session,
		navbar: state.navbar
	}));

	const [showSubMenu, setShowSubMenu] = useState(false);
	const [showModalDiscount, setShowModalDiscount] = useState(false);
	const [showModalTickets, setShowModalTickets] = useState(false);
	const [modalIO, setModalIO] = useState<any>({ visible: false });

	const handleLogout = () => {
		dispatch(toggleMenu());
		http.post('/auth/logout')
			.then(() => {
				dispatch(logOut());
				navigate('/login');
			})
			.catch(() => message.error('No se pudo cerrar la sesion'));
	};

	const handleClose = () => {
		focusBarcodeInput();
		dispatch(toggleMenu());
	};

	const toggleSubMenu = () => {
		setShowSubMenu(!showSubMenu);
		if (showSubMenu) {
			subMenuBtn?.current?.classList?.remove('active');
		} else {
			subMenuBtn?.current?.classList?.add('active');
		}
	};

	const name = () => {
		let out: string = '';
		const { firstName, lastName } = session;

		if (!firstName && !lastName) 
			return 'N/A';
		
		`${firstName} ${lastName}`.split(' ').forEach((name: string, index: number) => {
			if (index === 0) {
				out = name;
			} else if (name.replace(/ /g, ' ')) {
				out += ` ${name.charAt(0)}.`;
			}
		});

		return out;
	};

	return (
		<>
			<ModalDiscount
				visible={showModalDiscount}
				close={() => setShowModalDiscount(false)}
			/>

			<ModalIO
				{...modalIO}
				close={() => setModalIO({ visible: false })}
			/>

			<ModalTickets
				visible={showModalTickets}
				close={() => setShowModalTickets(false)}
			/>

			<Drawer
				className='_navbar'
				placement="left"
				onClose={handleClose}
				visible={navbar.isVisible}
				width={showSubMenu ? 661 : 310}
			>
				<Row justify="center">
					<div
						style={{
							width: 100,
							height: 100,
							borderRadius: 50,
							backgroundImage: `url(${session.photoUrl})`,
							backgroundSize: 'cover'
						}}
					/>
				</Row>
				<br />
				<Row justify="center">
					<Title level={3}>{name()}</Title>
				</Row>
				<br />

				<div id="menus">
					<ul className="left">
						<li>
							<NavLink to="/profile">
								<UserOutlined />
								Mi Perfil
							</NavLink>
						</li>
						<li>
							<span
								className="btn"
								onClick={toggleSubMenu}
								ref={subMenuBtn}
							>
								<ShoppingCartOutlined />
								Opciones de Caja
							</span>
						</li>
						<li className={(!session.shift) ? 'disabled': ''}>
							<NavLink
								to="/shift-end"
								onClick={event => {
									if(!session.shift){
										event.preventDefault();
									}
								}}
							>
								<CalculatorOutlined />
								Cierre de Caja
							</NavLink>
						</li>
						<li>
							<NavLink to="/products">
								<DropboxOutlined />
								Productos
							</NavLink>
						</li>
						{(session.role === 'ADMIN') &&
							<li>
								<NavLink to="/settings">
									<SettingOutlined />
								Configuraciones
							</NavLink>
							</li>
						}
						<li>
							<span className="btn" onClick={handleLogout}>
								<PoweroffOutlined />
								Cerrar Sesion
							</span>
						</li>
					</ul>

					{showSubMenu && (
						<>
							<span id="vertical_divider"></span>
							<ul>
								<li>
									<span
										className="btn"
										onClick={() => {
											setShowModalDiscount(true);
											handleClose();
											toggleSubMenu();
										}}
									>
										<DollarOutlined />
										Descuento
									</span>
								</li>
								<li>
									<span
										className="btn"
										onClick={() => {
											if (session.shift)
												setModalIO({
													visible: true,
													type: 'IN'
												})
										}}
									>
										<DownloadOutlined />
										Ingreso
									</span>
								</li>
								<li>
									<span
										className="btn"
										onClick={() => {
											if (session.shift)
												setModalIO({
													visible: true,
													type: 'OUT'
												})
										}}
									>
										<UploadOutlined />
										Egreso
									</span>
								</li>
								<li>
									<span
										className="btn"
										onClick={() => {
											setShowModalTickets(true);
											dispatch(toggleMenu());
										}}
									>
										<FileSearchOutlined />
										Facturas
									</span>
								</li>
							</ul>
						</>
					)}
				</div>
			</Drawer>
		</>
	);
};

export default memo(Navbar);
