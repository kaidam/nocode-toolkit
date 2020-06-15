import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import Actions from '../../utils/actions'
import contentActions from '../../store/modules/content'
import layoutActions from '../../store/modules/layout'

import icons from '../../icons'

import useSectionSelector from './useSectionSelector'

const useSectionEditor = ({
  section,
  content_id,
  layout_id,
  layouts,
  withWidgets,
}) => {

  const actions = Actions(useDispatch(), {
    onCreateRemoteContent: contentActions.createRemoteContent,
    onCreateLocalContent: contentActions.createLocalContent,
    onAddRemoteContent: contentActions.addRemoteContent,
    onEditSection: contentActions.editSection,
    onWidgetAdd: layoutActions.addWidget,
  })

  const {
    node,
    annotation,
    addTargetFolderId,
  } = useSectionSelector({
    section,
  })

  const onAddWidget = useCallback(() => {
    actions.onWidgetAdd({
      content_id,
      layout_id,
      layouts,
    })
  }, [
    content_id,
    layout_id,
    layouts,
  ])

  const getAddItems = useCallback(() => {

    const newDocumentHandler = () => actions.onCreateRemoteContent({
      title: 'Create Document',
      driver: 'drive',
      form: 'drive.document',
      parentId: addTargetFolderId,
    })

    const existingDocumentHandler = () => actions.onAddRemoteContent({
      section,
      type: 'document',
    })

    const newFolderHandler = () => actions.onCreateRemoteContent({
      title: 'Create Folder',
      driver: 'drive',
      form: 'drive.folder',
      parentId: addTargetFolderId,
    })

    const existingFolderHandler = () => actions.onAddRemoteContent({
      section,
      type: 'folder',
    })

    return [
      {
        title: 'New Google Document',
        icon: icons.docs,
        handler: newDocumentHandler,
      },
      {
        title: 'New Google Folder',
        icon: icons.folder,
        handler: newFolderHandler,
      },
      {
        title: 'Import Existing Drive Content',
        icon: icons.drive,
        items: [
          {
            title: 'Existing Google Document',
            icon: icons.docs,
            secondaryIcon: icons.search,
            handler: existingDocumentHandler,
          },
          {
            title: 'Existing Google Folder',
            icon: icons.folder,
            secondaryIcon: icons.search,
            handler: existingFolderHandler,
          },
        ]
      },
      '-',
      {
        title: 'Link',
        icon: icons.link,
        handler: () => actions.onCreateLocalContent({
          title: 'Create Link',
          form: 'link',
          location: `section:${section}`,
        })
      },
      withWidgets ? {
        title: 'Widget',
        icon: icons.widget,
        handler: onAddWidget,
      } : null,
    ].filter(i => i)
  }, [
    addTargetFolderId,
    withWidgets,
    onAddWidget,
  ])
  
  const getAllItems = useCallback(() => {
    return [

      {
        title: 'Add',
        icon: icons.add,
        items: getAddItems(),
      },

      {
        title: 'Settings',
        icon: icons.settings,
        handler: () => actions.onEditSection({
          title: `Edit Section`,
          form: `section`,
          id: section,
        })
      },


    ].filter(i => i)
  }, [
    section,
    getAddItems,
  ])
  
  return {
    node,
    annotation,
    getAddItems,
    getAllItems,
  }
}

export default useSectionEditor