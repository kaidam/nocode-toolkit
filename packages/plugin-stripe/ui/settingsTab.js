import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import actions from './store'
import selectors from './selectors'

const FieldRender = () => {

  const dispatch = useDispatch()
  const value = useSelector(selectors.currentValue) || 1

  return (
    <div>
      <p>Hello world { value }</p>
      <button
        type="button"
        onClick={ () => dispatch(actions.test(value+1))}
      >click me</button>
    </div>
  )
}

const settingsTab = {
  initialValues: {
    stripe: {
      test: 'hello',
    },
  },
  schema: [{
    id: 'stripe.test',
    title: 'Test',
    helperText: 'Enter a test',
    component: FieldRender,
  }],
}

export default settingsTab