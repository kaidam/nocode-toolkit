import React, { useState, useCallback, useMemo } from 'react'
import uuid from 'uuid/v4'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { useSelector, useDispatch } from 'react-redux'
import Fab from '@material-ui/core/Fab'

import Actions from '../../utils/actions'

import MenuButton from '../buttons/MenuButton'
import Window from '../system/Window'

import CellEditor from './CellEditor'
import CellSettingsEditor from './CellSettingsEditor'

import typeUI from '../../types/ui'
import library from '../../types/library'
import icons from '../../icons'
import selectors from '../../store/selectors'
import contentActions from '../../store/modules/content'

const EditIcon = icons.edit
const AddIcon = icons.add
const MoveIcon = icons.move
const DeleteIcon = icons.delete
const RowIcon = icons.row
const CellIcon = icons.cell
const UpIcon = icons.up
const DownIcon = icons.down
const LeftIcon = icons.left
const RightIcon = icons.right
const SettingsIcon = icons.settings

const CellGroups = [{
  id: 'document',
  title: 'Document Widgets',
  icon: 'text',
}, {
  id: 'text',
  title: 'Text Widgets',
  icon: 'title',
}, {
  id: 'media',
  title: 'Media Widgets',
  icon: 'image',
}, {
  id: 'navigation',
  title: 'Navigation Widgets',
  icon: 'backnext',
}, {
  id: 'plugin',
  title: 'Plugins',
  icon: 'plugin',
}, {
  id: 'snippet',
  title: 'Snippets',
  icon: 'code',
}]

const useStyles = makeStyles(theme => createStyles({
  smallOptionButton: {
    width: '24px',
    height: '24px',
    minHeight: '24px',
    '& svg': {
      fontSize: '1rem',
    }
  },
}))

const IconCombo = (Left, Right) => () => (
  <div>
    <Left />
    <Right />
  </div>
)

const CellOptionsDeleteConfirm = ({
  onSubmit,
  onCancel,
}) => {
  return (
    <Window
      open
      fullHeight={ false }
      withCancel
      size="sm"
      title="Confirm cell delete"
      submitTitle="Delete"
      onCancel={ onCancel }
      onSubmit={ onSubmit }
    >
      Are you sure you want to delete this cell?
    </Window>
  )
}

const CellOptions = ({
  data,
  cell,
  rowIndex,
  cellIndex,
  location = 'document',
  onEditLayout,
  onSaveContent,
}) => {

  const actions = Actions(useDispatch(), {
    onOpenExternalEditor: contentActions.onOpenExternalEditor,
  })

  const classes = useStyles()
  const settings = useSelector(selectors.ui.settings)

  const [ deleteConfirmOpen, setDeleteConfirmOpen ] = useState(false)
  const [ editorOpen, setEditorOpen ] = useState(false)
  const [ settingsEditorOpen, setSettingsEditorOpen ] = useState(false)
  const [ addingCell, setAddingCell ] = useState(null)

  const onOpenDeleteConfirm = useCallback(() => setDeleteConfirmOpen(true), [])
  const onCloseDeleteConfirm = useCallback(() => setDeleteConfirmOpen(false), [])
  const onOpenEditor = useCallback((isAdding) => {
    if(!isAdding && cell.editor == 'external') {
      const item = data.item
      actions.onOpenExternalEditor({
        driver: item.driver,
        id: item.id,
      })
    }
    else {
      setEditorOpen(true)
    }    
  }, [
    cell,
    data,
  ])
  const onCloseEditor = useCallback(() => setEditorOpen(false), [])
  const onOpenSettingsEditor = useCallback(() => setSettingsEditorOpen(true), [])
  const onCloseSettingsEditor = useCallback(() => setSettingsEditorOpen(false), [])

  const cellSchemaDefinition = library.get(`local.${cell.component}`)

  const getContentTypeOptions = useCallback(({
    method,
    params,
  }) => {

    const activePlugins = settings && settings.data && settings.data.activePlugins ?
      settings.data.activePlugins :
      {}

    const insertHandler = (cell) => {
      onEditLayout({
        data,
        rowIndex,
        cellIndex,
        method,
        params,
        cell: Object.assign({}, cell, {
          id: uuid(),
        })
      })
    }

    const baseHandler = (type, schema) => {

      const cellConfig = schema.cellConfig || {}

      // if the schema definition gives us a cell
      // it means to be inserted immediately
      if(cellConfig.cell) {
        insertHandler(cellConfig.cell)
      }
      // otherwise we open the editor for the cell
      else {
        setAddingCell({
          cell: {
            component: type,
            source: 'cell',
            editor: 'local',
          },
          type,
          method,
          params,
        })
        onOpenEditor(true)
      }      
    }

    const snippetHandler = (id) => {
      insertHandler({
        component: 'snippet',
        source: 'cell',
        editor: 'local',
        data: {
          id,
        },
      })
    }

    const groups = library.list()
      .filter(schemaDefinition => {
        const parentFilter = schemaDefinition.parentFilter || []
        if(schemaDefinition.plugin && !activePlugins[schemaDefinition.plugin]) return false
        const hasCellParent = parentFilter.indexOf('cell') >= 0
          if(!hasCellParent) return false
          if(schemaDefinition.addCellFilter) {
            return schemaDefinition.addCellFilter(settings, {
              location,
            })
          }
          else {
            return true
          }
      })
      .reduce((all, schemaDefinition) => {
        const cellConfig = schemaDefinition.cellConfig || {}
        const cellGroup = schemaDefinition.plugin ?
          'plugin' :
          cellConfig.group
        if(!cellGroup) return all
        const group = all[cellGroup] || []
        group.push({
          title: schemaDefinition.title,
          icon: icons[schemaDefinition.icon],
          type: schemaDefinition.type,
          help: schemaDefinition.help,
          handler: () => baseHandler(schemaDefinition.type, schemaDefinition),
        })
        all[cellGroup] = group
        return all
      }, {})

    groups.snippet = settings && settings.data && settings.data.snippets ?
      settings.data.snippets
        .filter(snippet => snippet.global ? false : true)
        .map(snippet => ({
          title: snippet.name,
          icon: icons.code,
          type: 'snippet',
          handler: () => snippetHandler(snippet.id),
        })) : 
        []

    return CellGroups
      .filter(group => {
        return groups[group.id] && groups[group.id].length > 0
      })
      .map(group => {
        return {
          title: group.title,
          icon: icons[group.icon],
          items: groups[group.id],
        }
      })
  }, [
    onOpenEditor,
    setAddingCell,
    settings,
    data,
    rowIndex,
    cellIndex,
  ])

  const getEditLayoutHandler = useCallback(({
    method,
    params,
  }) => () => {
    onEditLayout({
      data,
      rowIndex,
      cellIndex,
      method,
      params,
      cell,
    })
  }, [data, rowIndex, cellIndex, cell])

  const placeholderMenuItems = useMemo(() => {
    return [{
      title: 'Insert',
      help: 'Insert content',
      icon: AddIcon,
      items: getContentTypeOptions({
        method: 'insertRow',
        params: {
          location: 'after',
        },
      })
    }, {
      title: 'Delete',
      help: 'Delete this cell',
      icon: DeleteIcon,
      handler: onOpenDeleteConfirm,
    }]
  }, [
    getEditLayoutHandler,
    getContentTypeOptions,
  ])

  const fullMenuItems = useMemo(() => {
    const editOptions = {
      title: 'Edit',
      help: 'Edit this content',
      icon: EditIcon,
      handler: onOpenEditor,
    }

    const settingsOptions = {
      title: 'Settings',
      help: 'Edit cell settings',
      icon: SettingsIcon,
      handler: onOpenSettingsEditor,
    }

    const insertOptions = {
      title: 'Insert',
      help: 'Insert rows or cells',
      icon: AddIcon,
      items: getContentTypeOptions({
        method: 'insertRow',
        params: {
          location: 'after',
        },
      })
    }

    const moveOptions = {
      title: 'Move',
      help: 'Move this cell',
      icon: MoveIcon,
      items: [{
        title: 'Up',
        help: 'Move this cell up a row',
        icon: IconCombo(UpIcon, RowIcon),
        items: [{
          title: 'Up: New Row',
          help: 'New row above',
          icon: IconCombo(UpIcon, RowIcon),
          handler: getEditLayoutHandler({
            method: 'moveCell',
            params: {
              location: 'up',
              merge: false,
            },
          })
        }, {
          title: 'Up: Merge',
          help: 'Merge into row above',
          icon: IconCombo(UpIcon, RowIcon),
          handler: getEditLayoutHandler({
            method: 'moveCell',
            params: {
              location: 'up',
              merge: true,
            },
          })
        }]
      }, {
        title: 'Down',
        help: 'Move this cell down a row',
        icon: IconCombo(DownIcon, RowIcon),
        items: [{
          title: 'Down: New Row',
          help: 'New row below',
          icon: IconCombo(DownIcon, RowIcon),
          handler: getEditLayoutHandler({
            method: 'moveCell',
            params: {
              location: 'down',
              merge: false,
            },
          })
        }, {
          title: 'Down: Merge',
          help: 'Merge into row below',
          icon: IconCombo(DownIcon, RowIcon),
          handler: getEditLayoutHandler({
            method: 'moveCell',
            params: {
              location: 'down',
              merge: true,
            },
          })
        }]
      }, {
        title: 'Left',
        help: 'Move this cell left',
        icon: IconCombo(LeftIcon, CellIcon),
        handler: getEditLayoutHandler({
          method: 'moveCell',
          params: {
            location: 'left',
          },
        })
      }, {
        title: 'Right',
        help: 'Move this cell right',
        icon: IconCombo(RightIcon, CellIcon),
        handler: getEditLayoutHandler({
          method: 'moveCell',
          params: {
            location: 'right',
          },
        })
      }]
    }

    const deleteOption = {
      title: 'Delete',
      help: 'Delete this cell',
      icon: DeleteIcon,
      handler: onOpenDeleteConfirm,
    }

    const canEdit = cellSchemaDefinition && cellSchemaDefinition.cellConfig && cellSchemaDefinition.cellConfig.disableEdit ?
      false :
      true

    let menuItems = []

    if(canEdit) {
      menuItems = menuItems.concat([editOptions])
    }

    menuItems = menuItems.concat([
      insertOptions,
      moveOptions,
      deleteOption,
      settingsOptions,
    ])

    return menuItems
  }, [
    getEditLayoutHandler,
    getContentTypeOptions,
    cellSchemaDefinition,
  ])

  const getButton = useCallback((onClick) => {
    return (
      <Fab
        size="small"
        className={ classes.smallOptionButton }
        onClick={ onClick }
      >
        <EditIcon />
      </Fab>
    )
  }, [classes])

  const onDeleteSubmit = useCallback(() => {
    onCloseDeleteConfirm()
    onEditLayout({
      data,
      rowIndex,
      cellIndex,
      method: 'deleteCell',
    })
  }, [data, rowIndex, cellIndex])

  const onEditorSubmit = useCallback((payload) => {
    // this is the callback from the form when we are adding a new cell
    if(addingCell) {
      const {
        method,
        params,
        type,
      } = addingCell

      // this updates the cell layout in the store
      onEditLayout({
        data,
        rowIndex,
        cellIndex,
        method,
        params,
        cell: {
          id: uuid(),
          component: type,
          source: 'cell',
          editor: 'local',
          data: payload,
        },
        onComplete: onCloseEditor,
      })
    }
    // this is the callback from the form when we are saving an existing cell
    else {
      onSaveContent({
        item: data.item,
        cell,
        dataName: 'data',
        rowIndex,
        cellIndex,
        payload,
        onComplete: onCloseEditor,
      })
    }

    setAddingCell(null)
  }, [
    addingCell,
    data,
    cell,
    rowIndex,
    cellIndex,
  ])

  const onSettingsEditorSubmit = useCallback((payload) => {
    onSaveContent({
      item: data.item,
      cell,
      dataName: 'settings',
      rowIndex,
      cellIndex,
      payload,
      onComplete: onCloseSettingsEditor,
    })
  })

  const onEditorCancel = useCallback(() => {
    onCloseEditor()
    setAddingCell(null)
  }, [])

  const menuItems = cell.placeholder ?
    placeholderMenuItems :
    fullMenuItems

  return (
    <React.Fragment>
      <MenuButton
        items={ menuItems }
        getButton={ getButton }
      />
      {
        deleteConfirmOpen && (
          <CellOptionsDeleteConfirm
            onSubmit={ onDeleteSubmit }
            onCancel={ onCloseDeleteConfirm }
          />
        )
      }
      {
        editorOpen && (
          <CellEditor
            data={ data }
            cell={ addingCell ? addingCell.cell : cell }
            onSubmit={ onEditorSubmit }
            onCancel={ onEditorCancel }
          />
        )
      }
      {
        settingsEditorOpen && (
          <CellSettingsEditor
            cell={ cell }
            onSubmit={ onSettingsEditorSubmit }
            onCancel={ onCloseSettingsEditor }
          />
        )
      }
    </React.Fragment>
  )
}

export default CellOptions