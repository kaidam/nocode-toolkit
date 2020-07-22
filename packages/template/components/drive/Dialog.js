import React, { useState, useCallback, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

import driveActions from '../../store/modules/drive'
import driveSelectors from '../../store/selectors/drive'

import Actions from '../../utils/actions'

import Loading from '../system/Loading'

import Header from './Header'
import Sidebar from './Sidebar'
import List from './List'
import Breadcrumbs from './Breadcrumbs'

import Window from '../dialog/Window'

const useStyles = makeStyles(theme => createStyles({
  root: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: '100%',
  },
  sidebar: {
    width: '256px',
    minWidth: '256px',
    height: '100%',
    flexGrow: 0,
    marginRight: '50px',
  },
  body: {
    flexGrow: 1,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    paddingTop: '10px',
    flexGrow: 0,
  },
  toolbar: {
    flexGrow: 0,
    minHeight: '50px',
    height: '50px',
  },
  content: {
    flexGrow: 1,
    overflowY: 'auto',
  },
  windowContent: {
    padding: ['0px', '!important'],
    overflowY: 'hidden',
  },
  windowPaper: {
    overflowY: 'hidden', 
  },
  button: {
    marginLeft: theme.spacing(2),
  },
}))

const DriveDialog = ({
  
}) => {

  const classes = useStyles()
  const [ parent, setParent ] = useState('root')
  const [ tab, setTab ] = useState('root')
  const [ search, setSearch ] = useState('')

  const items = useSelector(driveSelectors.list)
  const ancestors = useSelector(driveSelectors.ancestors)
  const searchActive = useSelector(driveSelectors.searchActive)
  const driveWindow = useSelector(driveSelectors.window)
  const {
    addFilter,
    listFilter,
    size = 'md',
  } = (driveWindow || {})
  const isOpen = driveWindow ? true : false
  const loading = useSelector(driveSelectors.loading.getList)
  const ancestorsLoading = useSelector(driveSelectors.loading.getAncestors)

  const actions = Actions(useDispatch(), {
    onGetList: driveActions.getList,
    onGetAncestors: driveActions.getAncestors,
    onSetAncestors: driveActions.setAncestors,
    onCancel: driveActions.cancelWindow,
    onSelect: driveActions.acceptWindow,
  })

  const onCloseWindow = useCallback(() => {
    actions.onCancel()
  }, [])

  const onOpenTab = useCallback((id) => {
    setTab(id)
    setParent(id)
  }, [])

  const onOpenFolder = useCallback((id) => {
    setParent(id)
  }, [])

  const onSubmitSearch = useCallback(() => {
    actions.onGetList({
      search,
      parent: tab,
      filter: listFilter,
    })
    actions.onSetAncestors([])
  }, [
    search,
    tab,
    listFilter,
  ])

  useEffect(() => {
    if(!isOpen) return
    actions.onGetList({
      parent,
      filter: listFilter,
    })
    actions.onGetAncestors({
      parent,
    })
  }, [
    parent,
    listFilter,
    isOpen,
  ])

  return (
    <Window
      open={ isOpen }
      fullHeight
      compact
      noScroll
      withCancel
      size={ size }
      onCancel={ onCloseWindow }
    >
      <div className={ classes.root }>
        <div className={ classes.sidebar }>
          <Sidebar
            tab={ tab }
            onOpenTab={ onOpenTab }
          />
        </div>
        <div className={ classes.body }>
          <div className={ classes.header }>
            <Header
              search={ search }
              onChange={ setSearch }
              onSubmit={ onSubmitSearch }
            />
          </div>
          <div className={ classes.toolbar }>
            <Breadcrumbs
              ancestors={ ancestors }
              parent={ parent }
              searchActive={ searchActive }
              loading={ ancestorsLoading }
              onOpenFolder={ onOpenFolder }
              onOpenTab={ onOpenTab }
            />
          </div>
          <div className={ classes.content }>
            {
              loading ? (
                <Loading />
              ) : (
                <List
                  items={ items }
                  listFilter={ listFilter }
                  addFilter={ addFilter }
                  searchActive={ searchActive }
                  onOpenFolder={ onOpenFolder }
                  onSelectItem={ actions.onSelect }
                />
              )
            }
          </div>
        </div>
      </div>
    </Window>
  )
}

export default DriveDialog