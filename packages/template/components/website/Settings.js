import React, { useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'

import Loading from '../system/Loading'

import VerticalTabs from '../widgets/VerticalTabs'
import WebsiteForm from '../website/Form'
import WebsiteLayout from '../website/Layout'
import WebsiteDomains from '../website/Domains'
import WebsiteSecurity from '../website/Security'
import WebsiteSnippets from '../website/Snippets'
import WebsiteEcommerce from '../website/Ecommerce'
import DialogButtons from '../widgets/DialogButtons'

import routerActions from '../../store/modules/router'
import routerSelectors from '../../store/selectors/router'
import websiteSelectors from '../../store/selectors/website'
import snackbarActions from '../../store/modules/snackbar'

import icons from '../../icons'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    height: '100%',
  },
  menuSidebar: {
    height: '100%',
    minWidth: '200px',
    flexGrow: 0,
    overflowY: 'auto',
    borderRight: 'solid 1px #ccc',
  },
  menuPaper: {
    height: '100%',
  },
  contentContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
  },
  content: {
    width: '100%',
    flexGrow: 1,
    overflow: 'auto',
    backgroundColor: '#f5f5f5',
  },
  loading: {
    paddingTop: '100px',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    padding: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(4),
  },
  buttons: {
    borderTop: 'solid 1px #ccc',
    flexGrow: 0,
  },
}))

const TABS = [{
  id: 'settings',
  title: 'Settings',
  icon: icons.settings,
  render: (props, classes) => (
    <WebsiteForm
      cancelTitle={ props.cancelTitle }
      buttonAlign={ props.buttonAlign }
      onCancel={ props.onCancel }
    />
  )
},{
  id: 'layout',
  title: 'Page Layout',
  icon: icons.layout,
  render: (props, classes) => (
    <div className={ classes.container }>
      <WebsiteLayout />
    </div>
  )
},{
  id: 'domains',
  title: 'Domains',
  icon: icons.domain,
  footer: true,
  render: (props, classes) => (
    <div className={ classes.container }>
      <WebsiteDomains />
    </div>
  )
},{
  id: 'security',
  title: 'Security',
  icon: icons.lock,
  footer: true,
  render: (props, classes) => (
    <div className={ classes.container }>
      <WebsiteSecurity />
    </div>
  )
},{
  id: 'ecommerce',
  title: 'Ecommerce',
  icon: icons.shopping,
  footer: true,
  render: (props, classes) => (
    <div className={ classes.container }>
      <WebsiteEcommerce />
    </div>
  )
},{
  id: 'snippets',
  title: 'Snippets',
  icon: icons.snippet,
  footer: true,
  render: (props, classes) => (
    <div className={ classes.container }>
      <WebsiteSnippets />
    </div>
  )
}]

/*

  ,{
  id: 'plan',
  title: 'Plan',
  icon: icons.payments,
}

*/

const WebsiteSettings = ({
  onCancel,
  cancelTitle,
  buttonAlign,
  extraTabs = [],
}) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const websiteId = useSelector(websiteSelectors.websiteId)
  const website = useSelector(websiteSelectors.websiteData)
  const params = useSelector(routerSelectors.params)

  const tabs = TABS.concat(extraTabs)

  const tab = params.section || tabs[0].id
  const isOwner = website && website.id != 'new' && website.collaboration_type == 'owner'

  useEffect(() => {
    if(websiteId == 'new') return
    if(website && website.collaboration_type != 'owner') {
      dispatch(snackbarActions.setError(`access denied`))
      dispatch(routerActions.navigateTo('website.list'))
    }
  }, [
    website,
  ])

  const onChangeTab = useCallback((section) => {
    dispatch(routerActions.addQueryParams({section}))
  })

  if(!website) {
    return (
      <div className={ classes.loading }>
        <Loading />
      </div>
    )
  }

  if(!isOwner) {
    return (
      <div>
        <div className={ classes.container }>
          <Grid container spacing={ 0 }>
            <Grid item xs={ 6 }>
              <Paper className={ classes.paper }>
                <WebsiteForm
                  new
                  onCancel={ onCancel }
                />
              </Paper>
            </Grid>
          </Grid>
        </div>
      </div> 
    )
  }

  const tabInfo = tabs.find(t => t.id == tab)
  const tabProps = {
    buttonAlign,
    cancelTitle,
    onCancel,
  }

  return (
    <div className={ classes.root }>
      <div className={ classes.menuSidebar }>
        <VerticalTabs
          selected={ tab }
          tabs={ tabs }
          onChange={ onChangeTab }
        />
      </div>
      <div className={ classes.contentContainer }>
        <div className={ classes.content }>
          {
            tabInfo.render(tabProps, classes)
          }
        </div>
        {
          tabInfo.footer && (
            <div className={ classes.buttons }>
              <DialogButtons
                align={ buttonAlign }
                cancelTitle={ cancelTitle }
                onCancel={ onCancel }
              />
            </div>
          )
        }
      </div>
    </div>
  )
}

export default WebsiteSettings