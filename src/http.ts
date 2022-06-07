import axios from 'axios';

import store from './redux/store'
import { logOut } from './redux/actions/session';

const state = store.getState()

const http = axios.create({
	baseURL: import.meta.env.VITE_BACKEND_URL,
	withCredentials: true
});

http.interceptors.request.use(
	(config) => {
		if (!state) return config;

		const { token } = state.session;
		if (!token) return config;

		config.headers['Authorization'] = `Bearer ${token}`;
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

http.interceptors.response.use(
	(res) => res,
	(error) => {
		const path = localStorage.getItem('path');
		const forbiden = (error.response.status === 403)
		const unauthorized = (error.response.status === 401)
		const invalidToken = (error.response.data === 'Token invalido')
		const validPaths = ['/login', '/', '/cash-check']
		const { url } = error.config

		if (((unauthorized && url !== '/auth/authorize') || (forbiden && invalidToken)) && !validPaths.includes(path)) {
			store.dispatch(logOut());

			const url = window.location.href
			const sharpIndex = url.indexOf('#')
			const filePath = url.substr(0, sharpIndex)

			window.location.assign(filePath + '#/login')
		} else return Promise.reject(error);
	}
);

export default http;
