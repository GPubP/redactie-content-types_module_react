import ky from 'ky';

export type KyInstance = typeof ky;

// Create ky instance with defaults
const api: KyInstance = ky.create({
	prefixUrl: '/v1/proxy/',
});

export default api;
