import React from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

const useStyles = makeStyles(theme => createStyles({
  
}))

const PaymentButton = ({
  content,
}) => {

  console.log('--------------------------------------------')
  console.log('--------------------------------------------')
  console.dir(content)

  const classes = useStyles()
  
  return (
    <div>
      MUI PAYMENT
    </div> 
  )
}

export default PaymentButton