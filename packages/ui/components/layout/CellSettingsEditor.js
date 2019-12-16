import React, { useState, useCallback } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import classnames from 'classnames'
import Window from '../system/Window'
import Loading from '../system/Loading'
import FormWrapper from '../form/Wrapper'

import library from '../../types/library'

const useStyles = makeStyles(theme => createStyles({
  formContainer: {
    height: '100%',
  },
  formContainerPadding: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  }
}))


const CellSettingsEditor = ({
  cell,
  loading,
  setLoading,
  onCancel,
  onSubmit,
}) => {
  const classes = useStyles()

  const schemaDefinition = library.get('local.cellSettings')

  const formContainerClassname = classnames({
    [classes.formContainer]: true,
  })

  if(!schemaDefinition) return null

  return (
    <FormWrapper
      schema={ schemaDefinition.schema }
      initialValues={ cell.settings || schemaDefinition.initialValues }
      onSubmit={ onSubmit }
      renderForm={
        ({
          formElem,
          handleSubmit,
        }) => {
          return (
            <Window
              open
              size="md"
              withCancel
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

export default CellSettingsEditor