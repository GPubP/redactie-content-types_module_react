import { Breadcrumb } from '@redactie/redactie-core';
import { useNavigate, useObservable } from '@redactie/utils';
import React, { FC } from 'react';
import { Link } from 'react-router-dom';

import { MODULE_PATHS } from '../../../contentTypes.const';
import { contentTypesFacade } from '../../../store/contentTypes';

const ContentTypeBreadcrumb: FC<Breadcrumb> = ({ match }) => {
	const { generatePath } = useNavigate();

	const contentType = useObservable(contentTypesFacade.contentType$);

	return contentType?.meta.label ? (
		<Link to={generatePath(MODULE_PATHS.detail, match?.params)}>{contentType.meta.label}</Link>
	) : (
		<>...</>
	);
};

export default ContentTypeBreadcrumb;
