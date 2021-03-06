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

		// @ts-ignore
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
		const path = localStorage.getItem('path') || '';
		const forbiden = (error.response.status === 403)
		const unauthorized = (error.response.status === 401)
		const invalidToken = (error.response.data === 'Token invalido')
		const validPaths = ['/login', '/']
		const { url } = error.config

		if (((unauthorized && url !== '/auth/authorize') || (forbiden && invalidToken)) && !validPaths.includes(path)) {
			store.dispatch(logOut());

			window.location.href = '/login'
		} else return Promise.reject(error);
	}
);

export default http;
