import { Button, TextField } from '@acpaas-ui/react-components';
import { Field, Formik } from 'formik';
import kebabCase from 'lodash.kebabcase';
import React, { FC } from 'react';

import { ContentTypeSettingsFormState } from '../../content-types.types';

interface ContentTypeSettingsFormProps {
	initialState: ContentTypeSettingsFormState;
	onCancel: () => void;
	onSubmit: (values: ContentTypeSettingsFormState) => void;
}

const ContentTypeSettings: FC<ContentTypeSettingsFormProps> = ({
	initialState,
	onCancel,
	onSubmit,
}) => {
	return (
		<Formik initialValues={initialState} onSubmit={onSubmit}>
			{({ submitForm, values }) => (
				<>
					<Field as={TextField} label="Naam" name="name" required />
					<p>
						Systeemnaam: <b>{kebabCase(values.name)}</b>
					</p>
					<Field as={TextField} label="Beschrijving" name="description" required />
					{/* TODO: these should go in the action bar */}
					<div className="u-margin-top">
						<Button
							className="u-margin-right-xs"
							onClick={() => submitForm()}
							type="success"
						>
							Bewaar en ga verder
						</Button>
						<Button onClick={onCancel} outline>
							Annuleer
						</Button>
					</div>
				</>
			)}
		</Formik>
	);
};

export default ContentTypeSettings;
