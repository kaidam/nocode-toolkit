import React from 'react'
import EditableCellMenu from './EditableCellMenu'
import FocusElement from '../widgets/FocusElement'

const EditableCell = ({
  layout,
  cell,
  content_id,
  layout_id,
  simpleMovement,
  widgetTitles,
  rowIndex,
  cellIndex,
  children,
  getAddMenu,
}) => {

  const title = widgetTitles[cell.type]

  const getMenu = ({
    menuAnchor,
    onReset,
  }) => {
    return (
      <EditableCellMenu
        menuAnchor={ menuAnchor }
        layout={ layout }
        cell={ cell }
        content_id={ content_id }
        layout_id={ layout_id }
        simpleMovement={ simpleMovement }
        rowIndex={ rowIndex }
        cellIndex={ cellIndex }
        getAddMenu={ getAddMenu }
        onClose={ onReset }
        onReset={ onReset }
      />
    )
  }

  return (
    <FocusElement
      getMenu={ getMenu }
      title={ title }
    >
      { children }
    </FocusElement>
  )
}

export default EditableCell