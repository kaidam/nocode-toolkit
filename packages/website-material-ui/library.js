import TitleCell from './components/cells/Title'

const MaterialLibrary = (library) => {
  const titleSchema = library.get('local.title')
  titleSchema.cellConfig.component = TitleCell
}

export default MaterialLibrary
