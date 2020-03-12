import React from 'react'
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery'

import useGlobalOptions from '../../hooks/globalOptions'

import NocodeLogo from '../widgets/NocodeLogo'
import MenuButton from '../widgets/MenuButton'

const GlobalOptions = ({
  children,
  getButton,
}) => {

  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.up('sm'))

  const menuItems = useGlobalOptions({
    includeExtra: matches ? false : true,
  })

  const defaultGetButton = onClick => (
    <NocodeLogo
      onClick={ onClick }
    >
      { children }
    </NocodeLogo>
  )

  return (
    <MenuButton
      items={ menuItems }
      getButton={ getButton || defaultGetButton }
    />
  )
}

export default GlobalOptions