import ky from 'ky';

// Create ky instance with defaults
const api: any = ky.create({
	prefixUrl: '/v1/proxy/content/api/1.0.0',
});

export default api;