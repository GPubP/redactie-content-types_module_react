import { useEffect, useState } from 'react';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ContentTypeField } from './internal.model';
import { internalQuery } from './internal.query';

export const useActiveFieldFacade = (): ContentTypeField | null => {
	const [activeField, setActiveField] = useState<ContentTypeField | null>(null);

	useEffect(() => {
		const destroyed$: Subject<boolean> = new Subject<boolean>();

		internalQuery.activeField$.pipe(takeUntil(destroyed$)).subscribe(activeFieldSub => {
			if (activeFieldSub) {
				setActiveField(activeFieldSub);
			}
		});

		return () => {
			destroyed$.next(true);
			destroyed$.complete();
		};
	}, []);

	return activeField;
};

export const useFieldsFacade = (): ContentTypeField[] => {
	const [fields, setFields] = useState<ContentTypeField[]>([]);

	useEffect(() => {
		const destroyed$: Subject<boolean> = new Subject<boolean>();

		internalQuery.fields$.pipe(takeUntil(destroyed$)).subscribe(fieldsSub => {
			if (fieldsSub) {
				return setFields(fieldsSub);
			}
		});

		return () => {
			destroyed$.next(true);
			destroyed$.complete();
		};
	}, []);

	return fields;
};
