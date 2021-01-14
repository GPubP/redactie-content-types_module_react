import { Breadcrumb } from '@redactie/redactie-core';
import { useNavigate } from '@redactie/utils';
import React, { FC } from 'react';
import { Link } from 'react-router-dom';

import { MODULE_PATHS } from '../../../contentTypes.const';

const ContentTypeBreadcrumb: FC<Breadcrumb> = ({ match }) => {
	const { generatePath } = useNavigate();

	return match?.params?.contentTypeUuid ? (
		<Link to={generatePath(MODULE_PATHS.detailCC, match?.params)}>Content componenten</Link>
	) : null;
};

export default ContentTypeBreadcrumb;
