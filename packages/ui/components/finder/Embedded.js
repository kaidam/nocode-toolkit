import React, { useEffect, useCallback, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import Actions from '../../utils/actions'
import selectors from '../../store/selectors'
import finderActions from '../../store/modules/finder'

import library from '../../types/library'
import FinderUI from './UI'

import {
  SEARCH_DELAY,
} from '../../config'

const EmbeddedFinder = ({
  driver,
  listFilter,
  addFilter,
  onCancel,
  onAddContent,
}) => {

  const actions = Actions(useDispatch(), {
    onLoadList: finderActions.getList,
    onUpdateSearch: finderActions.updateSearch,
  })

  const items = useSelector(selectors.finder.list)
  const ancestors = useSelector(selectors.finder.ancestors)
  const loading = useSelector(selectors.finder.loading.getList)

  const schemaDefinition = library.get(`${driver}.finder`)
  const finderConfig = schemaDefinition.finder

  const [ parent, setParent ] = useState('root')
  const [ tab, setTab ] = useState('root')
  const [ page, setPage ] = useState(1)
  const [ search, setSearch ] = useState('')
  const [ resultsSearch, setResultsSearch ] = useState('')

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

  const onLoadList = useCallback((params = {}) => {
    const useSearch = typeof(params.search) !== 'undefined' ?
      params.search :
      search
    setResultsSearch(useSearch)
    actions.onLoadList({
      parent,
      driver,
      listFilter,
      search: useSearch,
      page,
    })
  }, [
    parent,
    driver,
    listFilter,
    search,
    page,
  ])

  const onUpdateSearch = useCallback((newSearch) => {
    setSearch(newSearch)
  }, [])

  const onSearch = useCallback((newSearch) => {
    onLoadList()
  }, [onLoadList])

  const onResetSearch = useCallback((newSearch) => {
    setSearch('')
    onLoadList({
      search: '',
    })
  }, [onLoadList])

  useEffect(() => {
    onLoadList()
  }, [parent])

  useEffect(() => {
    onLoadList()
  }, [page])

  return (
    <FinderUI
      driver={ driver }
      parent={ parent }
      finderConfig={ finderConfig }
      search={ search }
      resultsSearch={ resultsSearch }
      tab={ tab }
      items={ items }
      ancestors={ ancestors }
      addFilter={ addFilter }
      withBack={ false }
      loading={ loading }
      onOpenTab={ onOpenTab }
      onUpdateSearch={ onUpdateSearch }
      onSearch={ onSearch }
      onResetSearch={ onResetSearch}
      onLastPage={ onLastPage }
      onNextPage={ onNextPage }
      onOpenFolder={ onOpenFolder }
      onAddContent={ onAddContent }
      onCancel={ onCancel }
    />
  )
}

export default EmbeddedFinder