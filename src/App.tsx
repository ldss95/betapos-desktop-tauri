import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import Router from './router'
import store from './redux/store';
import http from './http';
import 'antd/dist/antd.css';

window.addEventListener('online', () => {
	http.post('/sync');
});

function App() {
	return (
		<BrowserRouter>
			<Provider store={store}>
				<Router />
			</Provider>
		</BrowserRouter>
	);
}

export default App
