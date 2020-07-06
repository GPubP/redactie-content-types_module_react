import { Preset } from '../../services/presets';
import { FieldTypeDetailModel } from '../../store/fieldTypes';

export interface ContentTypesCCValidationProps {
	fieldData?: FieldTypeDetailModel;
	preset?: Preset;
}
