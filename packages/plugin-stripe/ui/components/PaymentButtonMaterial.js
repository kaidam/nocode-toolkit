import React from 'react'
import Button from '@material-ui/core/Button'

const PaymentButton = ({
  content,
  onClick,
}) => {
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={ onClick }
    >
      { content.buttonTitle } ({content.currencySymbol}{content.price})
    </Button>    
  )
}

export default PaymentButton