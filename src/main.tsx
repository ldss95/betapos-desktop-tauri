import ReactDOM from 'react-dom/client'
import * as Sentry from '@sentry/react';
import { BrowserTracing } from "@sentry/tracing";

import App from './App'
import UnexpectedError from './components/Error/Unexpected';
const SENTRY_DNS = import.meta.env.SENTRY_DSN

Sentry.init({
	dsn: SENTRY_DNS,
	integrations: [new BrowserTracing()],
	environment: import.meta.env.NODE_ENV,
	tracesSampleRate: 1.0,
});

ReactDOM.createRoot(document.getElementById('root')!).render(
	<Sentry.ErrorBoundary fallback={<UnexpectedError />}>
		<App />
	</Sentry.ErrorBoundary>
)
