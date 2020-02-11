import React, { useCallback, useState, useMemo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useSelector, useDispatch } from 'react-redux'
import uuid from 'uuid/v4'

import Typography from '@material-ui/core/Typography'
import selectors from '../../../store/selectors'
import icons from '../../../icons'

import Actions from '../../../utils/actions'
import sectionActions from '../../../store/modules/section'
import contentActions from '../../../store/modules/content'

import SectionEditor from '../../buttons/SectionEditor'
import typeUI from '../../../types/ui'
import itemTypes from '../../../types/item'
import CellEditor from '../../layout/CellEditor'

const useStyles = makeStyles(theme => ({
  syncFolderTitle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'left',
    paddingLeft: '10px',
    cursor: 'pointer',
  },
}))

const TreeSectionEditor = ({
  section,
}) => {

  const classes = useStyles()

  const itemType = itemTypes('drive')

  const actions = Actions(useDispatch(), {
    onEditLayout: sectionActions.editLayout,
    onOpenExternalEditor: contentActions.onOpenExternalEditor,
  })

  const sectionSyncFolderSelector = useMemo(selectors.content.sectionSyncFolder, [])
  const sectionSyncFolder = useSelector(state => sectionSyncFolderSelector(state, section))

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
      >
        {
          sectionSyncFolder && (
            <Typography
              className={ classes.syncFolderTitle }
              color="primary"
              onClick={() => {
                itemType.handleOpen(sectionSyncFolder)
              }}
            >
              { sectionSyncFolder.data.name }
            </Typography>
          )
        }
      </SectionEditor>
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