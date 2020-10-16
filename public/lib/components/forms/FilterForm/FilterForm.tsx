import { TextField } from '@acpaas-ui/react-components';
import { Filter, FilterBody } from '@acpaas-ui/react-editorial-components';
import { CORE_TRANSLATIONS } from '@redactie/translations-module/public/lib/i18next/translations.const';
import { Field, Formik } from 'formik';
import React, { FC } from 'react';

import { useCoreTranslation } from '../../../connectors/translations';

import { FILTER_FORM_VALIDATION_SCHEMA } from './FilterForm.const';
import { FilterFormProps } from './FilterForm.types';

const FilterForm: FC<FilterFormProps> = ({
	initialState,
	onCancel,
	onSubmit,
	activeFilters,
	deleteActiveFilter,
}) => {
	/**
	 * Hooks
	 */
	const [t] = useCoreTranslation();

	/**
	 * Render
	 */
	return (
		<>
			<Formik
				initialValues={initialState}
				onSubmit={onSubmit}
				validationSchema={FILTER_FORM_VALIDATION_SCHEMA}
			>
				{({ resetForm, submitForm }) => {
					return (
						<Filter
							title={t(CORE_TRANSLATIONS.FILTER_TITLE)}
							noFilterText="Geen filters beschikbaar"
							onConfirm={submitForm}
							onClean={() => {
								resetForm();
								onCancel();
							}}
							confirmText={t(CORE_TRANSLATIONS.FILTER_APPLY)}
							cleanText={t(CORE_TRANSLATIONS.FILTER_CLEAR)}
							activeFilters={activeFilters}
							onFilterRemove={deleteActiveFilter}
						>
							<FilterBody>
								<div className="col-xs-12 col-sm">
									<Field
										as={TextField}
										label="Naam"
										name="name"
										iconright="search"
										required
										placeholder="Zoeken op naam"
									/>
								</div>
							</FilterBody>
						</Filter>
					);
				}}
			</Formik>
		</>
	);
};

export default FilterForm;