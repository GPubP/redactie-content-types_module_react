import { ViewFieldProps } from '@redactie/form-renderer-module';
import React, { createElement, FC } from 'react';

import { TEXT_HTML_TYPES } from './TextWithStyle.const';

const CCTextLineView: FC<ViewFieldProps> = ({ value = {} }) => {
	const { text, textType } = value;

	if (!text || !textType) {
		return null;
	}

	const htmlType = TEXT_HTML_TYPES[textType];

	if (!htmlType) {
		return null;
	}

	return (
		<div className="u-margin-bottom">
			{createElement(htmlType.el, { className: htmlType.class }, text)}
		</div>
	);
};

export default CCTextLineView;
