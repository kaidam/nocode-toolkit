import React from 'react'
import icons from '../../icons'
import itemTypes from '../../types/item'

const ContentIcon = ({
  name,
  item,
  className,
}) => {
  const itemType = itemTypes(item)

  let iconName = name ?
    name :
    itemType.iconName(item)

  iconName = icons[iconName] ?
    iconName :
    'item'
  const IconClass = icons[iconName]

  return (
    <IconClass
      className={ className }
    />
  )
}

export default ContentIcon
