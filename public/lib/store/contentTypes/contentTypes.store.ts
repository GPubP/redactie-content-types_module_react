import { EntityStore, StoreConfig } from '@datorama/akita';

import { ContentTypeModel, ContentTypesState, createInitialSitesState } from './contentTypes.model';

@StoreConfig({ name: 'contentTypes', idKey: 'uuid' })
export class ContentTypesStore extends EntityStore<ContentTypesState, ContentTypeModel> {
	constructor() {
		super(createInitialSitesState());
	}

	public setIsFetching(isFetching = false): void {
		this.update({
			isFetching,
		});
	}

	public setIsUpdating(isUpdating = false): void {
		this.update({
			isUpdating,
		});
	}

	public setIsCreating(isCreating = false): void {
		this.update({
			isCreating,
		});
	}

	public setIsActivating(isActivating = false): void {
		this.update({
			isActivating,
		});
	}
}

export const contentTypesStore = new ContentTypesStore();
