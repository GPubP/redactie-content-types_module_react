import translations from '../../assets/i18n/locales/template.json';
import { translationsAPI } from '../connectors/translations';

export const registerTranslations = (): void => {
	translationsAPI.modules.addTranslation('content-types', 'nl_BE', translations);
};
