import { useObservable } from '@redactie/utils';
import { useEffect } from 'react';

import { fieldTypesFacade } from '../../store/fieldTypes';

import { UseActiveFieldType } from './useActiveFieldType.types';

const useActiveFieldType: UseActiveFieldType = (fieldTypeId?: string) => {
	useEffect(() => {
		if (fieldTypeId) {
			const hasFieldType = fieldTypesFacade.hasFieldType(fieldTypeId);

			if (hasFieldType && fieldTypesFacade.hasActiveFieldType(fieldTypeId)) {
				return;
			}

			if (!hasFieldType) {
				fieldTypesFacade
					.getFieldType(fieldTypeId)
					.then(() => fieldTypesFacade.setActiveFieldType(fieldTypeId));
				return;
			}

			fieldTypesFacade.setActiveFieldType(fieldTypeId);
			return;
		}
		// remove active fieldType when fieldTypeId is undefined
		fieldTypesFacade.removeActiveFieldType();
	}, [fieldTypeId]);

	const fieldType = useObservable(fieldTypesFacade.activeFieldType$);
	const fieldTypeUI = useObservable(fieldTypesFacade.activeFieldTypeUI$);

	return [fieldType, fieldTypeUI];
};

export default useActiveFieldType;
