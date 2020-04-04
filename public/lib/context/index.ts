import { createContext } from 'react';

interface TenantContextValue {
	tenantId: string;
}

export const TenantContext = createContext<TenantContextValue>({ tenantId: '' });
