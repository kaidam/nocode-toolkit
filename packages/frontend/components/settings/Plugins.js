import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useDispatch, useSelector } from 'react-redux'

import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'

import Actions from '../../utils/actions'
import selectors from '../../store/selectors'
import contentActions from '../../store/modules/content'
import uiActions from '../../store/modules/ui'

import Loading from '../system/Loading'
import FormWrapper from '../form/Wrapper'

import PluginInstall from './PluginInstall'

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  tabs: {
    flexGrow: 0,
  },
  content: {
    padding: theme.spacing(5),
    flexGrow: 1,
    overflowY: 'auto',
  },
  appbar: {
    flexGrow: 0,
  },
  grow: {
    flexGrow: 1,
  },
}))

const SettingsPlugins = ({
  onClose,
}) => {

  const classes = useStyles()

  const actions = Actions(useDispatch(), {
    onSubmit: contentActions.save,
    onCancel: contentActions.closeDialogContentForm,
    updateQueryParams:  uiActions.updateQueryParams,
  })

  const {
    controller = 'content',
    driver,
    type,
    location,
    id,
    tab,
  } = useSelector(selectors.router.queryParams)

  const {
    initialValues,
    tabs,
  } = useSelector(selectors.types.pluginsForm)

  const params = {
    controller,
    driver,
    type,
    location,
    id,
  }
  
  const getTabContent = (tab, formElem) => {
    if(tab.id == 'install') {
      return (
        <PluginInstall />
      )
    }
    else {
      return formElem
    }
  }

  const activeTab = tab || tabs[0].id

  const tabConfig = tabs.find(t => t.id == activeTab)

  if(!tabConfig) {
    return (
      <div>error no tab found for { activeTab }</div>
    )
  }

  return (
    <FormWrapper
      schema={ tabConfig.schema || [] }
      initialValues={ initialValues }
      error={ error }
      onSubmit={ (data) => actions.onSubmit({params, data}) }
      renderForm={
        ({
          formElem,
          handleSubmit,
        }) => {
          return (
            <div className={ classes.container }>
              <div className={ classes.tabs }>
                <AppBar color="default" position="relative">
                  <Toolbar>
                    <Tabs value={ activeTab } onChange={ (e, value) => actions.updateQueryParams({tab:value}) } aria-label="simple tabs example">
                      {
                        tabs.map((tabConfig, i) => {
                          return (
                            <Tab key={ i } label={ tabConfig.title } value={ tabConfig.id } />
                          )
                        })
                      }
                    </Tabs>
                  </Toolbar>
                </AppBar>
              </div>
              <div className={ classes.content }>
                {
                  getTabContent(tabConfig, formElem)
                }
              </div>
              <div className={ classes.appbar }>
                <AppBar color="default" position="relative">
                  <Toolbar>
                    <div className={classes.grow} />
                      <Button
                        color="default"
                        variant="contained"
                        onClick={ onClose }
                      >
                        Close
                      </Button>
                    {
                      tabConfig.withSave && (
                        <Button
                          color="secondary"
                          variant="contained"
                          onClick={ handleSubmit }
                        >
                          Save
                        </Button>
                      )
                    }
                  </Toolbar>
                </AppBar>
              </div>
            </div>
          )
        }
      }
    />
  )
}

export default SettingsPlugins
