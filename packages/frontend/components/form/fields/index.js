import TextField from './Text'
import TextAreaField from './TextArea'
import RadioField from './Radio'
import CheckboxField from './Checkbox'
import MultipleCheckboxField from './MultipleCheckbox'
import SelectField from './Select'
import ColorPickerField from './ColorPickerField'
import Image from './Image'
import RichText from './RichText/Field'
import TemplateSelect from './TemplateSelect'

const fields = {
  text: TextField,
  textarea: TextAreaField,
  radio: RadioField,
  checkbox: CheckboxField,
  multipleCheckbox: MultipleCheckboxField,
  select: SelectField,
  color: ColorPickerField,
  image: Image,
  richtext: RichText,
  templateSelect: TemplateSelect,
}

export const defaultValues = {
  text: '',
  textarea: '',
  radio: '',
  checkbox: false,
  multipleCheckbox: {},
  select: '',
  color: {
    color: ''
  },
  image: null,
  richtext: '',
  templateSelect: '',
}

export default fields