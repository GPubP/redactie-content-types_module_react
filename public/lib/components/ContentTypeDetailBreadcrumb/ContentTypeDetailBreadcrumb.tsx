import React, { FC } from 'react';

import { ContentTypeDetailBreadcrumpProps } from './ContentTypeDetailBreadcrumb.types';

const ContentTypeDetailBreadcrumb: FC<ContentTypeDetailBreadcrumpProps> = ({ contentTypeName }) => {
	return <>{contentTypeName || <span>...</span>}</>;
};

export default ContentTypeDetailBreadcrumb;
