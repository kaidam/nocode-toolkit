import { useCallback } from 'react'
import { useSelector } from 'react-redux'

import settingsSelectors from '../../store/selectors/settings'

import icons from '../../icons'

const useWidgetMenu = ({
  onAdd,
}) => {
  
  const forms = useSelector(settingsSelectors.forms)
  const activePluginMap = useSelector(settingsSelectors.activePluginMap)
  const snippets = useSelector(settingsSelectors.pageSnippets)

  const getAddMenu = useCallback((rowIndex = -1) => {
    const plugins = [
      forms.stripe_payment_button && activePluginMap.stripe_payment_button ? {
        title: 'Payment Button',
        icon: icons.image,
        handler: () => onAdd({
          form: 'stripe_payment_button',
          rowIndex,
        }),
      } : null,
      forms.contactform  && activePluginMap.contactform ? {
        title: 'Contact Form',
        icon: icons.contact,
        handler: () => onAdd({
          form: 'contactform',
          rowIndex,
        }),
      } : null
    ].filter(i => i)

    const snippetItems = snippets.map(snippet => {
      return {
        title: snippet.name,
        icon: icons.code,
        handler: () => onAdd({
          rowIndex,
          form: 'snippet',
          data: {
            id: snippet.id
          },
        }),
      }
    })

    const media = [
      {
        title: 'Image',
        icon: icons.image,
        handler: () => onAdd({
          form: 'image',
          rowIndex,
        }),
      },
      {
        title: 'Youtube Video',
        icon: icons.video,
        handler: () => onAdd({
          form: 'video',
          rowIndex,
        }),
      },
      {
        title: 'Social Links',
        icon: icons.people,
        handler: () => onAdd({
          form: 'social_links',
          rowIndex,
        }),
      },
    ]

    const text = [
      {
        title: 'Heading',
        icon: icons.title,
        handler: () => onAdd({
          form: 'heading',
          rowIndex,
        }),
      },
      {
        title: 'Text Block',
        icon: icons.text,
        handler: () => onAdd({
          form: 'richtext',
          rowIndex,
        }),
      },
      {
        title: 'Search',
        icon: icons.search,
        handler: () => onAdd({
          form: 'search',
          rowIndex,
        }),
      },
      {
        title: 'HTML',
        icon: icons.code,
        handler: () => onAdd({
          form: 'html',
          rowIndex,
        }),
      },
    ]

    return [
      {
        title: 'Media',
        icon: icons.image,
        items: media,
      },
      {
        title: 'Text',
        icon: icons.text,
        items: text,
      },
      plugins.length > 0 ? {
        title: 'Plugins',
        icon: icons.plugin,
        items: plugins,
      } : null,
      snippetItems.length > 0 ? {
        title: 'Snippets',
        icon: icons.code,
        items: snippetItems,
      } : null,
    ].filter(i => i)
  }, [
    onAdd,
    forms,
    activePluginMap,
    snippets,
  ])

  return getAddMenu
}

export default useWidgetMenu