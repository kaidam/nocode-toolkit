import React from 'react'

const PaymentButton = ({
  content,
  onClick,
}) => {
  return (
    <button
      onClick={ onClick }
    >
      { content.buttonTitle } ({content.currencySymbol} {content.price})
    </button>
  )
}

export default PaymentButton