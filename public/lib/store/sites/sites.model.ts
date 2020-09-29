import { Site, SitesMeta } from '../../services/sites';
import { BaseEntityState } from '../shared';

export type SiteModel = Site;
export type SitesMetaModel = SitesMeta;

export interface SitesState extends BaseEntityState<SiteModel, string> {
	site?: SiteModel;
}
