import ky from 'ky';

// Create ky instance with defaults
const api: any = ky.create({
	prefixUrl: '/v1/proxy/content/',
});

export default api;
