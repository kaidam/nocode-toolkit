import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Button from '@material-ui/core/Button'
import Popper from '@material-ui/core/Popper'
import Paper from '@material-ui/core/Paper'
import withMenuButton from '../hooks/withMenuButton'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import colorUtils from '../../utils/color'
import Actions from '../../utils/actions'
import layoutActions from '../../store/modules/layout'

import icons from '../../icons'

const AddIcon = icons.add
const EditIcon = icons.edit
const DeleteIcon = icons.delete
const MoveIcon = icons.move
const RowIcon = icons.row
const CellIcon = icons.cell
const UpIcon = icons.up
const DownIcon = icons.down
const LeftIcon = icons.left
const RightIcon = icons.right

const useStyles = makeStyles(theme => {
  return {
    root: {
      display: 'flex',
      flexDirection: 'row',
      borderRadius: '24px',
      padding: theme.spacing(0.75),
      backgroundColor: theme.palette.grey[200],
      boxShadow: `5px 5px 5px 0px rgba(0,0,0,0.3)`,
    },
    iconSection: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    iconContainer: {
      marginLeft: theme.spacing(0.25),
      marginRight: theme.spacing(0.25),
      padding: theme.spacing(0.2),
      borderRadius: '16px',
      backgroundColor: '#fff',
    },
    icon: {
      fontSize: '0.85em',
    },
    button: {
      color: theme.palette.grey[500],
      textTransform: 'lowercase',
      padding: theme.spacing(0.5),
      '&:hover': {
        color: theme.palette.secondary.main,
      }
    },
    buttonIcon: {
      fontSize: '1em',
    },
  }
})

const IconCombo = (Left, Right) => () => (
  <div>
    <Left />
    <Right />
  </div>
)

const EditableCellMenu = ({
  layout,
  cell,
  content_id,
  layout_id,
  rowIndex,
  cellIndex,
  anchorEl,
  getAddMenu,
  onClose,
  onReset,
}) => {
  const classes = useStyles()

  const actions = Actions(useDispatch(), {
    onLayoutEdit: layoutActions.edit,
    onLayoutDelete: layoutActions.delete,
    onLayoutMove: layoutActions.move,
  })

  const onEdit = () => actions.onLayoutEdit({
    content_id,
    layout_id,
    rowIndex,
    cellIndex,
  })

  const onDelete = () => actions.onLayoutDelete({
    content_id,
    layout_id,
    rowIndex,
    cellIndex,
  })

  const getAddMenuItems = useCallback(() => getAddMenu(rowIndex+1), [rowIndex])
  const getMoveMenuItems = useCallback(() => {

    const getOnMoveHandler = ({
      direction,
      merge,
    }) => () => actions.onLayoutMove({
      content_id,
      layout_id,
      rowIndex,
      cellIndex,
      direction,
      merge,
    })

    const row = layout[rowIndex]

    const up = (rowIndex > 0 || row.length > 1) ? {
      title: 'Up',
      icon: IconCombo(UpIcon, RowIcon),
      handler: rowIndex == 0 ? getOnMoveHandler({
        direction: 'up',
        merge: false,
      }) : null,
      items: rowIndex == 0 ? null : [{
        title: 'Up: Own Row',
        icon: IconCombo(UpIcon, RowIcon),
        handler: getOnMoveHandler({
          direction: 'up',
          merge: false,
        })
      }, {
        title: 'Up: Merge',
        icon: IconCombo(UpIcon, RowIcon),
        handler: getOnMoveHandler({
          direction: 'up',
          merge: true,
        })
      }]
    } : null

    const down = (rowIndex < layout.length - 1 || row.length > 1) ? {
      title: 'Down',
      icon: IconCombo(DownIcon, RowIcon),
      handler: rowIndex == layout.length - 1 ? getOnMoveHandler({
        direction: 'down',
        merge: false,
      }) : null,
      items: rowIndex == layout.length - 1 ? null : [{
        title: 'Down: Own Row',
        icon: IconCombo(DownIcon, RowIcon),
        handler: getOnMoveHandler({
          direction: 'down',
          merge: false,
        })
      }, {
        title: 'Down: Merge',
        icon: IconCombo(DownIcon, RowIcon),
        handler: getOnMoveHandler({
          direction: 'down',
          merge: true,
        })
      }]
    } : null

    const left = cellIndex > 0 ? {
      title: 'Left',
      icon: IconCombo(LeftIcon, CellIcon),
      handler: getOnMoveHandler({
        direction: 'left',
      })
    } : null

    const right = cellIndex < row.length - 1 ? {
      title: 'Right',
      icon: IconCombo(RightIcon, CellIcon),
      handler: getOnMoveHandler({
        direction: 'right',
      })
    } : null

    return [
      up,
      down,
      left,
      right,
    ].filter(i => i)
  }, [
    layout,
    content_id,
    layout_id,
    rowIndex,
    cellIndex,
  ])

  const addMenu = withMenuButton({
    getItems: getAddMenuItems,
    noHeader: true,
    onClick: onReset,
    onClose,
  })

  const moveMenu = withMenuButton({
    getItems: getMoveMenuItems,
    noHeader: true,
    onClick: onReset,
    onClose,
  })

  return (
    <Popper
      open
      id="options-popover"
      anchorEl={ anchorEl }
    >
      <div className={ classes.root }>
        <div className={ classes.iconSection }>
          <div className={ classes.iconContainer }>
            <Tooltip title="Edit" placement="top">
              <IconButton
                size="small"
                onClick={ onEdit }
              >
                <EditIcon
                  fontSize="inherit"
                  color="primary"
                  className={ classes.icon }
                />
              </IconButton>
            </Tooltip>
          </div>
          <div className={ classes.iconContainer }>
            <Tooltip title="Move" placement="top">
              <IconButton
                size="small"
                onClick={ moveMenu.onClick }
              >
                <MoveIcon
                  fontSize="inherit"
                  color="primary"
                  className={ classes.icon }
                />
              </IconButton>
            </Tooltip>
          </div>
          <div className={ classes.iconContainer }>
            <Tooltip title="Delete" placement="top">
              <IconButton
                size="small"
                onClick={ onDelete }
              >
                <DeleteIcon
                  fontSize="inherit"
                  color="primary"
                  className={ classes.icon }
                />
              </IconButton>
            </Tooltip>
          </div>
          <div className={ classes.iconContainer }>
            <Tooltip title="Add" placement="top">
              <IconButton
                size="small"
                onClick={ addMenu.onClick }
              >
                <AddIcon
                  fontSize="inherit"
                  color="secondary"
                  className={ classes.icon }
                />
              </IconButton>
            </Tooltip>
          </div>
        </div>
        {
          addMenu.menus
        }
        {
          moveMenu.menus
        }
      </div>
    </Popper>
  )
}

export default EditableCellMenu