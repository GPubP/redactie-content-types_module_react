import { useObservable } from '@mindspace-io/react';

import { ContentTypeFieldDetailModel, contentTypesFacade } from '../../store/contentTypes';

const useActiveField = (): ContentTypeFieldDetailModel | null | undefined => {
	const [activeField] = useObservable(contentTypesFacade.activeField$, null);

	return activeField;
};

export default useActiveField;
