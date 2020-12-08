import { useObservable } from '@redactie/utils';
import { useEffect } from 'react';

import { fieldTypesFacade } from '../../store/fieldTypes';

import { UseActiveFieldType } from './useActiveFieldType.types';

const useActiveFieldType: UseActiveFieldType = (fieldTypeId?: string) => {
	useEffect(() => {
		if (fieldTypeId) {
			if (!fieldTypesFacade.hasActiveDetail(fieldTypeId)) {
				fieldTypesFacade.getFieldType(fieldTypeId);
			}
			fieldTypesFacade.setActiveDetail(fieldTypeId);
			return;
		}
		// remove active detail when presetId is undefined
		fieldTypesFacade.removeActiveDetail();
	}, [fieldTypeId]);

	const fieldType = useObservable(fieldTypesFacade.activeFieldType$);
	const fieldTypeUI = useObservable(fieldTypesFacade.activeFieldTypeUI$);

	return [fieldType, fieldTypeUI];
};

export default useActiveFieldType;
