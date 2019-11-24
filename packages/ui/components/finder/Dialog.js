import React, { useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import Actions from '../../utils/actions'
import selectors from '../../store/selectors'
import uiActions from '../../store/modules/ui'
import finderActions from '../../store/modules/finder'

import library from '../../types/library'
import FinderUI from './UI'

const onOpenTab = (id) => uiActions.updateQueryParams({
  tab: id,
  parent: id,
})

const onOpenFolder = (id) => uiActions.updateQueryParams({
  parent: id,
})

const onOpenPage = (page) => uiActions.updateQueryParams({
  page,
})

const onResetSearch = () => finderActions.updateSearch('')

const FinderDialog = ({

}) => {

  const actions = Actions(useDispatch(), {
    onLoadList: finderActions.getList,
    onCancel: uiActions.resetQueryParams,
    onOpenTab,
    onOpenFolder,
    onOpenPage,
    onUpdateQueryParams: uiActions.updateQueryParams,
    onAddContent: finderActions.addContent,
    onUpdateSearch: finderActions.updateSearch,
    onResetSearch: finderActions.resetSearch,
  })

  const queryParams = useSelector(selectors.router.queryParams)

  const {
    driver,
    parent,
    tab,
    addFilter,
    page = 1,
  } = queryParams

  const items = useSelector(selectors.finder.list)
  const search = useSelector(selectors.finder.search)
  const loading = useSelector(selectors.finder.loading.getList)

  const schemaDefinition = library.get(`${driver}.finder`)
  const finderConfig = schemaDefinition.finder

  const onLastPage = useCallback(() => {
    if(page <= 1) return
    actions.onOpenPage(page-1)
  }, [page])

  const onNextPage = useCallback(() => {
    actions.onOpenPage(page+1)
  }, [page])

  useEffect(() => {
    actions.onLoadList()
  }, [parent])

  useEffect(() => {
    actions.onUpdateSearch('')
  }, [parent])

  return (
    <FinderUI
      driver={ driver }
      parent={ parent }
      finderConfig={ finderConfig }
      search={ search }
      tab={ tab }
      items={ items }
      addFilter={ addFilter }
      withBack={ true }
      loading={ loading }
      onOpenTab={ actions.onOpenTab }
      onUpdateSearch={ actions.onUpdateSearch }
      onResetSearch={ actions.onResetSearch }
      onSearch={ actions.onLoadList }
      onLastPage={ onLastPage }
      onNextPage={ onNextPage }
      onOpenFolder={ actions.onOpenFolder }
      onAddContent={ actions.onAddContent }
      onCancel={ actions.onCancel }
    />
  )
}

export default FinderDialog