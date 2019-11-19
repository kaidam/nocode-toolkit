import React, { useState, useCallback } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import classnames from 'classnames'
import Window from '../system/Window'
import Loading from '../system/Loading'
import FormWrapper from '../form/Wrapper'
import library from '../../types/library'

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

  const schemaDefinition = library.get(['local', type].join('.'))
  const cellType = cellTypes.getType(cell)

  const formContainerClassname = classnames({
    [classes.formContainer]: true,
    [classes.formContainerPadding]: cellType.compactEditor ? false : true,
  })

  const onSubmitForm = useCallback(values => {
    setLoading(true)
    onSubmit(values)
  }, [])

  return (
    <FormWrapper
      schema={ schemaDefinition.schema }
      initialValues={ cell.data || schemaDefinition.initialValues }
      compact={ cellType.compactEditor ? true : false }
      fullHeight={ cellType.fullHeightEditor ? true : false }
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
              compact={ cellType.compactEditor ? true : false }
              noScroll={ cellType.noScrollEditor ? true : false }
              withCancel
              fullHeight={ cellType.fullHeightEditor ? true : false }
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