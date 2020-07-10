import React, { useState, useMemo, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import FormWrapper from '../form/Wrapper'
import FormRender from '../form/Render'
import Tabs from '../widgets/Tabs'
import DialogButtons from '../widgets/DialogButtons'

import routerActions from '@nocode-works/template/store/modules/router'
import routerSelectors from '@nocode-works/template/store/selectors/router'

const useTabbedForm = ({
  form,
  values,
  initialTab,
  onSubmit,
  onCancel,
}) => {

  const dispatch = useDispatch()
  const params = useSelector(routerSelectors.params)

  const onChangeTab = useCallback((tab) => {
    dispatch(routerActions.addQueryParams({tab})) 
  })

  const tabs = useMemo(() => {
    let result = form.tabs || []
    if(form.schema && !form.tabs) {
      tabs = [{
        id: 'auto',
        title: 'Auto',
        schema: form.schema,
      }]
    }
    return result
  }, [
    form,
  ])

  const flatSchema = useMemo(() => {
    return tabs.reduce((all, tab) => {
      return all.concat(tab.schema)
    }, [])
  }, [
    tabs,
  ])

  const currentTab = useMemo(() => {
    return tabs.find(t => t.id == params.tab) || tabs[0]
  }, [
    tabs,
    params,
  ])

  const getTabs = useCallback(({
    
  }) => {
    return tabs.length > 1 ? (
      <Tabs
        tabs={ tabs }
        current={ currentTab.id }
        onChange={ onChangeTab }
      />
    ) : null
  }, [
    currentTab,
    tabs,
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
        schema={ currentTab.schema }
        values={ values }
        errors={ errors }
        showErrors={ showErrors }
        touched={ touched }
        isValid={ isValid }
        onSetFieldValue={ onSetFieldValue }
      />
    )
  }, [
    currentTab,
  ])

  const getButtons = useCallback(({
    isValid,
    onSubmit,
  }) => (
    <DialogButtons
      withSubmit
      submitDisabled={ isValid ? false : true }
      onSubmit={ onSubmit }
      onCancel={ () => onCancel() }
    />
  ), [
    onCancel,
  ])

  const render = useCallback(renderFn => {
    return (
      <FormWrapper
        schema={ flatSchema }
        initialValues={ values }
        onSubmit={ onSubmit }
      >
        {
          (formProps) => renderFn({
            getTabs: () => getTabs(formProps),
            getForm: () => getForm(formProps),
            getButtons: () => getButtons(formProps),
            hasTabs: tabs.length > 1,
          })
        }
      </FormWrapper>
    )
  }, [
    flatSchema,
    values,
    onSubmit,
    getTabs,
    getForm,
    getButtons,
    tabs,
  ])

  return render
}

export default useTabbedForm