import { useEffect, useState } from 'react';

import {
	FieldTypeDetailModel,
	FieldTypeDetailUIModel,
	fieldTypesFacade,
} from '../../store/fieldTypes';

import { UseFieldType } from './useFieldType.types';

const useFieldType: UseFieldType = (fieldTypeId?: string) => {
	const [fieldType, setFieldType] = useState<FieldTypeDetailModel>();
	const [fieldTypeUI, setFieldTypeUI] = useState<FieldTypeDetailUIModel>();
	useEffect(() => {
		if (!fieldTypeId) {
			return;
		}

		const hasFieldType = fieldTypesFacade.hasFieldType(fieldTypeId);

		if (!hasFieldType) {
			fieldTypesFacade.getFieldType(fieldTypeId);
		}

		const fieldTypeSubscription = fieldTypesFacade
			.selectFieldType(fieldTypeId)
			.subscribe(setFieldType);
		const fieldTypeUISubscription = fieldTypesFacade
			.selectFieldTypeUIState(fieldTypeId)
			.subscribe(setFieldTypeUI);

		return () => {
			fieldTypeSubscription.unsubscribe();
			fieldTypeUISubscription.unsubscribe();
		};
	}, [fieldTypeId]);

	return [fieldType, fieldTypeUI];
};

export default useFieldType;
