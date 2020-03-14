import React from 'react'
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery'

import useGetGlobalOptions from '../hooks/useGetGlobalOptions'
import MenuButton from '../widgets/MenuButton'

const GlobalOptions = ({
  getButton,
}) => {

  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.up('sm'))

  const getGlobalOptions = useGetGlobalOptions({
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