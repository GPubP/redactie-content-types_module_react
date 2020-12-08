import { Observable } from 'rxjs';

import { fieldTypesApiService, FieldTypesApiService } from '../../services/fieldTypes';

import {
	FieldTypeDetailModel,
	FieldTypeDetailUIModel,
	fieldTypesDetailQuery,
	FieldTypesDetailQuery,
	fieldTypesDetailStore,
	FieldTypesDetailStore,
} from './detail';
import {
	fieldTypesListQuery,
	FieldTypesListQuery,
	fieldTypesListStore,
	FieldTypesListStore,
} from './list';

export class FieldTypesFacade {
	constructor(
		protected listStore: FieldTypesListStore,
		protected listQuery: FieldTypesListQuery,
		protected detailStore: FieldTypesDetailStore,
		protected detailQuery: FieldTypesDetailQuery,
		protected service: FieldTypesApiService
	) {}

	// LIST STATES
	public readonly fieldTypes$ = this.listQuery.fieldTypes$;
	public readonly listError$ = this.listQuery.error$;
	public readonly isFetching$ = this.listQuery.isFetching$;

	// DETAIL STATES
	public readonly activeFieldType$ = this.detailQuery.selectActive<
		FieldTypeDetailModel
	>() as Observable<FieldTypeDetailModel>;
	public readonly activeFieldTypeUI$ = this.detailQuery.ui.selectActive<
		FieldTypeDetailUIModel
	>() as Observable<FieldTypeDetailUIModel>;

	public selectFieldTypeUIState(fieldTypeId: string): Observable<FieldTypeDetailUIModel> {
		return this.detailQuery.ui.selectEntity(fieldTypeId);
	}

	// LIST FUNCTIONS

	public getFieldTypes(): void {
		const { isFetching } = this.listQuery.getValue();
		if (isFetching) {
			return;
		}

		this.listStore.setIsFetching(true);

		this.service
			.getFieldTypes()
			.then(response => {
				if (response) {
					this.listStore.set(response.data);
				}
			})
			.catch(error => this.listStore.setError(error))
			.finally(() => this.listStore.setIsFetching(false));
	}

	// DETAIL FUNCTIONS
	public setActiveDetail(presetId: string): void {
		this.detailStore.setActive(presetId);
		this.detailStore.ui.setActive(presetId);
	}

	public removeActiveDetail(): void {
		this.detailStore.setActive(null);
		this.detailStore.ui.setActive(null);
	}

	public hasActiveDetail(presetId: string): boolean {
		return this.detailQuery.hasActive(presetId);
	}

	public getFieldType(fieldTypeId: string, force = false): void {
		if (this.detailQuery.hasEntity(fieldTypeId) && !force) {
			return;
		}

		this.detailStore.setIsFetchingEntity(true, fieldTypeId);

		this.service
			.getFieldType(fieldTypeId)
			.then(response => {
				if (response) {
					this.detailStore.upsert(response.uuid, response);
					this.detailStore.ui.upsert(response.uuid, { error: null, isFetching: false });
				}
			})
			.catch(error => {
				this.detailStore.ui.upsert(fieldTypeId, {
					error,
					isFetching: false,
				});
			});
	}
}

export const fieldTypesFacade = new FieldTypesFacade(
	fieldTypesListStore,
	fieldTypesListQuery,
	fieldTypesDetailStore,
	fieldTypesDetailQuery,
	fieldTypesApiService
);
