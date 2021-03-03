import { SiteListModel, UpdateSitePayload } from '@redactie/sites-module';

export enum PaginatedSitesActionTypes {
	SET = 'Set paginated sites',
	UPDATE = 'Update paginated sites',
}

export type PaginatedSitesActions =
	| { type: PaginatedSitesActionTypes.SET; payload: SiteListModel[] }
	| { type: PaginatedSitesActionTypes.UPDATE; payload: UpdateSitePayload };

export const paginatedSitesReducer = (
	state: SiteListModel[],
	action: PaginatedSitesActions
): SiteListModel[] => {
	switch (action.type) {
		case PaginatedSitesActionTypes.SET:
			return action.payload;
		case PaginatedSitesActionTypes.UPDATE:
			return state.map(site => {
				const shouldUpdate = site.uuid === action.payload.id;

				if (shouldUpdate) {
					return {
						...site,
						data: {
							...site.data,
							...action.payload.body,
						},
					};
				}
				return site;
			});
		default:
			return state;
	}
};
