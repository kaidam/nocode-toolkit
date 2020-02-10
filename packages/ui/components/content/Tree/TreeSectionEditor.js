import React, { useCallback, useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import uuid from 'uuid/v4'

import selectors from '../../../store/selectors'
import icons from '../../../icons'

import Actions from '../../../utils/actions'
import sectionActions from '../../../store/modules/section'

import SectionEditor from '../../buttons/SectionEditor'

import typeUI from '../../../types/ui'

import CellEditor from '../../layout/CellEditor'

const TreeSectionEditor = ({
  section,
}) => {

  const actions = Actions(useDispatch(), {
    onEditLayout: sectionActions.editLayout,
  })

  const settings = useSelector(selectors.ui.settings)
  const parentFilter = useCallback((parentFilter) => parentFilter.indexOf('section') >= 0)

  const [ addingCell, setAddingCell ] = useState(null)

  const extraAddItems = useMemo(() => {
    const insertHandler = (cell) => {
      actions.onEditLayout({
        section,
        cell: Object.assign({}, cell, {
          id: uuid(),
        }),
        method: 'appendRow',
      })
    }

    const addHandler = ({
      type,
    }) => {
      setAddingCell({
        component: type,
        source: 'cell',
        editor: 'local',
      })
    }

    const groups = typeUI.addCellWidgetOptions({
      method: 'appendRow',
      params: {},
      location: 'section',
      settings,
      insertHandler,
      addHandler,
    })

    return [{
      title: 'Nocode Widgets',
      icon: icons.nocode,
      items: groups,
      isGroup: true,
    }]
  }, [
    settings,
  ])

  const onSubmitCellForm = useCallback((data) => {
    const cell = Object.assign({}, addingCell, {
      data,
      id: uuid(),
    })
    actions.onEditLayout({
      section,
      cell,
      method: 'appendRow',
      onComplete: () => {
        setAddingCell(null)
      }
    })
  }, [
    section,
    addingCell,
  ])

  return (
    <React.Fragment>
      <SectionEditor
        id={ section }
        tiny
        filter={ parentFilter }
        location={ `section:${section}` }
        structure="tree"
        sectionType="sidebar"
        extraAddItems={ extraAddItems }
      />
      {
        addingCell && (
          <CellEditor
            cell={ addingCell }
            onSubmit={ onSubmitCellForm }
            onCancel={ () => setAddingCell(null) }
          />
        )
      }
    </React.Fragment> 
  )
}

export default TreeSectionEditor