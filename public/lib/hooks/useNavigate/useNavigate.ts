import * as H from 'history';
import { stringify } from 'query-string';
import { useContext } from 'react';
import { generatePath, useHistory } from 'react-router-dom';

import { TenantContext } from '../../context';

type Params = { [paramName: string]: string | number | boolean | undefined };
type Query = { [paramName: string]: string | number | boolean | undefined };
type GenerateFn = (path: string, params?: Params, query?: URLSearchParams) => string;
type NavigateFn = (
	path: string,
	params?: Params,
	state?: H.LocationState,
	query?: URLSearchParams
) => void;

const useNavigate = (): { generatePath: GenerateFn; navigate: NavigateFn } => {
	const { tenantId } = useContext(TenantContext);
	const history = useHistory();

	const convertQueryToString = (query?: URLSearchParams | Query): string =>
		query instanceof URLSearchParams
			? `?${stringify(Object.fromEntries(query))}`
			: `?${query ? stringify(query) : ''}`;

	const generate = (path: string, params?: Params, query?: URLSearchParams | Query): string =>
		generatePath(`/${tenantId}${path}${convertQueryToString(query)}`, params);
	const navigate = (
		path: string,
		params?: Params,
		state?: H.LocationState,
		query?: URLSearchParams
	): void => history.push(generate(path, params, query), state);

	return {
		generatePath: generate,
		navigate,
	};
};

export default useNavigate;
