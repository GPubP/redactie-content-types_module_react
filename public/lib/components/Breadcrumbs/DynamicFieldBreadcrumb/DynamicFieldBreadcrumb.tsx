import { Breadcrumb } from '@redactie/redactie-core';
import { useNavigate } from '@redactie/utils';
import React, { FC } from 'react';
import { Link } from 'react-router-dom';

import { MODULE_PATHS } from '../../../contentTypes.const';

const DynamicFieldBreadcrumb: FC<Breadcrumb> = ({ match }) => {
	const { generatePath } = useNavigate();

	return match?.params?.contentComponentUuid ? (
		<>
			<Link to={generatePath(MODULE_PATHS.detailCCEdit, match?.params)}>
				Vrije paragrafen
			</Link>
		</>
	) : null;
};

export default DynamicFieldBreadcrumb;
