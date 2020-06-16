import React, { useState, useMemo, useCallback } from 'react'
import { useSelector } from 'react-redux'

import contentSelectors from '../../store/selectors/content'

import FormWrapper from '../form/Wrapper'
import FormRender from '../form/Render'
import Tabs from '../widgets/Tabs'
import DialogButtons from '../widgets/DialogButtons'

const useForm = ({
  onSubmit,
  onCancel,
}) => {

  const [ tab, setTab ] = useState(initialTab)
  const form = useSelector(contentSelectors.form)
  const formWindow = useSelector(contentSelectors.formWindow)
  const formValues = useSelector(contentSelectors.formValues)
  const flatFormSchema = useSelector(contentSelectors.flatFormSchema)

  const {
    initialTab,
  } = formWindow

  // this is so form handlers can be given a context
  // that they have selected from the store
  const handlerContext = useSelector(state => {
    return form.contextSelector ?
      form.contextSelector(state) :
      {}
  })

  const useValues = useMemo(() => {
    if(form.processInitialValues) {
      return form.processInitialValues(formValues, handlerContext)
    }
    else {
      return formValues
    }
  }, [
    formValues,
    handlerContext,
  ])

  const currentTabId = useMemo(() => {
    if(form.tabs && form.tabs.length > 0) {
      const currentTab = form.tabs.find(t => t.id == tab) || form.tabs[0]
      return tab || currentTab.id
    }
    else {
      return tab
    }
  }, [
    tab,
    form.tabs,
    form.schema,
  ])

  const currentSchema = useMemo(() => {
    if(form.schema) {
      return form.schema
    }
    else if(form.tabs && form.tabs.length > 0) {
      const currentTab = form.tabs.find(t => t.id == currentTabId) || form.tabs[0]
      return currentTab.schema
    }
    else {
      return []
    }
  }, [
    currentTabId,
    form.tabs,
    form.schema,
  ])

  const getTabs = useCallback(({
    values,
  }) => {
    const useTabs = form.tabFilter ? form.tabFilter({
      tabs: form.tabs,
      values,
    }) : form.tabs
    return useTabs.length > 1 ? (
      <Tabs
        tabs={ useTabs }
        current={ currentTabId }
        onChange={ setTab }
      />
    ) : null
  }, [
    currentTabId,
    form.tabs,
    form.tabFilter,
  ])

  const getForm = useCallback(({
    values,
    errors,
    showErrors,
    touched,
    isValid,
    onSetFieldValue,
  }) => {
    return (
      <FormRender
        schema={ currentSchema }
        values={ values }
        errors={ errors }
        showErrors={ showErrors }
        touched={ touched }
        isValid={ isValid }
        onSetFieldValue={ onSetFieldValue }
        handlers={ form.handlers }
        handlerContext={ handlerContext }
      />
    )
  }, [
    form.handlers,
    currentSchema,
    handlerContext,
  ])

  const getButtons = useCallback(({
    isValid,
    onSubmit,
  }) => (
    <DialogButtons
      withSubmit
      submitDisabled={ isValid ? false : true }
      onSubmit={ onSubmit }
      onCancel={ onCancel }
    />
  ), [
    onCancel,
  ])

  const render = useCallback(renderFn => {
    return (
      <FormWrapper
        schema={ flatFormSchema }
        initialValues={ useValues }
        onSubmit={ onSubmit }
      >
        {
          (formProps) => renderFn({
            getTabs: () => getTabs(formProps),
            getForm: () => getForm(formProps),
            getButtons: () => getButtons(formProps),
          })
        }
      </FormWrapper>
    )
  }, [
    flatFormSchema,
    useValues,
    onSubmit,
    getTabs,
    getForm,
    getButtons,
  ])

  return render
}

export default useForm