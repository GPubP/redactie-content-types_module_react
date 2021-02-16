import { Button, Card, CardBody, CardDescription, CardTitle } from '@acpaas-ui/react-components';
import { ActionBar, ActionBarContentSection } from '@acpaas-ui/react-editorial-components';
import { SiteModel } from '@redactie/sites-module';
import { LeavePrompt, LoadingState, useDetectValueChangesWorker } from '@redactie/utils';
import React, { FC, useEffect, useMemo, useState } from 'react';

import { CTSettingsForm, SiteStatus } from '../../../components';
import sitesConnector from '../../../connectors/sites';
import { CORE_TRANSLATIONS, useCoreTranslation } from '../../../connectors/translations';
import {
	ContentTypesDetailRouteProps,
	SiteContentTypesDetailRouteParams,
} from '../../../contentTypes.types';
import { useSites } from '../../../hooks';

const ContentTypeSettings: FC<ContentTypesDetailRouteProps<SiteContentTypesDetailRouteParams>> = ({
	contentType,
	match,
	onCancel,
}) => {
	const { siteId } = match.params;

	/**
	 * Hooks
	 */
	const [siteData, setSiteData] = useState<SiteModel['data']>();
	const [t] = useCoreTranslation();
	const [loadingSites, sites] = useSites();
	const { isUpdating } = sitesConnector.hooks.useSitesLoadingStates();
	const isUpdatingSite = useMemo(() => isUpdating === LoadingState.Loading, [isUpdating]);
	const isLoading = useMemo(() => loadingSites === LoadingState.Loading, [loadingSites]);
	// Calculate on how many sites the content type is used
	const amountUsedOnSites = useMemo(
		() =>
			(sites || []).reduce((acc, curr) => {
				return curr.data.contentTypes.find(ct => ct === contentType._id) ? acc + 1 : acc;
			}, 0),
		[contentType._id, sites]
	);
	const site = useMemo(() => (sites || []).find(s => s.uuid === siteId) || null, [siteId, sites]);
	const [hasChanges, resetChangeDetection] = useDetectValueChangesWorker(
		!isLoading,
		siteData,
		BFF_MODULE_PUBLIC_PATH
	);

	/**
	 * Fetch sites
	 */

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

		sitesConnector.sitesFacade.updateSite({
			id: site.uuid,
			body: siteData,
		});

		resetChangeDetection();
	};

	const active = siteData?.contentTypes.includes(contentType._id) || false;

	/**
	 * Render
	 */

	return (
		<>
			<CTSettingsForm
				contentType={contentType}
				disabled
				isUpdate
				onSubmit={() => undefined}
			/>
			<Card className="u-margin-top">
				<CardBody>
					<CardTitle>Status: {siteData && <SiteStatus active={active} />}</CardTitle>
					<CardDescription>
						{active
							? `Dit content type wordt gebruikt op ${
									amountUsedOnSites !== 0 ? amountUsedOnSites : 1
							  } site(s)`
							: 'Deze content type is niet actief binnen deze site.'}
					</CardDescription>
					<Button
						onClick={onActiveToggle}
						className="u-margin-top u-margin-right"
						type="primary"
					>
						{active ? t('BUTTON_DEACTIVATE') : t('BUTTON_ACTIVATE')}
					</Button>
				</CardBody>
			</Card>
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
			<LeavePrompt when={hasChanges} onConfirm={onSave} />
		</>
	);
};

export default ContentTypeSettings;
