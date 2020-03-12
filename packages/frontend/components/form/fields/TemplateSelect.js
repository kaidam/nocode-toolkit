import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Select from './Select'
import selectors from '../../../store/selectors'

import Actions from '../../../utils/actions'
import contentActions from '../../../store/modules/content'

const TemplateSelectField = (props) => {
  const values = props.values

  const schemaItem = props.item

  const editItem = values._item

  const actions = Actions(useDispatch(), {
    onResetPageLayout: contentActions.resetPageLayout,
  })
  
  const templates = useSelector(selectors.ui.templates)

  let options = templates.map(template => {
    return {
      title: template.name,
      value: template.id,
    }
  })

  let defaultValue = 'default'

  if(schemaItem.includeInherit) {
    options = [{
      title: 'Inherit',
      value: 'inherit',
    }].concat(options)
    defaultValue = 'inherit'
  }

  const value = props.field.value || defaultValue
  
  const item = Object.assign({}, props.item, {
    options,
  })

  const field = Object.assign({}, props.field, {
    value,
  })

  if(!values.layout) {
    return (
      <Select {...props} item={item} field={field} />
    )
  }
  else {
    return (
      <div>
        <Typography>You are currently using a custom layout.  If you want to use a template - click the button below to reset the layout to the default</Typography>
        <p>
          <Button
            size="small"
            variant="contained"
            onClick={ () => {
              actions.onResetPageLayout({
                id: editItem.id,
              })
            }}
          >
            Reset layout
          </Button>
        </p>
      </div>
    )
  }
  
}

export default TemplateSelectField