import { useMemo } from 'react';

import { FieldType } from '../../services/fieldTypes';

import { UseNavItemMatcher } from './useNavitemMatcher.types';

const useNavItemMatcher: UseNavItemMatcher = (preset, fieldType) => {
	const navItemMatcher = useMemo(() => {
		return (preset?.data?.fields || []).reduce(
			(acc, field) => {
				acc.data.formSchema.fields = [
					...acc.data.formSchema.fields,
					...(field?.formSchema?.fields || []),
				];
				acc.data.validators = [...acc.data.validators, ...(field?.validators || [])];

				return acc;
			},
			({
				data: {
					formSchema: { fields: [...(fieldType?.data?.formSchema?.fields || [])] },
					validators: [
						...(fieldType?.data?.validators || []),
						...(preset?.data?.validators || []),
					],
					generalConfig: {
						...(fieldType?.data?.generalConfig ?? {}),
						...(preset?.data?.generalConfig ?? {}),
					},
				},
			} as unknown) as FieldType
		);
	}, [fieldType, preset]);

	return navItemMatcher;
};

export default useNavItemMatcher;
