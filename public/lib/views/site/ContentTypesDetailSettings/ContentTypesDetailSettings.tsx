import { Button, Card, CardBody, CardDescription, CardTitle } from '@acpaas-ui/react-components';
import { ActionBar, ActionBarContentSection } from '@acpaas-ui/react-editorial-components';
import { CORE_TRANSLATIONS } from '@redactie/translations-module/public/lib/i18next/translations.const';
import { LeavePrompt, useDetectValueChanges } from '@redactie/utils';
import React, { FC, useEffect, useMemo, useState } from 'react';

import { CTSettingsForm, SiteStatus } from '../../../components';
import { useCoreTranslation } from '../../../connectors/translations';
import {
	ContentTypesDetailRouteProps,
	LoadingState,
	SiteContentTypesDetailRouteParams,
} from '../../../contentTypes.types';
import { useSites } from '../../../hooks';
import { SiteModel, sitesFacade } from '../../../store/sites';

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
	const [hasChanges, resetChangeDetection] = useDetectValueChanges(!isLoading, siteData);

	/**
	 * Fetch sites
	 */
	useEffect(() => {
		sitesFacade.getSites();
	}, []);

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
		// TODO: quick user sites module and stores
		sitesFacade.updateSite(site.uuid, siteData);
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
			<Card>
				<CardBody>
					<CardTitle>Status: {siteData && <SiteStatus active={active} />}</CardTitle>
					<CardDescription>
						{active
							? `Dit content type wordt gebruikt op ${amountUsedOnSites} site(s)`
							: 'Deze content type is niet actief binnen deze tenant en dus voor geen enkele site beschikbaar om te activeren.'}
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
							iconLeft={isLoading ? 'circle-o-notch fa-spin' : null}
							disabled={isLoading || !hasChanges}
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
