import React, { useMemo } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

import Loading from '../../system/Loading'

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

  const header = useMemo(() => {
    const title = finderConfig.getFinderTitle()
    return (
      <FinderHeader
        title={ title }
        finderConfig={ finderConfig }
        search={ search }
        resultsSearch={ resultsSearch }
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
        addFilter={ addFilter }
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

  const breadcrumbs = useMemo(() => {
    return (
      <FinderBreadcrumbs
        ancestors={ ancestors }
        parent={ parent }
        search={ search }
        resultsSearch={ resultsSearch }
        onOpenFolder={ onOpenFolder }
        onOpenTab={ onOpenTab }
      />
    )
  }, [
    ancestors,
    parent,
    search,
    onOpenFolder,
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
      <List
        driver={ driver }
        mode={ mode }
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
      withCancel
      onCancel={ onCancel }
      cancelTitle="Close"
      leftButtons={ leftButtons }
      classNames={{
        content: classes.windowContent,
        paper: classes.windowPaper,
      }}
    >
      <div className={ classes.root }>
        <div className={ classes.sidebar }>
          { sidebar }
        </div>
        <div className={ classes.body }>
          <div className={ classes.header }>
            { header }
          </div>
          <div className={ classes.toolbar }>
            { breadcrumbs }
          </div>
          <div className={ classes.content }>
            {
              loading ? (
                <Loading />
              ) : (
                <List
                  addFilter={ addFilter }
                  items={ items }
                  onOpenFolder={ onOpenFolder }
                  onAddContent={ onAddContent }
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