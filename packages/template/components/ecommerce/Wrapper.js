import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import actions from '../../store/modules/ecommerce'

import Button from './Button'
import Confirmation from './Confirmation'

import ecommerceSelectors from '../../store/selectors/ecommerce'

const CURRENCY_SYMBOLS = {
  GBP: '£',
  USD: '$',
}

let hasInjectedStripeLibrary = false

const PaymentButtonWrapper = ({
  data = {},
  cell,
}) => {

  const {
    currency,
    buttonTitle = `Purchase ${data.name}`,
  } = data

  useEffect(() => {
    if(hasInjectedStripeLibrary) return
    hasInjectedStripeLibrary = true
    const script = document.createElement("script")
    script.src = "https://js.stripe.com/v3/"
    script.async = false
    document.body.appendChild(script)
  }, [hasInjectedStripeLibrary])

  const dispatch = useDispatch()
  const currencySymbol = CURRENCY_SYMBOLS[currency]
  const passContent = Object.assign({}, data, {
    currencySymbol,
    buttonTitle,
  })
  const onClick = () => {
    dispatch(actions.purchase({
      id: cell.id,
      ...data,
    }))
  }
  const purchasedProductId = useSelector(ecommerceSelectors.purchasedProductId)
  let confirmWindow = null
  if(purchasedProductId == cell.id) {
    const onClose = () => {
      dispatch(actions.closeConfirmationWindow())
    }
    confirmWindow =  (
      <Confirmation
        content={ passContent }
        onClose={ onClose }
      />
    )
  }
  return (
    <div>
      <Button
        content={ passContent }
        cell={ cell }
        onClick={ onClick }
      />
      { confirmWindow }
    </div>
    
  )
}

export default PaymentButtonWrapper