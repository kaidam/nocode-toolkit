import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
  root: {
    '& > p:first-child': {
      marginBlockStart: '0px',
      marginBlockEnd: '0px',
    },
    '& > p:last-child': {
      marginBlockStart: '0px',
      marginBlockEnd: '0px',
    },
  }
})

const RichText = ({
  content,
}) => {
  const classes = useStyles()
  return (
    <div 
      className={ classes.root }
      dangerouslySetInnerHTML={{__html: content ? content.text : '' }}
    >
    </div>
  )
}

export default RichText