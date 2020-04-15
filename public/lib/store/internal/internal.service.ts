import { ContentTypeFieldSchema } from '../../services/contentTypes';

import { internalStore, InternalStore } from './internal.store';

export class InternalService {
	constructor(private store: InternalStore) {}

	public updateActiveField(activeField: ContentTypeFieldSchema): void {
		this.store.update({ activeField });
	}

	public updateFields(fields: ContentTypeFieldSchema[]): void {
		this.store.update({ fields });
	}
}

export const internalService = new InternalService(internalStore);
