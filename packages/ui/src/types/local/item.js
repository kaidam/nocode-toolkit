import schemas from './schemas'

const hasChildren = (item) => {
  const schemaDefinition = schemas[item.type]
  return schemaDefinition.metadata.hasChildren ? true : false
}

const isLink = (item) => {
  const schemaDefinition = schemas[item.type]
  return schemaDefinition ?
    schemaDefinition.metadata.nodeType == 'externalLink' :
    false
}
const iconName = (item) => {
  const schemaDefinition = schemas[item.type]
  return schemaDefinition ?
    schemaDefinition.icon :
    'item'
}

const itemType = {
  hasChildren,
  isLink,
  iconName,
  isEditable: item => true,
}

export default itemType