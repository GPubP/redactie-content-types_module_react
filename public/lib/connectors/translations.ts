import Core from '@redactie/redactie-core';
import { I18NextTranslations, TranslateFunc, TranslationsAPI } from '@redactie/translations-module';

export const translationsAPI = Core.modules.getModuleAPI<
	TranslationsAPI & {
		core: TranslationsAPI & {
			tKey: (key: string, defaultValue: string) => string;
		};
		modules: {
			addTranslation: (id: string, lang: string, translation: I18NextTranslations) => void;
			updateTranslation: (id: string, lang: string, translation: I18NextTranslations) => void;
			useTranslation: (module: string, lang: string) => [TranslateFunc];
			translate: (module: string, lang: string, key: string) => string;
		};
	}
>('translations-module');

/**
 * Translations - useCoreTranslation
 *    => returns translate function or empty function returning an empty string if not available
 *
 * TODO: implement language based on currently set language (maybe this should be handled in the translations module)
 */
export const useCoreTranslation = (): [(keys: string | string[]) => string] =>
	translationsAPI?.core?.useTranslation
		? translationsAPI.core.useTranslation('nl_BE')
		: [() => 'TRANSLATIONS MODULE ERROR'];

export const useModuleTranslation = (): [(keys: string | string[]) => string] =>
	translationsAPI?.modules?.useTranslation
		? translationsAPI.modules.useTranslation('content-types', 'nl_BE')
		: [() => 'TRANSLATIONS MODULE ERROR'];

export const moduleTranslate = (key: string): string =>
	translationsAPI?.modules?.translate
		? translationsAPI.modules.translate('content-types', 'nl_BE', key)
		: 'TRANSLATIONS MODULE ERROR';

export const CORE_TRANSLATIONS = translationsAPI?.core?.CORE_TRANSLATIONS || {};
