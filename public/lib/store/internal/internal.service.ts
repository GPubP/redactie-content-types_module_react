import { ContentTypeField } from './internal.model';
import { internalStore, InternalStore } from './internal.store';

export class InternalService {
	constructor(private store: InternalStore) {}

	public updateActiveField(activeField: ContentTypeField): void {
		this.store.update({ activeField });
	}

	public updateFields(fields: ContentTypeField[]): void {
		this.store.update({ fields });
	}
}

export const internalService = new InternalService(internalStore);
