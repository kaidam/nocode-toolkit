import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import actions from '../store'

import Button from './Button'
import FormDialog from './FormDialog'

const ContactFormWrapper = ({
  renderers,
  content,
  cell,
}) => {

  const RenderButton = renderers.button || Button
  const RenderFormDialog = renderers.formDialog || FormDialog

  return (
    <div>contact form</div>
  )
}

export default ContactFormWrapper