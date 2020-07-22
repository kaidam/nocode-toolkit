import { useMemo } from 'react'
import { useSelector } from 'react-redux'

import settingsSelectors from '../../store/selectors/settings'

import library from '../../library'
import icons from '../../icons'

const useWidgets = ({
  location,
} = {}) => {
  const snippets = useSelector(settingsSelectors.pageSnippets)

  const widgets = useMemo(() => {
    // filter by hidden
    // append snippets
    // filter by location
    const allWidgets = Object
      .keys(library.widgets)
      .map(id => {
        return Object.assign({}, library.widgets[id], {
          globalId: id,
        })
      })
      .filter(widget => widget.hidden ? false : true)
      .concat(snippets.map(snippet => {
        return {
          id: 'snippet',
          globalId: `snippet-${snippet.id}`,
          title: snippet.data.name,
          description: `Render the ${snippet.data.name} snippet`,
          locations: ['document', 'section'],
          group: 'Snippets',
          icon: icons.code,
          editable: false,
          data: {
            id: snippet.id
          },
        }
      }))
      .filter(widget => location && widget.locations.indexOf(location) >= 0)

    const groupedWidgetsMap = allWidgets
      .reduce((all, widget) => {
        const group = all[widget.group] || {
          title: widget.group,
          items: [],
        }
        group.items.push(widget)
        all[widget.group] = group
        return all
      }, {})

    const groupedWidgets = Object.values(groupedWidgetsMap)
    groupedWidgets.sort((a, b) => {
      if(a.title > b.title) return 1
      else if(b.title > a.title) return -1
      else return 0
    })

    return {
      allWidgets,
      groupedWidgets,
    }

  }, [
    snippets,
    location,
  ])

  return widgets
}

export default useWidgets