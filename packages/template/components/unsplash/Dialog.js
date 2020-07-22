import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

import unsplashActions from '../../store/modules/unsplash'
import unsplashSelectors from '../../store/selectors/unsplash'

import Actions from '../../utils/actions'

import Loading from '../system/Loading'

import Header from './Header'
import Grid from './Grid'

import Window from '../dialog/Window'

const useStyles = makeStyles(theme => createStyles({
  root: {
    flexGrow: 1,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    paddingTop: '16px',
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
    margin: theme.spacing(1),
  },
}))

const UnsplashDialog = ({
  
}) => {

  const classes = useStyles()
  const [ search, setSearch ] = useState('')
  const [ submitSearch, setSubmitSearch ] = useState('')
  const [ page, setPage ] = useState(1)

  const items = useSelector(unsplashSelectors.list)

  const windowProps = useSelector(unsplashSelectors.window)
  const {
    size = 'lg',
  } = (windowProps || {})
  const loading = useSelector(unsplashSelectors.loading.getList)
  const isOpen = windowProps ? true : false

  const actions = Actions(useDispatch(), {
    onGetList: unsplashActions.getList,
    onCancel: unsplashActions.cancelWindow,
    onSelect: unsplashActions.acceptWindow,
  })

  const onCloseWindow = useCallback(() => {
    actions.onCancel()
  }, [])

  const onSubmitSearch = useCallback(() => {
    setPage(1)
    setSubmitSearch(search)
  }, [
    search,
  ])

  const movePage = useCallback((direction) => {
    let newPage = page + direction
    if(newPage < 1) newPage = 1
    setPage(newPage)
  }, [
    page,
  ])

  useEffect(() => {
    if(isOpen) {
      actions.onGetList({
        search: submitSearch,
        page,
      })
    }
  }, [
    submitSearch,
    page,
    isOpen,
  ])

  const leftButtons = useMemo(() => {
    return (
      <React.Fragment>
        <Button
          className={ classes.button }
          type="button"
          variant="contained"
          onClick={ () => movePage(1) }
        >
          Previous Page
        </Button>
        <Button
          className={ classes.button }
          type="button"
          variant="contained"
          onClick={ () => movePage(1) }
        >
          Next Page
        </Button>
      </React.Fragment>
    )
  }, [
    movePage,
  ])

  return (
    <Window
      open={ isOpen }
      fullHeight
      compact
      noScroll
      withCancel
      size={ size }
      leftButtons={ leftButtons }
      onCancel={ onCloseWindow }
    >
      <div className={ classes.root }>
        <div className={ classes.header }>
          <Header
            search={ search }
            onChange={ setSearch }
            onSubmit={ onSubmitSearch }
          />
        </div>
        <div className={ classes.content }>
          {
            loading ? (
              <Loading />
            ) : (
              <Grid
                items={ items }
                onSelectItem={ actions.onSelect }
              />
            )
          }
        </div>
      </div>
    </Window>
  )
}

export default UnsplashDialog