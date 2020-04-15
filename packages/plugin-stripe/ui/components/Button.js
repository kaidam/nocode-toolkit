import React from 'react'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

const PaymentButton = ({
  content,
  onClick,
}) => {
  return (
    <div>
      <div>
        <Button
          variant="contained"
          color="primary"
          onClick={ onClick }
        >
          { content.buttonTitle } ({content.currencySymbol}{content.price})
        </Button> 
      </div>
      {
        content.description && (
          <div style={{marginTop: '10px'}}>
            <Typography>
              { content.description }
            </Typography>
          </div>
        )
      }
    </div>
  )
}

export default PaymentButton