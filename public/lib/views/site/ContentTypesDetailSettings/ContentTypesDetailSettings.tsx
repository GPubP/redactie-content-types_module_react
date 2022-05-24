import {
	Button,
	Card,
	CardBody,
	CardDescription,
	CardTitle,
	Spinner,
} from '@acpaas-ui/react-components';
import { ActionBar, ActionBarContentSection } from '@acpaas-ui/react-editorial-components';
import { SiteListModel } from '@redactie/sites-module';
import { LeavePrompt, LoadingState, useDetectValueChangesWorker } from '@redactie/utils';
import React, { FC, useEffect, useMemo, useState } from 'react';

import { CTSettingsForm, SiteStatus } from '../../../components';
import navigationConnector from '../../../connectors/navigation';
import sitesConnector from '../../../connectors/sites';
import { CORE_TRANSLATIONS, useCoreTranslation } from '../../../connectors/translations';
import {
	ContentTypesSiteDetailRoutePropsParams,
	SiteContentTypesDetailRouteParams,
} from '../../../contentTypes.types';
import { useSites } from '../../../hooks';
import { MODULE_TRANSLATIONS } from '../../../i18next/translations.const';
import { contentTypesFacade } from '../../../store/contentTypes';

const ContentTypeSettings: FC<ContentTypesSiteDetailRoutePropsParams<
	SiteContentTypesDetailRouteParams
>> = ({ contentType, match, onCancel, canUpdate }) => {
	const { siteId } = match.params;

	/**
	 * Hooks
	 */
	const [t] = useCoreTranslation();
	const [siteData, setSiteData] = useState<SiteListModel['data']>();
	const [loadingSites, sites, refreshSites] = useSites();
	const [site, siteUI] = sitesConnector.hooks.useSite(siteId);

	const isUpdatingSite = !!siteUI?.isUpdating;
	const isLoading = !!siteUI?.isFetching;
	const isActive = siteData?.contentTypes.includes(contentType._id) || false;
	const isStatusLoading =
		(loadingSites === LoadingState.Loading || isUpdatingSite || isLoading) &&
		(!siteData || isActive);

	const [hasChanges, resetChangeDetection] = useDetectValueChangesWorker(
		!isLoading,
		siteData,
		BFF_MODULE_PUBLIC_PATH
	);
	// Calculate on how many sites the content type is used
	const amountUsedOnSites = useMemo(
		() =>
			(sites || []).reduce((acc, curr) => {
				return curr.data.contentTypes.find(ct => ct === contentType._id) ? acc + 1 : acc;
			}, 0),
		[contentType._id, sites]
	);

	useEffect(() => {
		if (site) {
			setSiteData(site.data);
		}
	}, [site]);

	/**
	 * Methods
	 */

	const onActiveToggle = (): void => {
		if (!siteData) {
			return;
		}

		const isActive = siteData.contentTypes.includes(contentType._id);
		const updateBody = {
			...siteData,
			contentTypes: isActive
				? siteData.contentTypes.filter(ctId => ctId !== contentType._id)
				: siteData.contentTypes.concat(contentType._id),
		};

		setSiteData(updateBody);
	};

	const onSave = (): void => {
		if (!site || !siteData) {
			return;
		}

		sitesConnector.sitesFacade
			.updateSite({
				id: site.uuid,
				body: siteData,
			})
			.then(() => {
				refreshSites();
				contentTypesFacade.fetchSiteModulesConfig(siteId, contentType?.uuid as string);
			});

		resetChangeDetection();
	};

	/**
	 * Render
	 */
	return (
		<>
			<CTSettingsForm
				contentType={contentType}
				disabled
				isUpdate
				translations={MODULE_TRANSLATIONS['content-types']}
				onSubmit={() => undefined}
				renderUrlPattern={contentType.meta.canBeFiltered && !navigationConnector.api}
			/>
			<Card className="u-margin-top">
				<CardBody>
					<CardTitle>
						Status
						{siteData && (
							<>
								: <SiteStatus active={isActive} />
							</>
						)}
					</CardTitle>
					<CardDescription>
						{isStatusLoading ? (
							<Spinner />
						) : isActive ? (
							`Dit content type wordt gebruikt op ${
								amountUsedOnSites !== 0 ? amountUsedOnSites : 1
							} site(s)`
						) : (
							'Deze content type is niet actief binnen deze site.'
						)}
					</CardDescription>
					{canUpdate && siteData && (
						<Button
							onClick={onActiveToggle}
							className="u-margin-top u-margin-right"
							type="primary"
							disabled={isUpdatingSite}
						>
							{isActive ? t('BUTTON_DEACTIVATE') : t('BUTTON_ACTIVATE')}
						</Button>
					)}
				</CardBody>
			</Card>
			{canUpdate && (
				<ActionBar className="o-action-bar--fixed" isOpen>
					<ActionBarContentSection>
						<div className="u-wrapper row end-xs">
							<Button onClick={onCancel} negative>
								{t(CORE_TRANSLATIONS['BUTTON_CANCEL'])}
							</Button>

							<Button
								iconLeft={isUpdatingSite ? 'circle-o-notch fa-spin' : null}
								disabled={isLoading || isUpdatingSite || !hasChanges}
								className="u-margin-left-xs"
								onClick={onSave}
								type="success"
							>
								{t(CORE_TRANSLATIONS['BUTTON_SAVE'])}
							</Button>
						</div>
					</ActionBarContentSection>
				</ActionBar>
			)}
			<LeavePrompt when={hasChanges} onConfirm={onSave} />
		</>
	);
};

export default ContentTypeSettings;
