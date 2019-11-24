import React, { useEffect, useCallback, useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

import Actions from '../../utils/actions'
import selectors from '../../store/selectors'
import finderActions from '../../store/modules/finder'

import library from '../../types/library'

import Window from '../system/Window'
import Loading from '../system/Loading'
import FinderHeader from './Header'
import FinderList from './List'

import {
  SEARCH_DELAY,
} from '../../config'

const useStyles = makeStyles(theme => createStyles({
  buttonsContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
  },
  button: {
    marginLeft: theme.spacing(2),
  },
}))

const EmbeddedFinder = ({
  driver,
  listFilter,
  addFilter,
  onCancel,
  onAddContent,
}) => {

  const classes = useStyles()

  const actions = Actions(useDispatch(), {
    onLoadList: finderActions.getList,
    onUpdateSearch: finderActions.updateSearch,
  })

  const items = useSelector(selectors.finder.list)
  const loading = useSelector(selectors.finder.loading.getList)

  const schemaDefinition = library.get(`${driver}.finder`)
  const finderConfig = schemaDefinition.finder

  const [ parent, setParent ] = useState('root')
  const [ tab, setTab ] = useState('root')
  const [ page, setPage ] = useState(1)
  const [ search, setSearch ] = useState('')

  const onLastPage = useCallback(() => {
    if(page <= 1) return
    setPage(page-1)
  }, [page])

  const onNextPage = useCallback(() => {
    setPage(page+1)
  }, [page])

  const onOpenTab = useCallback((id) => {
    setParent(id)
    setTab(id)
    setSearch('')
  }, [])

  const onOpenFolder = useCallback((id) => {
    setParent(id)
    setSearch('')
  })

  const onLoadList = useCallback(() => {
    actions.onLoadList({
      parent,
      driver,
      listFilter,
      search,
      page,
    })
  }, [
    parent,
    driver,
    listFilter,
    search,
    page,
  ])

  let searchTimeout = null

  const onUpdateSearch = useCallback((newSearch) => {
    setSearch(newSearch)
    if(searchTimeout) clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
      onLoadList()
      searchTimeout = null
    }, SEARCH_DELAY)
  }, [onLoadList])

  useEffect(() => {
    onLoadList()
  }, [parent])

  useEffect(() => {
    onLoadList()
  }, [page])

  const header = useMemo(() => {
    return (
      <FinderHeader
        driver={ driver }
        parent={ parent }
        finderConfig={ finderConfig }
        search={ search }
        tab={ tab }
        onOpenTab={ onOpenTab }
        onUpdateSearch={ onUpdateSearch }
      />
    )
  }, [
    driver,
    parent,
    finderConfig,
    search,
    tab,
    onOpenTab,
    onUpdateSearch,
  ])

  const leftButtons = useMemo(() => {
    if(!finderConfig.hasPagination()) return null
    return (
      <div className={ classes.buttonContainer }>
        <Button
          className={ classes.button }
          type="button"
          variant="contained"
          onClick={ onLastPage }
        >
          Last Page
        </Button>
        <Button
          className={ classes.button }
          type="button"
          variant="contained"
          onClick={ onNextPage }
        >
          Next Page
        </Button>
      </div>
    )
  }, [finderConfig, onLastPage, onNextPage])

  return (
    <Window
      open
      size="lg"
      title={ header }
      leftButtons={ leftButtons }
      withCancel
      onCancel={ onCancel }
    >
      {
        loading ? (
          <Loading />
        ) : (
          <FinderList
            driver={ driver }
            addFilter={ addFilter }
            items={ items }
            onOpenFolder={ onOpenFolder }
            onAddContent={ onAddContent }
          />
        )
      }
    </Window>
  )
}

export default EmbeddedFinder