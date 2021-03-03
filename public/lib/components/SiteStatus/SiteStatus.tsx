import { Status } from '@acpaas-ui/react-editorial-components';
import React, { FC } from 'react';

import { CORE_TRANSLATIONS, useCoreTranslation } from '../../connectors/translations';
import { StatusTypes } from '../../helpers';

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
