import { TenantContext } from '@redactie/utils';
import * as H from 'history';
import { ParsedQuery, parseUrl, stringifyUrl } from 'query-string';
import { useContext } from 'react';
import { generatePath, useHistory } from 'react-router-dom';

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

	const combineUrlAndQuery = (url: string, query?: URLSearchParams | Query): string => {
		const { query: originalQuery, url: originalUrl } = parseUrl(url);
		const newQueryObject: ParsedQuery<string | number | boolean | undefined> = {
			...originalQuery,
			...(query instanceof URLSearchParams ? Object.fromEntries(query) : query),
		};

		return stringifyUrl({ url: originalUrl, query: newQueryObject as ParsedQuery<string> });
	};

	const generate = (path: string, params?: Params, query?: URLSearchParams | Query): string =>
		generatePath(combineUrlAndQuery(`/${tenantId}${path}`, query), params);
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
