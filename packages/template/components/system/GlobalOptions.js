import React from 'react'
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery'

import useGlobalOptions from '../hooks/useGlobalOptions'
import MenuButton from '../widgets/MenuButton'

const GlobalOptions = ({
  getButton,
}) => {

  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.up('md'))

  const getGlobalOptions = useGlobalOptions({
    includeExtra: matches ? false : true,
  })

  return (
    <MenuButton
      getItems={ getGlobalOptions }
      getButton={ getButton || defaultGetButton }
    />
  )
}

export default GlobalOptions