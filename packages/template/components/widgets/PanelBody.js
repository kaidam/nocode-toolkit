import React from 'react'
import classnames from 'classnames'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  contentHeader: {
    flexGrow: 0,
  },
  contentBody: {
    flexGrow: 1,
  },
  contentFooter: {
    flexGrow: 0,
  },
  contentScroll: {
    overflowY: 'auto',
    overflowX: 'hidden',
  },
}))

const PanelBody = ({
  header,
  children,
  footer,
  autoScroll = true,
  theme = {},
}) => {
  const classes = useStyles()

  const bodyClassname = classnames({
    [classes.contentScroll]: autoScroll,
  }, classes.contentBody, theme.body)

  const headerClassname = classnames(classes.contentHeader, theme.header)
  const footerClassname = classnames(classes.contentFooter, theme.footer)

  return (
    <div className={ classes.root }>
      {
        header && (
          <div className={ headerClassname }>
            { header }
          </div>
        )
      }
      <div className={ bodyClassname }>
        { children }
      </div>
      {
        footer && (
          <div className={ footerClassname }>
            { footer }
          </div>
        )
      }
    </div>
  )
  
}

export default PanelBody