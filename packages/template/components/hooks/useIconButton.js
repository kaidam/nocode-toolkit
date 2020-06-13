import React from 'react'
import IconButton from '../widgets/IconButton'

const useIconButton = ({
  ...props
}) => {
  const getAddButton = (onClick) => {
    return (
      <IconButton
        onClick={ onClick }
        { ...props }
      />
    )
  }
  return getAddButton
}

export default useIconButton