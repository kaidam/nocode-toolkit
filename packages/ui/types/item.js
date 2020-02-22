import local from './local/item'
import drive from './drive/item'

const defaultMethods = {
  iconName: item => 'item',
  driverName: item => 'Nocode',
  hasChildren: item => false,
  hasRoute: item => false,
  isLink: item => false,
  isEditable: item => false,
  isOpenable: item => false,
  editMode: item => '',
  // is this content included by a content entry that is not
  // itself visible?
  isGhostDescendant: item => false,
  // is this content present in the database or a descendant
  // of another content entry?
  isRootContent: item => true,
  handleOpen: item => {
    console.error('no supported')
  },
  getItemUrl: item => '',
}

const drivers = {
  default: defaultMethods,
  local: Object.assign({}, defaultMethods, local),
  drive: Object.assign({}, defaultMethods, drive),
}

const factory = item => {
  let driver = 'default'
  if(typeof(item) === 'string') driver = item
  else if(typeof(item) === 'object') driver = item.driver
  return drivers[driver] || drivers.default
}

export default factory