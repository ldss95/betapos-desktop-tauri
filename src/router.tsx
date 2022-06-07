import { useEffect } from 'react';
import { Routes, Route, HashRouter, useLocation } from 'react-router-dom';

import Login from './views/Login/Login';
import Main from './views/Main/Main';
import PausedTickets from './views/PausedTickets/PausedTickets';
import Profile from './views/Profile/Profile';
import Settings from './views/Settings/Settings';
import CashCheck from './views/CashCheck/CashCheck';
import CreditNote from './views/CreditNote/CreditNote';
import Products from './views/Products/Products';
import TFA from './views/Login/2FA'
import ShiftStart from './views/Login/ShiftStart'

const Router = () => {
	const location = useLocation();

	useEffect(() => {
		const path = location.hash.substr(1);
		localStorage.setItem('path', path);
		/*
			path will be used by axios interceptor to determinate location
			and decie if redirect
		*/
	});

	return (
		<Routes>
			<Route path={'/login'} element={<Login />} />
			<Route path={'/'} element={<Login />} />
			<Route path="/2FA" element={<TFA />} />
			<Route path="/shift-start" element={<ShiftStart />} />
			<Route path="/main" element={<Main />} />
			<Route path="/paused" element={<PausedTickets />} />
			<Route path="/profile" element={<Profile />} />
			<Route path="/settings" element={<Settings />} />
			<Route path="/products" element={<Products />} />
			<Route path={'/shift-end'} element={<CashCheck />} />
			<Route path={'/cash-check'} element={<CashCheck />} />
			<Route path="/credit-note" element={<CreditNote />} />
		</Routes>
	);
};

export default Router;
