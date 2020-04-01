import React, { FC } from 'react';

import { StatusTypes } from '../../helpers/typeMap/typeMap.const';
import Status from '../Status/Status';

import { SiteStatusProps } from './SiteStatus.types';

const SiteStatus: FC<SiteStatusProps> = ({ active = false }) => {
	return (
		<>
			{active ? (
				<Status label="Actief" type={StatusTypes.active} />
			) : (
				<Status label="Niet actief" type={StatusTypes.inactive} />
			)}
		</>
	);
};

export default SiteStatus;
