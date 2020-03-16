// get the array of children actually in a section
// this accounts for ghost folders
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
    return all.concat(node.children)
  }, [])

// sort the children of an item based on
// the annotation settings
const sortChildren = ({
  children,
  annotation,
}) => {
  if(!annotation || !annotation.sort) return children
  return children
}

// return an array of child ids based on the item children array
// and the sort annotation
const getSortedIds = (children, sortIds) => {
  children = children || []
  sortIds = sortIds || []
  return sortIds
    // return the sorted id list excluding any missing items
    .filter(id => children.indexOf(id) >= 0)
    // append the children that are not in the sortIds list
    .concat(
      children
        .filter(id => sortIds.indexOf(id) < 0)
    )
}

const utils = {
  getSectionChildrenIds,
  sortChildren,
  getSortedIds,
}

export default utils