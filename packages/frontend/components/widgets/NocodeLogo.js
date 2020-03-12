import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  logoLink: {
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    height: `${theme.layout.uiLogoHeight}px`,
  },
}))

const NocodeLogo = ({
  children,
  onClick,
}) => {

  const classes = useStyles()

  return (
    <div
      className={ classes.logoLink }
      onClick={ onClick }
    >
      <img src="images/favicon.png" className={ classes.logo } />
      { children }
    </div>
  )
}

export default NocodeLogo
