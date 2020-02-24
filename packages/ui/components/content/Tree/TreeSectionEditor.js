import React, { useCallback, useState, useMemo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useSelector, useDispatch } from 'react-redux'
import uuid from 'uuid/v4'

import Typography from '@material-ui/core/Typography'
import Tooltip from '@material-ui/core/Tooltip'
import Fab from '@material-ui/core/Fab'
import selectors from '../../../store/selectors'
import icons from '../../../icons'

import Actions from '../../../utils/actions'
import sectionActions from '../../../store/modules/section'
import contentActions from '../../../store/modules/content'

import SectionAdd from '../../buttons/SectionAdd'
import SectionSettings from '../../buttons/SectionSettings'
import MenuButton from '../../buttons/MenuButton'
import typeUI from '../../../types/ui'
import itemTypes from '../../../types/item'
import CellEditor from '../../layout/CellEditor'

const FolderIcon = icons.folder
const AddPanelIcon = icons.addPanelTop

const useStyles = makeStyles(theme => ({
  syncFolderTitle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'left',
    paddingLeft: '10px',
    paddingTop: '2px',
    cursor: 'pointer',
    color: '#999'
  },
  root: {
    display: 'flex',
    flexDirection: 'row',
    padding: theme.spacing(1)
  },
  secondRoot: {
    display: 'flex',
    flexDirection: 'row',
    borderTop: '1px dashed #ccc',
    padding: theme.spacing(1)
  },
  children: {
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  settings: {
    flexGrow: 0,
    marginRight: theme.spacing(1),
  },
  add: {
    flexGrow: 0,
  },
  tinyRoot: {
    width: '24px',
    height: '24px',
    minHeight: '24px',
    '& svg': {
      fontSize: '1rem',
    }
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

    return groups
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
    <div>
      <div className={ classes.root }>
        <div className={ classes.settings }>
          <SectionSettings
            id={ section }
            tiny
          />
        </div>
        <div className={ classes.children }>
          {
            sectionSyncFolder && (
              <Typography>
                <a
                  href={ itemType.getItemUrl(sectionSyncFolder) }
                  target="_blank"
                  className={ classes.syncFolderTitle }
                >
                  <FolderIcon />&nbsp;&nbsp;{ sectionSyncFolder.data.name }
                </a>
              </Typography>
            )
          }
        </div>
        <div className={ classes.add }>
          <MenuButton
            items={ extraAddItems }
            tiny
            getButton={ onClick => {
              return (
                <Tooltip title="Add Widgets">
                  <Fab
                    size="small"
                    className={ classes.tinyRoot }
                    onClick={ onClick }
                  >
                    <AddPanelIcon />
                  </Fab>
                </Tooltip>
              )
            }}
          />
        </div>
        
      </div>
      <div className={ classes.secondRoot }>
        <div className={ classes.settings }>
          <SectionAdd
            id={ section }
            filter={ parentFilter }
            location={ `section:${section}` }
            structure="tree"
            sectionType="sidebar"
            tiny
          />
        </div>
      </div>
      {
        addingCell && (
          <CellEditor
            cell={ addingCell }
            onSubmit={ onSubmitCellForm }
            onCancel={ () => setAddingCell(null) }
          />
        )
      }
    </div>
  )
}

export default TreeSectionEditor