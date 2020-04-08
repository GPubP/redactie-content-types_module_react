import { TextField } from '@acpaas-ui/react-components';
import { Filter, FilterBody } from '@acpaas-ui/react-editorial-components';
import { Field, Formik, FormikHandlers } from 'formik';
import React, { FC, useRef } from 'react';

import { FILTER_FORM_VALIDATION_SCHEMA } from './FilterForm.const';
import { FilterFormProps } from './FilterForm.types';

const FilterForm: FC<FilterFormProps> = ({
	initialState,
	onCancel,
	onSubmit,
	deleteActiveFilter,
}) => {
	const formRef = useRef(null) as any;

	const handleSubmit = (): void => {
		if (formRef.current) {
			formRef.current.handleSubmit();
		}
	};
	return (
		<>
			<Filter
				title="Filter"
				noFilterText="Geen filters beschikbaar"
				onConfirm={handleSubmit}
				onClear={onCancel}
				confirmText="Toepassen"
				cleanText="Alles leegmaken"
				onFilterRemove={deleteActiveFilter}
			>
				<FilterBody>
					<div className="col-xs-8">
						<Formik
							innerRef={formRef}
							initialValues={initialState}
							onSubmit={onSubmit}
							validationSchema={FILTER_FORM_VALIDATION_SCHEMA}
						>
							<Field
								as={TextField}
								label="Naam"
								name="name"
								required
								placeholder="Zoeken op naam"
								iconright="search"
							/>
						</Formik>
					</div>
				</FilterBody>
			</Filter>
		</>
	);
};

export default FilterForm;
