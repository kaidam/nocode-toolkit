import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'

const CircularLoading = ({
  color = 'secondary',
}) => {
  return (
    <CircularProgress 
      color={ color }
    />
  )
}

export default CircularLoading