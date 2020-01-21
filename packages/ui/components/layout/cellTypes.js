import HTML from '../cells/HTML'
import library from '../../types/library'

const BlankContent = () => ''

const DEFAULT_CELL_CONFIG = {
  html:  {
    component: HTML,
  },
  blank:  {
    component: BlankContent,
  },
}

const getCellSchema = type => {
  return library.get(['local', type].join('.'))
}

const getCellConfig = type => {
  const schema = getCellSchema(type)
  return schema && schema.cellConfig ?
    schema.cellConfig :
    DEFAULT_CELL_CONFIG[type] || DEFAULT_CELL_CONFIG.blank
}

const getContent = ({
  cell,
  data,
}) => {
  if(cell.source == 'title') {
    if(data.item && data.item.data) {
      return {
        title: data.item.data.name,
      }
    }
    else {
      return {
        title: '',
      }
    }
  }
  if(cell.source == 'external') return data.externals[cell.index]
  if(cell.source == 'cell') return cell.data
  if(cell.source == 'info') {
    if(data.item && data.item.data) {
      return {
        modified: data.item.data.modified,
        modifiedBy: data.item.data.modifiedBy,
      }
    }
    else {
      return {}
    }
  }
  return ''
}

const cellTypes = {
  getCellSchema,
  getCellConfig,
  getContent,
}

export default cellTypes