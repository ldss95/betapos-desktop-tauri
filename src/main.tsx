import ReactDOM from 'react-dom/client'
import * as Sentry from '@sentry/react';
import { BrowserTracing } from "@sentry/tracing";
import 'sweetalert2/dist/sweetalert2.min.css';
import './main.scss';

import App from './App'
import { UnexpectedError } from './components';
const SENTRY_DNS = import.meta.env.VITE_SENTRY_DSN

Sentry.init({
	dsn: SENTRY_DNS,
	integrations: [new BrowserTracing()],
	environment: import.meta.env.MODE,
	tracesSampleRate: 1.0,
});

ReactDOM.createRoot(document.getElementById('root')!).render(
	<Sentry.ErrorBoundary fallback={<UnexpectedError />}>
		<App />
	</Sentry.ErrorBoundary>
)
