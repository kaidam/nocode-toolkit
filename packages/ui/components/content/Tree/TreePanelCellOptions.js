import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import Actions from '../../../utils/actions'
import sectionActions from '../../../store/modules/section'
import CellOptions from '../../layout/CellOptions'

const TreePanelCellOptionsWrapper = (props) => {
  const actions = Actions(useDispatch(), {
    editLayout: sectionActions.editLayout,
    saveContent: sectionActions.saveContent,
  })

  const onEditLayout = useCallback((params) => {
    actions.editLayout({
      section: props.section,
      panelName: props.panelName,
      ...params
    })
  }, [props.section, props.panelName])

  const onSaveContent = useCallback((params) => {
    actions.saveContent({
      section: props.section,
      panelName: props.panelName,
      ...params
    })
  }, [props.section, props.panelName])

  return (
    <CellOptions
      onEditLayout={ onEditLayout }
      onSaveContent={ onSaveContent }
      {...props}
    />
  )
}

export default TreePanelCellOptionsWrapper