import { Button } from '@acpaas-ui/react-components';
import { Location } from 'history';
import React, { FC, useEffect, useState } from 'react';
import { Prompt, useHistory } from 'react-router-dom';

import { LEAVE_PROMPT_DEFAULT_PROPS } from './LeavePrompt.const';
import LeavePromptModal from './LeavePrompt.modal';
import { LeavePromptProps } from './LeavePrompt.types';

const LeavePrompt: FC<LeavePromptProps> = ({
	body = LEAVE_PROMPT_DEFAULT_PROPS.body,
	cancelText = LEAVE_PROMPT_DEFAULT_PROPS.cancelText,
	confirmText = LEAVE_PROMPT_DEFAULT_PROPS.confirmText,
	deleteText = LEAVE_PROMPT_DEFAULT_PROPS.deleteText,
	navigate: navigateFn,
	onCancel,
	onConfirm,
	onDelete,
	title = LEAVE_PROMPT_DEFAULT_PROPS.title,
	when,
}) => {
	/**
	 * Hooks
	 */

	const [showModal, setShowModal] = useState(false);
	const [lastLocation, setLastLocation] = useState<Location | null>(null);
	const [confirmedNavigation, setConfirmedNavigation] = useState(false);
	const history = useHistory();

	const navigate = navigateFn || history.push;

	useEffect(() => {
		if (confirmedNavigation && lastLocation) {
			// Navigate to the previous blocked location with your navigate function
			navigate(lastLocation.pathname);
		}
	}, [confirmedNavigation, lastLocation, navigate]);

	/**
	 * Methods
	 */

	const handleBlockedNavigation = (nextLocation: Location): boolean => {
		if (!confirmedNavigation) {
			setShowModal(true);
			setLastLocation(nextLocation);
			return false;
		}
		return true;
	};

	const handleAction = (onAction?: () => void): void => {
		if (onAction) {
			onAction();
		}
		setShowModal(false);
		setConfirmedNavigation(true);
	};

	const handleCancel = (): void => {
		if (onCancel) {
			onCancel();
		}
		setShowModal(false);
	};

	/**
	 * Render
	 */

	return (
		<>
			<Prompt when={when} message={handleBlockedNavigation} />
			<LeavePromptModal show={showModal} title={title} body={body} onClose={handleCancel}>
				<Button onClick={handleCancel} outline>
					{cancelText}
				</Button>
				<Button onClick={() => handleAction(onDelete)} outline type="danger">
					{deleteText}
				</Button>
				<Button onClick={() => handleAction(onConfirm)} type="success">
					{confirmText}
				</Button>
			</LeavePromptModal>
		</>
	);
};

export default LeavePrompt;
