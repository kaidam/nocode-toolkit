import React from 'react'

import List from '@material-ui/core/List'
import TreeItem from './TreeItem'
import useSectionTree from '../hooks/useSectionTree'

const Tree = ({
  section,

  // the suspended component we use to render the item
  // options - this gives control to the template
  // as to what the tree item menu does
  ItemEditorComponent,
  // folder pages means we treat folders as routes
  // if this is false, then clicking
  // on a folder just toggles it
  // if this is true - clicking on the folder itself
  // will open the folder route
  folderPages = true,
  onClick,
}) => {
  const {
    onToggleFolder,
    list,
  } = useSectionTree({
    section,
  })
  return (
    <List>
      {
        list.map((item, i) => {
          return (
            <TreeItem
              key={ i }
              item={ item }
              folderPages={ folderPages }
              ItemEditorComponent={ ItemEditorComponent }
              onToggleFolder={ onToggleFolder }
              onClick={ onClick }
            />
          )
        })
      }
    </List> 
  )
}

export default Tree