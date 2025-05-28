// src/routes/+layout.ts
import type { LayoutLoad } from './$types';
import { load as pageLoad } from './+page';
import { dev } from '$app/environment';
import { injectAnalytics } from '@vercel/analytics/sveltekit';

injectAnalytics({ mode: dev ? 'development' : 'production' });

export const load: LayoutLoad = async (event) => {
	// reuse the +page.ts load function for shared data
	const data = await pageLoad(event);

	let primaryColor: string;
	let ghostColor: string;
	switch (event.url.pathname) {
		case '/':
			primaryColor = 'var(--yellow)';
			ghostColor = 'var()';
			break;
		case '/total':
			primaryColor = 'var(--turquoise)';
			ghostColor = 'var(--turquoise-burnt)';
			break;
		case '/big-days':
			primaryColor = 'var(--watermelon)';
			ghostColor = 'var(--watermelon-burnt)';
			break;
		default:
			primaryColor = data.primaryColor || 'var(--yellow)'; // fallback
			ghostColor = data.ghostColor || 'var(--yellow-burnt)';
	}

	return {
		...data,
		primaryColor,
		ghostColor
	};
};
