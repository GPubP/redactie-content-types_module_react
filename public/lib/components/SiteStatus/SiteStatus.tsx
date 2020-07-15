import { CORE_TRANSLATIONS } from '@redactie/translations-module/public/lib/i18next/translations.const';
import React, { FC } from 'react';

import { useCoreTranslation } from '../../connectors/translations';
import { StatusTypes } from '../../helpers';
import Status from '../Status/Status';

import { SiteStatusProps } from './SiteStatus.types';

const SiteStatus: FC<SiteStatusProps> = ({ active = false }) => {
	const [t] = useCoreTranslation();

	return (
		<>
			{active ? (
				<Status label={t(CORE_TRANSLATIONS.STATUS_ACTIVE)} type={StatusTypes.active} />
			) : (
				<Status
					label={t(CORE_TRANSLATIONS['STATUS_NON-ACTIVE'])}
					type={StatusTypes.inactive}
				/>
			)}
		</>
	);
};

export default SiteStatus;
