import React from 'react'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import useStyles from './styles'

import {
  getMergedClasses,
  eventSink,
} from './utils'

const RenderRoot = ({
  navbar,
  editor,
  ...props
}) => {
  const classes = useStyles()
  return (
    <div className={ classes.root }>
      <div className={ classes.content }>
        { navbar }
      </div>
      {
        editor && (
          <div className={ classes.editor }>
            { editor }
          </div>
        )
      }
    </div>
  )
}

const RenderItem = ({
  item,
  editor,
  isCurrent,
  linkProps,
  LinkComponent,
  className,
  editorContainerClassName,
  withHighlight,
  ...props
}) => {

  const baseClasses = useStyles()
  const useClasses = getMergedClasses(baseClasses, props.classes, [
    'navActive',
    'navNormal',
  ])

  const highLightClassName = isCurrent && withHighlight ? `${className} ${useClasses.navActive}` : `${className} ${useClasses.navNormal}`

  return (
    <LinkComponent
      className={ highLightClassName }
      {...linkProps}
    >
      <span className={ editorContainerClassName }>
        { editor }
      </span>
      { item.data.name }
    </LinkComponent>
  )
}

const RendererItemOptions = ({
  children,
}) => {
  const classes = useStyles()
  return (
    <ListItemIcon 
      className={ classes.menuIcon }
      onClick={ eventSink }
    >
      { children }
    </ListItemIcon>
  )
}

const renderers = {
  root: RenderRoot,
  item: RenderItem,
  itemOptions: RendererItemOptions,
}

export default renderers