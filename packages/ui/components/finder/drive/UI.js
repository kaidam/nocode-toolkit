import React, { useMemo } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

import Window from '../../system/Window'
import Loading from '../../system/Loading'
import FinderHeader from './Header'
import FinderSidebar from './Sidebar'
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
  root: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
  sidebar: {
    position: 'fixed',
    width: '256px',
    minWidth: '256px',
    flexGrow: 0,
  },
  content: {
    paddingLeft: '266px',
    flexGrow: 1,
  },
  windowContent: {
    padding: '0px',
  }
}))

const DriveUI = ({
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
        finderConfig={ finderConfig }
        search={ search }
        onUpdateSearch={ onUpdateSearch }
        onSearch={ onSearch }
        onResetSearch={ onResetSearch }
      />
    )
  }, [
    finderConfig,
    search,
    onUpdateSearch,
    onSearch,
    onResetSearch,
  ])

  const sidebar = useMemo(() => {
    return (
      <FinderSidebar
        driver={ driver }
        parent={ parent }
        finderConfig={ finderConfig }
        search={ search }
        tab={ tab }
        onOpenTab={ onOpenTab }
      />
    )
  }, [
    driver,
    parent,
    finderConfig,
    search,
    tab,
    onOpenTab,
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
    return (
      <FinderList
        driver={ driver }
        addFilter={ addFilter }
        items={ items }
        onOpenFolder={ onOpenFolder }
        onAddContent={ onAddContent }
      />
    )
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
      classNames={{
        content: classes.windowContent,
      }}
    >
      <div className={ classes.root }>
        <div className={ classes.sidebar }>
          { sidebar }
        </div>
        <div className={ classes.content }>
          {
            loading ? (
              <Loading />
            ) : (
              content
            )
          }
        </div>
      </div>
    </Window>
  )
}

export default DriveUI