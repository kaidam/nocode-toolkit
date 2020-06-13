import TextField from './Text'
import TextAreaField from './TextArea'
import RadioField from './Radio'
import CheckboxField from './Checkbox'
import MultipleCheckboxField from './MultipleCheckbox'
import SelectField from './Select'
import ColorPickerField from './ColorPickerField'
import Image from './Image'
import Sorting from './Sorting'
import MakeHomepage from './MakeHomepage'
import HiddenItems from './HiddenItems'
import DriveFolders from './DriveFolders'

const fields = {
  text: TextField,
  textarea: TextAreaField,
  radio: RadioField,
  checkbox: CheckboxField,
  multipleCheckbox: MultipleCheckboxField,
  select: SelectField,
  color: ColorPickerField,
  image: Image,
  sorting: Sorting,
  hiddenItems: HiddenItems,
  makeHomepage: MakeHomepage,
  driveFolders: DriveFolders,
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
  sorting: {},
  hiddenItems: {},
  driveFolders: {},
}

export default fields