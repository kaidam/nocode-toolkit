import React, { useState, useEffect } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { useDispatch, useSelector } from 'react-redux'

import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

import Actions from '../../utils/actions'
import selectors from '../../store/selectors'
import contentActions from '../../store/modules/content'

import Window from '../system/Window'
import Loading from '../system/Loading'
import FormWrapper from '../form/Wrapper'
import { Typography } from '@material-ui/core'

import SortingEditor from './SortingEditor'

const useStyles = makeStyles(theme => createStyles({
  title: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  content: {
    padding: theme.spacing(3),
  },
}))

/*

  show a form dialog for adding or editing content
  using a form

  this can be used for adding local driver content to a section / item in a section
  or it can be used for adding / editing content to a remote driver item

  controller can be one of:

    "content"

    we are adding local content

    "finder"

    we are adding an item to a remote finder resource

    "remoteContent"

    we are first adding an item to a remote finder resource
    and then adding the result to local content

*/
const ContentFormDialog = ({
  
}) => {

  const classes = useStyles()

  const actions = Actions(useDispatch(), {
    onSubmit: contentActions.save,
    onCancel: contentActions.closeDialogContentForm,
    onSetItemOption: contentActions.setItemOption,
    calculateItemOptions: contentActions.calculateItemOptions,
  })

  useEffect(() => {
    resetTabs()
    actions.calculateItemOptions()
  }, [])

  const {
    controller = 'content',
    driver,
    type,
    location,
    id,
  } = useSelector(selectors.router.queryParams)

  const {
    typeTitle,
    initialValues,
    tabs,
  } = useSelector(selectors.types.form)

  const params = {
    controller,
    driver,
    type,
    location,
    id,
  }
  
  const itemOptions = useSelector(selectors.content.itemOptions)
  const allItems = useSelector(selectors.content.contentAll)
  const loading = useSelector(selectors.content.loading.save)
  const error = useSelector(selectors.content.errors.save)

  const [ currentTab, setCurrentTab ] = useState('main')
  const resetTabs = () => setCurrentTab(tabs && tabs.length > 0 ? tabs[0].id : 'main')

  const getTabContent = (tab, formElem) => {
    if(loading) {
      return (
        <Loading />
      )
    }

    if(tab.renderer == 'sorting') {
      return (
        <SortingEditor
          itemOptions={ itemOptions }
          allItems={ allItems }
          onSetItemOption={ actions.onSetItemOption }
        />
      )
    }
    else {
      return formElem
    }
  }

  const tab = tabs.find(t => t.id == currentTab)

  if(!tab) {
    return (
      <div>error no tab found for { currentTab }</div>
    )
  }

  console.log('--------------------------------------------')
  console.log('--------------------------------------------')
  console.dir(initialValues)

  return (
    <FormWrapper
      schema={ tab.schema || [] }
      initialValues={ initialValues }
      error={ error }
      onSubmit={ (data) => actions.onSubmit({params, data}) }
      renderForm={
        ({
          formElem,
          handleSubmit,
        }) => {
          return (
            <Window
              open
              compact
              withCancel
              loading={ loading }
              onSubmit={ () => {
                resetTabs()
                handleSubmit()
              }}
              onCancel={ () => {
                resetTabs()
                actions.onCancel()
              }}
            >
              <div className={ classes.title }>
                <Typography variant="h6">
                  {id == 'new' ? 'Add' : 'Edit'} {typeTitle}
                </Typography>
              </div>
              <Tabs value={ currentTab } onChange={ (e, value) => setCurrentTab(value) } aria-label="simple tabs example">
                {
                  tabs.map((tab, i) => {
                    return (
                      <Tab key={ i } label={ tab.title } value={ tab.id } />
                    )
                  })
                }
              </Tabs>
              <div className={ classes.content }>
                {
                  getTabContent(tab, formElem)
                }
              </div>
              
            </Window>
          )
        }
      }
    />
  )
}

export default ContentFormDialog
