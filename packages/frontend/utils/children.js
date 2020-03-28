// normalize values for sorting
// the 'date' field is a top level field and should already be a timestamp
const getValue = (item, field) => {
  if(field == 'date') {
    return item.createdTime
  }
  const val = item[field]
  return (val || '').toLowerCase().replace(/\W/g, '')
}

const fieldSorter = (field, direction) => (a, b) => {
  if ( getValue(a, field) < getValue(b, field) ) {
    return direction == 'asc' ? -1 : 1
  }
  if ( getValue(a, field) > getValue(b, field) ) {
    return direction == 'asc' ? 1 : -1
  }
  return 0
}

// sort children based on a value of their field
const sortByField = ({
  items,
  field,
  direction = 'asc',
}) => {
  const sorter = fieldSorter(field, direction)
  const sortedItems = [].concat(items)
  sortedItems.sort(sorter)
  return sortedItems
}

// explode ghost folder children
const getSectionChildrenIds = ({
  section,
  nodes,
  locations,
}) => section.children
  .reduce((all, id) => {
    // if there is a location record present - it will tell us if the item is a ghost
    // if it is a ghost - then include the items children not the item itself
    const location = locations[`section:${section.id}:${id}`]
    if(!location || !location.data || !location.data.ghost) return all.concat([id])
    const node = nodes[id]
    return all.concat(node.children || [])
  }, [])

// sort the children of an item based on
// the annotation settings
const sortChildren = ({
  nodes,
  childIds,
  annotation = {},
}) => {
  if(!childIds) return []
  const {
    type = 'name',
    direction = 'asc',
    ids,
  } = annotation.sorting || {}

  const items = childIds
    .map(id => nodes[id])
    .filter(item => item)

  if(type == 'manual') {
    return sortById({
      items,
      ids,
    }).map(item => item.id)
  }
  else {
    return sortByField({
      items,
      field: type,
      direction,
    }).map(item => item.id)
  }
}

// return an array of child ids based on the item children array
// and the sort annotation
const sortById = ({
  items,
  ids,
}) => {
  items = items || []
  ids = ids || []
  const idMap = items.reduce((all, item) => {
    all[item.id] = item
    return all
  }, {})
  return ids
    // return the sorted id list excluding any missing items
    .filter(id => idMap[id])
    .map(id => idMap[id])
    // append the children that are not in the sortIds list
    .concat(
      items
        .filter(item => ids.indexOf(item.id) < 0)
    )
}

const utils = {
  getSectionChildrenIds,
  sortChildren,
  sortById,
}

export default utils