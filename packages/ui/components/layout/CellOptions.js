import React, { useState, useCallback, useMemo } from 'react'
import uuid from 'uuid/v4'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { useSelector, useDispatch } from 'react-redux'
import Fab from '@material-ui/core/Fab'
import Tooltip from '@material-ui/core/Tooltip'

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

const OptionsIcon = icons.moreVert
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

const useStyles = makeStyles(theme => createStyles({
  smallOptionButton: {
    width: '24px',
    height: '24px',
    minHeight: '24px',
    '& svg': {
      fontSize: '1rem',
    }
  },
  buttonContainer: {
    transition: 'opacity 200ms linear',
  },
  buttonContainerHidden: {
    opacity: 0,
  },
  buttonContainerVisible: {
    opacity: 1,
  },
  toolbarButtons: {
    position: 'absolute',
    left: '0px',
    width: '100%',
    zIndex: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  sidebarButtons: {
    position: 'absolute',
    top: '-12px',
    right: '0px',
    height: '100%',
    zIndex: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  toolbarButtonsTop: {
    top: '-12px',
  },
  toolbarButtonsBottom: {
    bottom: '-12px',
  },
  toolbarButton: {
    marginLeft: '4px',
    marginRight: '4px',
    width: '20px',
    height: '20px',
    minHeight: '20px',
    '& svg': {
      fontSize: '0.8rem',
    }
  },
  sidebarButton: {
    marginLeft: '4px',
    marginRight: '4px',
    width: '20px',
    height: '20px',
    minHeight: '20px',
    '& svg': {
      fontSize: '0.8rem',
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
  isActive,
  location = 'document',
  onEditLayout,
  onSaveContent,
  onChange,
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

  const canEdit = cellSchemaDefinition && cellSchemaDefinition.cellConfig && cellSchemaDefinition.cellConfig.disableEdit ?
    false :
    true

  const getContentTypeOptions = useCallback(({
    method,
    params,
  }) => {

    const insertHandler = (cell) => {
      onChange && onChange()
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

    const addHandler = ({
      type,
    }) => {
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


    return typeUI.addCellWidgetOptions({
      method,
      params,
      location,
      settings,
      insertHandler,
      addHandler,
    })

  }, [
    onOpenEditor,
    setAddingCell,
    settings,
    location,
    data,
    rowIndex,
    cellIndex,
  ])

  const getEditLayoutHandler = useCallback(({
    method,
    params,
  }) => () => {
    onChange && onChange()
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

  const moveItems = useMemo(() => {
    return [{
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
  }, [
    getEditLayoutHandler,
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
      items: moveItems,
    }

    const deleteOption = {
      title: 'Delete',
      help: 'Delete this cell',
      icon: DeleteIcon,
      handler: onOpenDeleteConfirm,
    }

    

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
    canEdit,
    moveItems,
  ])

  const getButton = useCallback((Icon = OptionsIcon, tooltip = "Options", className = classes.smallOptionButton) => (onClick) => {
    return (
      <Tooltip title={ tooltip }>
        <Fab
          size="small"
          color={ isActive ? "secondary" : "default" }
          className={ className }
          onClick={ onClick }
        >
          <Icon />
        </Fab>
      </Tooltip>
    )
  }, [
    classes,
    isActive,
  ])

  const onDeleteSubmit = useCallback(() => {
    onCloseDeleteConfirm()
    onChange && onChange()
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

      onChange && onChange()
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
      onChange && onChange()
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
    onChange && onChange()
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

  const buttonContainerClassname = [
    classes.buttonContainer,
    isActive ? classes.buttonContainerVisible : classes.buttonContainerHidden,
  ].join(' ')

  return (
    <React.Fragment>
      <MenuButton
        items={ menuItems }
        getButton={ getButton() }
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
      <div className={ buttonContainerClassname }>
        {
          isActive && (
            <React.Fragment>
              <div className={ [classes.toolbarButtons, classes.toolbarButtonsTop].join(' ') }>
                <MenuButton
                  items={ 
                    getContentTypeOptions({
                      method: 'insertRow',
                      params: {
                        location: 'before',
                      },
                    })
                  }
                  getButton={ getButton(AddIcon, "Add Content Above", classes.toolbarButton) }
                />
              </div>
              <div className={ classes.sidebarButtons }>
                {
                  canEdit && getButton(EditIcon, "Edit", classes.sidebarButton)(() => onOpenEditor())
                }
                <MenuButton
                  items={ moveItems }
                  getButton={ getButton(MoveIcon, "Move this cell", classes.sidebarButton) }
                />
                {
                  getButton(DeleteIcon, "Delete", classes.sidebarButton)(() => onOpenDeleteConfirm())
                }
              </div>
              <div className={ [classes.toolbarButtons, classes.toolbarButtonsBottom].join(' ') }>
                <MenuButton
                  items={ 
                    getContentTypeOptions({
                      method: 'insertRow',
                      params: {
                        location: 'after',
                      },
                    })
                  }
                  getButton={ getButton(AddIcon, "Add Content After", classes.toolbarButton) }
                />
              </div>
            </React.Fragment>
          )
        }
      </div>
    </React.Fragment>
  )
}

export default CellOptions