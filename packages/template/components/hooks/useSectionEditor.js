import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import Actions from '../../utils/actions'
import contentActions from '../../store/modules/content'
import formActions from '../../store/modules/form'
import layoutActions from '../../store/modules/layout'

import icons from '../../icons'
import library from '../../library'

import useSectionSelector from './useSectionSelector'

const DEFAULT_ARRAY = []

const useSectionEditor = ({
  section,
  content_id,
  layout_id,
  withWidgets,
  getAddItems,
}) => {

  const actions = Actions(useDispatch(), {
    onCreateContent: formActions.createContent,
    onImportContent: contentActions.importContent,
    onEditSection: formActions.editSection,
    onWidgetAdd: layoutActions.addWidget,
  })

  const {
    node,
    annotation,
    addTargetFolderId,
  } = useSectionSelector({
    section,
  })

  const layout_data = annotation && annotation[layout_id] ?
    annotation[layout_id] :
    DEFAULT_ARRAY

  const onAddWidget = useCallback(() => {
    actions.onWidgetAdd({
      location: 'section',
      content_id,
      layout_id,
      layout_data,
    })
  }, [
    content_id,
    layout_id,
    layout_data,
  ])

  const onOpenSettings = useCallback(() => {
    actions.onEditSection({
      id: section,
    })
  }, [
    section,
  ])

  const getAddItemsHandler = useCallback(() => {

    if(getAddItems) {
      return getAddItems({
        onCreateContent: actions.onCreateContent,
        onImportContent: actions.onImportContent,
        addTargetFolderId,
      })
    }

    const newDocumentHandler = () => actions.onCreateContent({
      title: 'Create Document',
      driver: 'drive',
      form: 'drive.document',
      parentId: addTargetFolderId,
    })

    const newFolderHandler = () => actions.onCreateContent({
      title: 'Create Folder',
      driver: 'drive',
      form: 'drive.folder',
      parentId: addTargetFolderId,
    })

    const newLinkHandler = () => actions.onCreateContent({
      title: 'Create Link',
      driver: 'local',
      form: 'link',
      section,
    })

    const importContentHandler = () => actions.onImportContent({
      section,
      listFilter: 'folder,document',
      addFilter: 'folder,document',
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
        handler: importContentHandler,
      },
      {
        title: 'Link',
        icon: icons.link,
        handler: newLinkHandler,
      },
      withWidgets ? {
        title: 'Widget',
        icon: icons.widget,
        handler: onAddWidget,
      } : null,
    ].filter(i => i)
  }, [
    getAddItems,
    addTargetFolderId,
    withWidgets,
    onAddWidget,
  ])
  
  const getAllItems = useCallback(() => {
    return [

      {
        title: 'Add',
        icon: icons.add,
        items: getAddItemsHandler(),
      },

      {
        title: 'Settings',
        icon: icons.settings,
        handler: onOpenSettings,
      },


    ].filter(i => i)
  }, [
    section,
    getAddItemsHandler,
    onOpenSettings,
  ])
  
  return {
    node,
    annotation,
    getAddItems: getAddItemsHandler,
    getAllItems,
    onOpenSettings,
  }
}

export default useSectionEditor