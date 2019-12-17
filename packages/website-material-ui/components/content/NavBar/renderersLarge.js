import React from 'react'
import useStyles from './styles'

import baseRenderers from './renderers'

import {
  getMergedClasses,
} from './utils'

const RenderItem = baseRenderers.item

const RenderNavbarLarge = ({
  children,
  ...props
}) => {
  const classes = useStyles()
  return (
    <nav>
      <ul className={ classes.navUl }>
        { children }
      </ul>
    </nav>
  )
}

const RenderItemLarge = ({
  item,
  editor,
  isCurrent,
  linkProps,
  LinkComponent,
  ...props
}) => {
  const baseClasses = useStyles()
  
  const useClasses = getMergedClasses(baseClasses, props.classes, [
    'navWrapper',
    'navItem',
    'navItemLarge',
  ])

  const editorContainerClassName = isCurrent ? '' : useClasses.inactiveEditorContainer
    
  return (
    <li
      className={ useClasses.navWrapper }
    >
      <RenderItem
        item={ item }
        editor={ editor }
        isCurrent={ isCurrent }
        linkProps={ linkProps }
        LinkComponent={ LinkComponent }
        className={ `${useClasses.navItem} ${useClasses.navItemLarge}` }
        editorContainerClassName={ editorContainerClassName }
        withHighlight
        {...props}
      />
    </li>
  )
}

const renderers = {
  root: baseRenderers.root,
  navbar: RenderNavbarLarge,
  item: RenderItemLarge,
  itemOptions: baseRenderers.itemOptions,
}

export default renderers