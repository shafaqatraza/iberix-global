// Inlined token logic from @base44/sdk to avoid bundling the entire SDK
// in static (frontend-only) builds. The behavior is identical to the SDK's
// getAccessToken: reads from URL params, saves to localStorage, removes from URL.

const isNode = typeof window === 'undefined';

const isClearAccessTokenRequested = () =>
	!isNode && new URLSearchParams(window.location.search).get("clear_access_token") === 'true';

const clearStoredAccessToken = () => {
	window.localStorage.removeItem('base44_access_token');
	window.localStorage.removeItem('token');
}

const getAccessToken = () => {
	if (isNode) return null;
	try {
		const urlParams = new URLSearchParams(window.location.search);
		let token = urlParams.get('access_token');
		if (token) {
			localStorage.setItem('base44_access_token', token);
			urlParams.delete('access_token');
			const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '') + window.location.hash;
			window.history.replaceState(null, '', newUrl);
		}
		if (!token) {
			token = localStorage.getItem('base44_access_token');
		}
		return token;
	} catch {
		return null;
	}
};

const getAppParams = () => {
	if (isClearAccessTokenRequested()) {
		clearStoredAccessToken();
	}
	return {
		appId: import.meta.env.VITE_BASE44_APP_ID,
		token: getAccessToken(),
		functionsVersion: import.meta.env.VITE_BASE44_FUNCTIONS_VERSION,
		appBaseUrl: import.meta.env.VITE_BASE44_APP_BASE_URL,
	}
}

export const appParams = {
	...getAppParams()
}