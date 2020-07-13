import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import FormWrapper from '../form/Wrapper'
import FormRender from '../form/Render'
import Tabs from '../widgets/Tabs'
import DialogButtons from '../widgets/DialogButtons'

import routerActions from '../../store/modules/router'
import routerSelectors from '../../store/selectors/router'

const useTabbedForm = ({
  form,
  values,
  buttonAlign,
  // when tabs change - do we update the router params or use internal state?
  withRouter = true,
  cancelTitle,
  onSubmit,
  onCancel,
}) => {

  const dispatch = useDispatch()

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

  const params = useSelector(routerSelectors.params)
  const [ currentTabName, setCurrentTabName ] = useState(tabs && tabs.length > 0 ? tabs[0].id : null)

  const currentTabId = withRouter ? params.tab : currentTabName

  const onChangeTab = useCallback((tab) => {
    if(withRouter) {
      dispatch(routerActions.addQueryParams({tab})) 
    }
    else {
      setCurrentTabName(tab)
    }
  }, [
    withRouter,
  ])

  const flatSchema = useMemo(() => {
    return tabs.reduce((all, tab) => {
      return all.concat(tab.schema)
    }, [])
  }, [
    tabs,
  ])

  const currentTab = useMemo(() => {
    return tabs.find(t => t.id == currentTabId) || tabs[0]
  }, [
    tabs,
    currentTabName,
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
        schema={ currentTab ? currentTab.schema : [] }
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
      cancelTitle={ cancelTitle }
      submitDisabled={ isValid ? false : true }
      align={ buttonAlign }
      onSubmit={ onSubmit }
      onCancel={ () => onCancel() }
    />
  ), [
    buttonAlign,
    onCancel,
    cancelTitle,
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