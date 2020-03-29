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
  const window = useSelector(driveSelectors.window)
  const loading = useSelector(driveSelectors.loading.getList)

  const {
    addFilter,
    listFilter,
  } = window

  const actions = Actions(useDispatch(), {
    onGetList: driveActions.getList,
    onGetAncestors: driveActions.getAncestors,
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
      driver: 'drive',
      search,
      parent: tab,
      filter: listFilter,
    })
  }, [
    search,
    tab,
    listFilter,
  ])

  useEffect(() => {
    actions.onGetList({
      driver: 'drive',
      parent,
      filter: listFilter,
    })
  }, [
    parent,
    listFilter,
  ])

  return (
    <Window
      open
      fullHeight
      compact
      noScroll
      withCancel
      size="xl"
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
                  addFilter={ addFilter }
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


  // const leftButtons = useMemo(() => {
  //   const paginationButtons = finderConfig.hasPagination() && (
  //     <React.Fragment>
  //       <Button
  //         className={ classes.button }
  //         type="button"
  //         variant="contained"
  //         onClick={ onLastPage }
  //       >
  //         Last Page
  //       </Button>
  //       <Button
  //         className={ classes.button }
  //         type="button"
  //         variant="contained"
  //         onClick={ onNextPage }
  //       >
  //         Next Page
  //       </Button>
  //     </React.Fragment>
  //   )

  //   const backButton = withBack && (
  //     <Button
  //       className={ classes.button }
  //       type="button"
  //       variant="contained"
  //       onClick={ () => window.history.back() }
  //     >
  //       Back
  //     </Button>
  //   )

  //   return (
  //     <div className={ classes.buttonContainer }>
  //       { backButton }
  //       { paginationButtons }
  //     </div>
  //   )
  // }, [
  //   withBack,
  //   finderConfig,
  //   onLastPage,
  //   onNextPage,
  // ])