export interface AutoSubmitProps {
	delay?: number;
	initialValues?: { [key: string]: any };
	submitForm?: () => void;
	values?: { [key: string]: any };
}
