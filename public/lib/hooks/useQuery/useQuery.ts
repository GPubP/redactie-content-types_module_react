import { parse } from 'query-string';
import { useLocation } from 'react-router-dom';

const useQuery = <Q extends { [key: string]: string | undefined }>(): Q => {
	return parse(useLocation().search) as Q;
};

export default useQuery;
