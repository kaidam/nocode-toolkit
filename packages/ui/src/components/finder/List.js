import React, { useMemo, useCallback } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import MenuButton from '../buttons/MenuButton'
import SimpleTable from '../table/SimpleTable'

import icons from '../../icons'
import library from '../../types/library'

const AddIcon = icons.add
const OpenIcon = icons.open
const ForwardIcon = icons.forward

const useStyles = makeStyles(theme => createStyles({
  actionsField: {
    width: '250px',
    maxWidth: '250px',
    textAlign: 'right',
  },
  filelink: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  fileIconContainer: {
    marginRight: theme.spacing(2),
    minWidth: '32px',
  },
  fileThumbnailContainer: {
    marginRight: theme.spacing(2),
    minWidth: '32px',
  },
  icon: {
    width: '32px',
  },
  thumbnail: {
    width: '32px',
    border: '1px solid #999',
  },
  fileButtonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  actionButtonContainer: {
    minWidth: '80px',
  },
  grey: {
    color: theme.palette.text.hint,
  },
}))

const FinderListAddButton = ({
  item,
  isFolder,
  addGhostMode,
  onAddContent,
}) => {

  const onAddItem = useCallback(() => {
    onAddContent({id:item.id})
  }, [item])

  const onAddItemGhost = useCallback(() => {
    onAddContent({
      id: item.id,
      data: {
        ghost: true,
      }
    })
  }, [item])

  const menuItems = useMemo(() => {
    return [{
      title: 'This folder',
      handler: onAddItem,
    },{
      title: 'Everything inside this folder',
      handler: onAddItemGhost,
    }]
  }, [onAddItem, onAddItemGhost])

  const getButton = useCallback(onClick => {
    return (
      <Button
        size="small"
        color="secondary"
        onClick={ onClick }
      >
        <AddIcon />
        Add
      </Button>
    )
  }, [])

  return isFolder && addGhostMode ? (
    <MenuButton
      items={ menuItems }
      getButton={ getButton }
    />
  ) : (
    <Button 
      size="small"
      onClick={ onAddItem }
      color="secondary"
    >
      <AddIcon />
      Add
    </Button>
  )
}

const FinderList = ({
  driver,
  items,
  addFilter,
  onOpenFolder,
  onAddContent,
}) => {
  const classes = useStyles()
  const fields = useMemo(() => {
    return [{
      title: 'Name',
      name: 'name',
    }, {
      title: 'Actions',
      name: 'actions',
      number: true,
      className: classes.actionsField,
    }]
  }, [classes.actionsField])

  const finderSchema = library.get([driver, 'finder'].join('.'))

  const data = useMemo(() => {
    return items.map((item, index) => {
      const isFolder = finderSchema.finder.isFolder(item)
      const showOpenRemotelyButton = finderSchema.finder.canOpenRemotely(item)
      const showAddButton = finderSchema.finder.canAddFromFinder(addFilter, item)
      const addGhostMode = finderSchema.finder.canAddGhostFolder(item)
      
      const icon = finderSchema.finder.getItemIcon(item)
      const thumbnail = finderSchema.finder.getItemThumbnail(item)

      return {
        id: item.id,
        name: (
          <a 
            className={ classes.filelink }
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              if(isFolder) {
                onOpenFolder(item.id)
              }
              else {
                onAddContent({id:item.id})
              }
            }}
          >
            <div className={ classes.fileThumbnailContainer }>
              {
                icon && (
                  <img 
                    className={ classes.icon }
                    src={ icon } 
                  />
                )
              }
            </div>
            <div className={ classes.fileIconContainer }>
              {
                thumbnail && (
                  <img 
                    className={ classes.thumbnail }
                    src={ thumbnail } 
                  />
                )
              }
            </div>
            { item.name }
          </a>
        ),
        item,
        actions: (
          <div className={ classes.fileButtonsContainer }>
            <div className={ classes.actionButtonContainer }>
              {
                showOpenRemotelyButton && (
                  <Button 
                    size="small"
                    onClick={ () => finderSchema.finder.openRemotely(item) }
                  >
                    <OpenIcon 
                      className={ classes.grey }
                    />
                    <span className={ classes.grey }>
                      { finderSchema.finder.openRemotelyButtonTitle(item) }
                    </span>
                  </Button>
                )
              }
            </div>
            <div className={ classes.actionButtonContainer }>
              {
                isFolder && (
                  <Button 
                    size="small"
                    onClick={ () => onOpenFolder(item.id) }
                  >
                    <ForwardIcon 
                      className={ classes.grey }
                    />
                    <span className={ classes.grey }>
                      Open
                    </span>
                  </Button>
                )
              }
            </div>
            <div className={ classes.actionButtonContainer }>
              {
                showAddButton && (
                  <FinderListAddButton
                    item={ item }
                    isFolder={ isFolder }
                    addGhostMode={ addGhostMode }
                    onAddContent={ onAddContent }
                  />
                )
              }
            </div>
          </div>
        )
      }
    })
  }, [items])

  return (
    <SimpleTable
      hideHeader
      data={ data }
      fields={ fields }
    />
  )
}

export default FinderList
