import React, { useEffect, useCallback, useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'

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
  const loading = useSelector(selectors.finder.loading.getList)

  const schemaDefinition = library.get(`${driver}.finder`)
  const finderConfig = schemaDefinition.finder

  const [ parent, setParent ] = useState('root')
  const [ tab, setTab ] = useState('root')
  const [ search, setSearch ] = useState('')

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
    })
  }, [
    parent,
    driver,
    listFilter,
    search,
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

  return (
    <Window
      open
      size="lg"
      title={ header }
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