import { Site, SitesMeta } from '../../services/sites';
import { BaseEntityState } from '../shared';

export type SiteModel = Site;
export type SitesMetaModel = SitesMeta;

export type SitesState = BaseEntityState<SiteModel, string>;
