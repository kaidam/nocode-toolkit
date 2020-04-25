import React from 'react'
import EditableBodyMenu from './EditableBodyMenu'
import FocusElement from '../widgets/FocusElement'

const EditableBody = ({
  node,
  layout_id,
  children,
}) => {

  const getMenu = ({
    menuAnchor,
    onReset,
  }) => {
    return (
      <EditableBodyMenu
        node={ node }
        layout_id={ layout_id }
        menuAnchor={ menuAnchor }
        onClose={ onReset }
        onReset={ onReset }
      />
    )
  }

  return (
    <FocusElement
      getMenu={ getMenu }
      title="Google Document"
    >
      { children }
    </FocusElement>
  )
}

export default EditableBody