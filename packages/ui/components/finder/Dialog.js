import React, { useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createStyles, makeStyles } from '@material-ui/core/styles'
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

const FinderDialog = ({

}) => {

  const classes = useStyles()

  const actions = Actions(useDispatch(), {
    onLoadList: finderActions.getList,
    onCancel: uiActions.resetQueryParams,
    onOpenTab,
    onOpenFolder,
    onOpenPage,
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
    const paginationButtons = finderConfig.hasPagination() && (
      <React.Fragment>
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
      </React.Fragment>
    )

    return (
      <div className={ classes.buttonContainer }>
        <Button
          className={ classes.button }
          type="button"
          variant="contained"
          onClick={ () => window.history.back() }
        >
          Back
        </Button>
        { paginationButtons }
      </div>
    )
  }, [finderConfig])

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