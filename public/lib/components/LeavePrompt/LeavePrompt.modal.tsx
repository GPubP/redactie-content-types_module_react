import { Button } from '@acpaas-ui/react-components';
import classnames from 'classnames';
import React, { FC } from 'react';
import { createPortal } from 'react-dom';

import { LeavePromptModalProps } from './LeavePrompt.types';

const LeavePromptModal: FC<LeavePromptModalProps> = ({
	body,
	children,
	node,
	onClose,
	show,
	title,
}) => {
	return createPortal(
		<div className={classnames('m-overlay', { 'is-active': show })}>
			<div className="m-modal m-modal--large">
				<div className="m-modal__content">
					<div className="m-modal__header u-margin-bottom-xs">
						<h4>{title}</h4>
						{onClose && (
							<Button
								className="m-modal__close"
								icon="times"
								type="default"
								transparent
								onClick={onClose}
							/>
						)}
					</div>
					<div className="u-margin-bottom">{body}</div>
					<div className="m-modal__footer row end-xs">{children}</div>
				</div>
			</div>
		</div>,
		node || document.body
	);
};

export default LeavePromptModal;
