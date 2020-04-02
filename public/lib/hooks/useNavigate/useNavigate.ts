import * as H from 'history';
import { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import { TenantContext } from '../../../index';

type NavigateFn = (path: string, state?: H.LocationState) => void;

const useNavigate = (): NavigateFn => {
	const history = useHistory();
	const tenantId = useContext(TenantContext);

	return (path: string, state?: H.LocationState) => {
		history.push(`/${tenantId}${path}`, state);
	};
};

export default useNavigate;
