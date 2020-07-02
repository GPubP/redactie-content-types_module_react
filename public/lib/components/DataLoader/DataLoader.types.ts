import { ReactElement } from 'react';

import { LoadingState } from '../../contentTypes.types';

export interface DataLoaderProps {
	errorMessage?: string;
	loadingState: LoadingState;
	notFoundMessage?: string;
	render: () => ReactElement | null;
}
