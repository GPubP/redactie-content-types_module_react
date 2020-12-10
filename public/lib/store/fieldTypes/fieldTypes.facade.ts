import { SearchParams } from '@redactie/sites-module/dist/public/lib/services/api';
import { Observable } from 'rxjs';

import { showAlert } from '../../helpers';
import { fieldTypesApiService, FieldTypesApiService } from '../../services/fieldTypes';

import {
	FieldTypeDetailModel,
	FieldTypeDetailUIModel,
	fieldTypesDetailQuery,
	FieldTypesDetailQuery,
	fieldTypesDetailStore,
	FieldTypesDetailStore,
} from './detail';
import { FIELD_TYPES_ALERT_MESSAGES } from './fieldTypes.alertMessages';
import { FIELD_TYPES_ALERT_CONTAINER_IDS } from './fieldTypes.const';
import { GetFieldTypePayloadOptions, GetFieldTypesPayloadOptions } from './fieldTypes.types';
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

	public getFieldTypes(
		searchParams?: SearchParams,
		options: GetFieldTypesPayloadOptions = {
			alertContainerId: FIELD_TYPES_ALERT_CONTAINER_IDS.fetch,
		}
	): void {
		const { isFetching } = this.listQuery.getValue();
		if (isFetching) {
			return;
		}

		this.listStore.setIsFetching(true);

		this.service
			.getFieldTypes(searchParams)
			.then(response => {
				if (response) {
					this.listStore.set(response.data);
					this.listStore.update({
						isFetching: false,
						error: null,
					});
				}
			})
			.catch(error => {
				showAlert(
					options.alertContainerId,
					'error',
					FIELD_TYPES_ALERT_MESSAGES.fetch.error
				);
				this.listStore.update({
					isFetching: false,
					error,
				});
			});
	}

	// DETAIL FUNCTIONS
	public setActiveFieldType(fieldTypeId: string): void {
		this.detailStore.setActive(fieldTypeId);
		this.detailStore.ui.setActive(fieldTypeId);
	}

	public removeActiveFieldType(): void {
		this.detailStore.setActive(null);
		this.detailStore.ui.setActive(null);
	}

	public hasActiveFieldType(fieldTypeId: string): boolean {
		return this.detailQuery.hasActive(fieldTypeId);
	}

	public hasFieldType(fieldTypeId: string): boolean {
		return this.detailQuery.hasEntity(fieldTypeId);
	}

	public getFieldType(fieldTypeId: string, options?: GetFieldTypePayloadOptions): Promise<void> {
		const defaultOptions = {
			alertContainerId: FIELD_TYPES_ALERT_CONTAINER_IDS.fetchOne,
			force: false,
		};
		const serviceOptions = {
			...defaultOptions,
			...options,
		};
		if (this.detailQuery.hasEntity(fieldTypeId) && !serviceOptions.force) {
			return Promise.resolve();
		}

		this.detailStore.setIsFetchingEntity(true, fieldTypeId);

		return this.service
			.getFieldType(fieldTypeId)
			.then(response => {
				if (response) {
					this.detailStore.upsert(response.uuid, response);
					this.detailStore.ui.upsert(response.uuid, { error: null, isFetching: false });
				}
			})
			.catch(error => {
				showAlert(
					serviceOptions.alertContainerId,
					'error',
					FIELD_TYPES_ALERT_MESSAGES.fetchOne.error
				);
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
