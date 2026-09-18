const isNode = typeof window === 'undefined';

const isClearAccessTokenRequested = () =>
	!isNode && new URLSearchParams(window.location.search).get("clear_access_token") === 'true';

const clearStoredAccessToken = () => {
	window.localStorage.removeItem('base44_access_token');
	window.localStorage.removeItem('token');
};

const getToken = () => {
	if (!isNode && isClearAccessTokenRequested()) {
		clearStoredAccessToken();
	}
	return isNode ? null : localStorage.getItem('base44_access_token');
};

export const appParams = {
	token: getToken(),
};