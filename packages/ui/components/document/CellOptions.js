import React, { useState, useCallback, useMemo } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { useDispatch } from 'react-redux'
import Fab from '@material-ui/core/Fab'

import Actions from '../../utils/actions'
import MenuButton from '../buttons/MenuButton'
import Window from '../system/Window'

import CellEditor from './CellEditor'

import typeUI from '../../types/ui'
import icons from '../../icons'

import documentActions from '../../store/modules/document'

const SettingsIcon = icons.settings
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
}) => {

  const classes = useStyles()

  const actions = Actions(useDispatch(), {
    editLayout: documentActions.editLayout,
    saveContent: documentActions.saveContent,
  })

  const [ deleteConfirmOpen, setDeleteConfirmOpen ] = useState(false)
  const [ editorOpen, setEditorOpen ] = useState(false)
  const [ addingCell, setAddingCell ] = useState(null)

  const onOpenDeleteConfirm = useCallback(() => setDeleteConfirmOpen(true), [])
  const onCloseDeleteConfirm = useCallback(() => setDeleteConfirmOpen(false), [])
  const onOpenEditor = useCallback(() => setEditorOpen(true), [])
  const onCloseEditor = useCallback(() => setEditorOpen(false), [])

  const getContentTypeOptions = useCallback(({
    method,
    params,
  }) => {
    return typeUI.addContentOptionsWithCallback({
      filter: parentFilter => parentFilter.indexOf('cell') >= 0,
      handler: (type) => {
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
        onOpenEditor()
      }
    })
  }, [onOpenEditor, setAddingCell])

  const getEditLayoutHandler = useCallback(({
    method,
    params,
  }) => () => {
    actions.editLayout({
      data,
      rowIndex,
      cellIndex,
      method,
      params,
      cell,
    })
  }, [data, rowIndex, cellIndex, cell])

  const menuItems = useMemo(() => {
    let editOptions = {
      title: 'Edit',
      help: 'Edit this content',
      icon: EditIcon,
      handler: onOpenEditor,
    }

    const insertOptions = {
      title: 'Insert',
      help: 'Insert rows or cells',
      icon: AddIcon,
      items: [{
        title: 'Insert Row Before',
        help: 'Insert a row before this row',
        icon: IconCombo(UpIcon, RowIcon),
        items: getContentTypeOptions({
          method: 'insertRow',
          params: {
            location: 'before',
          },
        })
      }, {
        title: 'Insert Row After',
        help: 'Insert a row after this row',
        icon: IconCombo(DownIcon, RowIcon),
        items: getContentTypeOptions({
          method: 'insertRow',
          params: {
            location: 'after',
          },
        })
      }, {
        title: 'Insert Cell Before',
        help: 'Insert a cell before this cell',
        icon: IconCombo(LeftIcon, CellIcon),
        items: getContentTypeOptions({
          method: 'insertCell',
          params: {
            location: 'before',
          },
        })
      }, {
        title: 'Insert Cell After',
        help: 'Insert a cell after this cell',
        icon: IconCombo(RightIcon, CellIcon),
        items: getContentTypeOptions({
          method: 'insertCell',
          params: {
            location: 'after',
          },
        })
      }]
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

    return [
      editOptions,
      insertOptions,
      moveOptions,
      deleteOption,
    ]
  }, [getEditLayoutHandler, getContentTypeOptions])

  const getButton = useCallback((onClick) => {
    return (
      <Fab
        size="small"
        className={ classes.smallOptionButton }
        onClick={ onClick }
      >
        <SettingsIcon />
      </Fab>
    )
  }, [classes])

  const onDeleteSubmit = useCallback(() => {
    onCloseDeleteConfirm()
    actions.editLayout({
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
      actions.editLayout({
        data,
        rowIndex,
        cellIndex,
        method,
        params,
        cell: {
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
      actions.saveContent({
        item: data.item,
        cell,
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

  const onEditorCancel = useCallback(() => {
    onCloseEditor()
    setAddingCell(null)
  }, [])

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
    </React.Fragment>
  )
}

export default CellOptions