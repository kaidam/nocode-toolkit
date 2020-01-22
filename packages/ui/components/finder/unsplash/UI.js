import React, { useMemo } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

import Window from '../../system/Window'
import Loading from '../../system/Loading'
import FinderHeader from '../Header'
import FinderList from '../List'
import FinderGrid from '../Grid'

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

const UnsplashUI = ({
  driver,
  parent,
  finderConfig,
  search,
  tab,
  items,
  addFilter,
  withBack,
  loading,
  onOpenTab,
  onUpdateSearch,
  onSearch,
  onResetSearch,
  onLastPage,
  onNextPage,
  onOpenFolder,
  onAddContent,
  onCancel,
}) => {

  const classes = useStyles()

  const header = useMemo(() => {
    const title = finderConfig.getFinderTitle()
    return (
      <FinderHeader
        title={ title }
        driver={ driver }
        parent={ parent }
        finderConfig={ finderConfig }
        search={ search }
        tab={ tab }
        onOpenTab={ onOpenTab }
        onUpdateSearch={ onUpdateSearch }
        onSearch={ onSearch }
        onResetSearch={ onResetSearch }
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
    onSearch,
    onResetSearch,
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

    const backButton = withBack && (
      <Button
        className={ classes.button }
        type="button"
        variant="contained"
        onClick={ () => window.history.back() }
      >
        Back
      </Button>
    )

    return (
      <div className={ classes.buttonContainer }>
        { backButton }
        { paginationButtons }
      </div>
    )
  }, [
    withBack,
    finderConfig,
    onLastPage,
    onNextPage,
  ])

  const content = useMemo(() => {
    const renderStyle = finderConfig.renderStyle()
    if(renderStyle == 'list') {
      return (
        <FinderList
          driver={ driver }
          addFilter={ addFilter }
          items={ items }
          onOpenFolder={ onOpenFolder }
          onAddContent={ onAddContent }
        />
      )
    }
    else if(renderStyle == 'grid') {
      return (
        <FinderGrid
          driver={ driver }
          addFilter={ addFilter }
          items={ items }
          finderConfig={ finderConfig }
          onOpenFolder={ onOpenFolder }
          onAddContent={ onAddContent }
        />
      )
    }
    else {
      return (
        <div>unknown render style {renderStyle}</div>
      )
    }
  }, [
    driver,
    addFilter,
    items,
    onOpenFolder,
    onAddContent,
  ])

  return (
    <Window
      open
      size="lg"
      title={ header }
      withCancel
      onCancel={ onCancel }
      leftButtons={ leftButtons }
    >
      {
        loading ? (
          <Loading />
        ) : (
          content
        )
      }
    </Window>
  )
}

export default UnsplashUI