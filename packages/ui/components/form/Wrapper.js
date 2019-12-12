import React, { useState, useMemo } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import classnames from 'classnames'
import { Formik, Field } from 'formik'
import dotty from 'dotty'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import FormHelperText from '@material-ui/core/FormHelperText'
import utils from './utils'
import Validate from './validate'

const useStyles = makeStyles(theme => createStyles({
  errorContainer: {
    marginTop: theme.spacing(2),
  },
  errorText: {
    color: theme.palette.error.main,
  },
  button: {
    marginRight: theme.spacing(2),
  },
  listTableTitle: {
    color: theme.palette.text.secondary,
  },
  listTable: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    border: '1px dotted #e5e5e5',
    padding: theme.spacing(2),
  },
  divider: {
    marginTop: '20px',
    marginBottom: '20px',
  },
  fullHeight: {
    height: '100%',
  }
}))

const FormWrapperItem = ({
  item,
  errors,
  touched,
}) => {

  const fieldError = dotty.get(errors, item.id)
  const fieldTouched = dotty.get(touched, item.id)

  return (
    <Field
      name={ item.id }
      component={ utils.getComponent(item.component) }
      item={ item }
      error={ fieldError }
      touched={ fieldTouched }
    />
  )
}

const FormWrapperRow = ({
  rowKey,
  row,
  errors,
  touched,
}) => {
  if(typeof(row) === 'string') {
    return (
      <Grid item xs={ 12 } key={ rowKey }>
        {
          row !== '-' && (
            <Typography
              variant='subtitle1'
              style={{
                fontWeight: 'bold',
                marginTop: '10px',
                marginBottom: '10px',
              }}
            >
              { row }
            </Typography>
          )
        }
        
      </Grid>
    )
  }
  else if (row.constructor === Array) {
    const colSize = Math.floor(12 / row.length)
    return row.map((item, i) => (
      <Grid item xs={ 12 } sm={ colSize } key={ rowKey + '-' + i }>
        <FormWrapperItem
          item={ item }
          errors={ errors }
          touched={ touched }
        />
      </Grid>
    ))
  }
  else {
    return (
      <Grid item xs={12} key={ rowKey }>
        <FormWrapperItem
          item={ row }
          errors={ errors }
          touched={ touched }
        />
      </Grid>
    )
  }
}

const FormWrapper = ({
  schema,
  initialValues,
  spacing,
  renderButtons,
  renderForm,
  error,
  compact,
  fullHeight,
  children,
  onSubmit,
}) => {
  const classes = useStyles()
  const [ hasSubmitted, setHasSubmitted ] = useState(false)

  const validationSchema = useMemo(() => Validate(schema), [schema])
  const useInitialValues = useMemo(() => utils.getInitialValues(schema, initialValues), [schema, initialValues])

  return (
    <Formik
      initialValues={ useInitialValues }
      validationSchema={ validationSchema }
      validateOnMount
      onSubmit={ onSubmit }
    >
      {
        ({
          handleSubmit,
          isValid,
          values,
          errors,
          touched,
        }) => {

          const submitWrapper = () => {
            setHasSubmitted(true)
            handleSubmit()
          }

          const defaultSpacing = compact ? 0 : 1

          const formElem = (
            <form
              className={classnames({
                [classes.fullHeight]: fullHeight,
              })}
              onSubmit={ submitWrapper }
            >
              <Grid
                container
                spacing={ spacing || defaultSpacing }
                className={classnames({
                  [classes.fullHeight]: fullHeight,
                })}
              >
                {
                  schema.map((row, i) => {
                    return (
                      <FormWrapperRow
                        key={ i }
                        rowKey={ i }
                        row={ row }
                        errors={ errors }
                        touched={ touched }
                      />
                    )
                  })
                }
                { children }
                {
                  renderButtons && renderButtons({
                    isValid,
                    values,
                    handleSubmit: submitWrapper,
                    errors,
                  })
                }
                {
                  error && (
                    <FormHelperText
                      error={ true }
                    >
                      { error }
                    </FormHelperText>
                  )
                }
              </Grid>
              {
                hasSubmitted && Object.keys(errors).length > 0 && (
                  <div className={ classes.errorContainer }>
                    <Typography className={ classes.errorText }>
                      There are errors in the form:
                    </Typography>
                    <ul className={ classes.errorText }>
                      {
                        Object.keys(errors).map((key, i) => (
                          <li key={ i }>
                            <Typography className={ classes.errorText }>
                              { key }: { errors[key] }
                            </Typography>
                          </li>
                        ))
                      }
                    </ul>
                  </div> 
                )
              }
            </form>
          )

          if(renderForm) {
            return renderForm({
              formElem,
              isValid,
              values,
              handleSubmit: submitWrapper,
              errors,
            })
          }
          else {
            return formElem
          }
        }
      }
    </Formik>
  )
}

export default FormWrapper