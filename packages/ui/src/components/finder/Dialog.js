import React, { useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Button from '@material-ui/core/Button'

import Actions from '../../utils/actions'
import selectors from '../../store/selectors'
import uiActions from '../../store/modules/ui'
import finderActions from '../../store/modules/finder'

import library from '../../types/library'

import Window from '../system/Window'
import Loading from '../system/Loading'
import FinderHeader from './Header'
import FinderList from './List'

const onOpenTab = (id) => uiActions.updateQueryParams({
  tab: id,
  parent: id,
})

const onOpenFolder = (id) => uiActions.updateQueryParams({
  parent: id,
})

const FinderDialog = ({

}) => {
  const actions = Actions(useDispatch(), {
    onLoadList: finderActions.getList,
    onCancel: uiActions.resetQueryParams,
    onOpenTab,
    onOpenFolder,
    onUpdateQueryParams: uiActions.updateQueryParams,
    onAddContent: finderActions.addContent,
    onUpdateSearch: finderActions.updateSearch,
  })

  const queryParams = useSelector(selectors.router.queryParams)

  const {
    driver,
    parent,
    tab,
    addFilter,
  } = queryParams

  const items = useSelector(selectors.finder.list)
  const search = useSelector(selectors.finder.search)
  const loading = useSelector(selectors.finder.loading.getList)

  const schemaDefinition = library.get(`${driver}.finder`)
  const finderConfig = schemaDefinition.finder

  useEffect(() => {
    if(parent) actions.onLoadList()
  }, [parent])

  useEffect(() => {
    actions.onUpdateSearch('')
  }, [parent])

  const header = useMemo(() => {
    return (
      <FinderHeader
        driver={ driver }
        parent={ parent }
        finderConfig={ finderConfig }
        search={ search }
        tab={ tab }
        onOpenTab={ actions.onOpenTab }
        onUpdateSearch={ actions.onUpdateSearch }
      />
    )
  }, [
    driver,
    parent,
    finderConfig,
    search,
    tab,
  ])

  const leftButtons = useMemo(() => {
    return (
      <Button
        type="button"
        variant="contained"
        onClick={ () => window.history.back() }
      >
        Back
      </Button>
    )
  }, [])

  return (
    <Window
      open
      size="lg"
      title={ header }
      withCancel
      onCancel={ actions.onCancel }
      leftButtons={ leftButtons }
    >
      {
        loading ? (
          <Loading />
        ) : (
          <FinderList
            driver={ driver }
            addFilter={ addFilter }
            items={ items }
            onOpenFolder={ actions.onOpenFolder }
            onAddContent={ actions.onAddContent }
          />
        )
      }
    </Window>
  )
}

export default FinderDialog