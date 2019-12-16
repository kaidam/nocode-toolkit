import React, { useState, useCallback } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import classnames from 'classnames'
import Window from '../system/Window'
import Loading from '../system/Loading'
import FormWrapper from '../form/Wrapper'

import cellTypes from './cellTypes'
import ExternalEditor from './ExternalEditor'

const useStyles = makeStyles(theme => createStyles({
  formContainer: {
    height: '100%',
  },
  formContainerPadding: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  }
}))


const CellEditorInternal = ({
  cell,
  loading,
  setLoading,
  onCancel,
  onSubmit,
}) => {
  const classes = useStyles()

  const type = cell.component

  const cellConfig = cellTypes.getCellConfig(type)
  const schemaDefinition = cellTypes.getCellSchema(type)

  const formContainerClassname = classnames({
    [classes.formContainer]: true,
    [classes.formContainerPadding]: cellConfig.compactEditor ? false : true,
  })

  const onSubmitForm = useCallback(values => {
    setLoading(true)
    onSubmit(values)
  }, [])

  if(!schemaDefinition) return null

  return (
    <FormWrapper
      schema={ schemaDefinition.schema }
      initialValues={ cell.data || schemaDefinition.initialValues }
      compact={ cellConfig.compactEditor ? true : false }
      fullHeight={ cellConfig.fullHeightEditor ? true : false }
      onSubmit={ onSubmitForm }
      renderForm={
        ({
          formElem,
          handleSubmit,
        }) => {
          return (
            <Window
              open
              size="md"
              compact={ cellConfig.compactEditor ? true : false }
              noScroll={ cellConfig.noScrollEditor ? true : false }
              withCancel
              fullHeight={ cellConfig.fullHeightEditor ? true : false }
              loading={ loading }
              onSubmit={ handleSubmit }
              onCancel={ onCancel }
            >
              {
                loading ? (
                  <Loading />
                ) : (
                  <div className={ formContainerClassname }>
                    { formElem }
                  </div>
                )
              }
            </Window>
          )
        }
      }
    />
  )
}

const CellEditor = ({
  cell,
  data,
  onCancel,
  onSubmit,
}) => {
  const [ loading, setLoading ] = useState(false)

  return cell.editor == 'external' ? (
    <ExternalEditor
      item={ data.item }
      loading={ loading }
      onCancel={ onCancel }
      onSubmit={ onSubmit }
    />
  ) : (
    <CellEditorInternal
      cell={ cell }
      loading={ loading }
      setLoading={ setLoading }
      onCancel={ onCancel }
      onSubmit={ onSubmit }
    />
  )
}

export default CellEditor