import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import actions from '../../store/modules/ecommerce'

import Button from './Button'
import Confirmation from './Confirmation'

import routerSelectors from '../../store/selectors/router'
import routerActions from '../../store/modules/router'

const CURRENCY_SYMBOLS = {
  GBP: '£',
  USD: '$',
}

let hasInjectedStripeLibrary = false

const PaymentButtonWrapper = ({
  data = {},
  cell,
}) => {

  const dispatch = useDispatch()
  const [ confirm, setConfirm ] = useState(false)
  const params = useSelector(routerSelectors.params)

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

  useEffect(() => {
    if(params.trigger == 'stripe_success' && params.product_id && cell.id) {
      if(params.product_id == cell.id) {
        setConfirm(true)
        dispatch(routerActions.clearQueryParams())
      }
    }
  }, [
    params,
    cell,
  ])

  const passContent = Object.assign({}, data, {
    currencySymbol: CURRENCY_SYMBOLS[currency],
    buttonTitle,
  })

  return (
    <div>
      <Button
        content={ passContent }
        cell={ cell }
        onClick={ () => {
          dispatch(actions.purchase({
            id: cell.id,
            ...data,
          }))
        } }
      />
      {
        confirm && (
          <Confirmation
            content={ passContent }
            onClose={ () => setConfirm(false) }
          />
        )
      }
    </div>
    
  )
}

export default PaymentButtonWrapper