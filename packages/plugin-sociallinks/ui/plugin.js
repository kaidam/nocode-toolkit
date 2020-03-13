import cell from './cell'

const sociallinksPlugin = (opts) => {
  return {
    id: 'sociallinks',
    title: 'Social Links',
    description: 'A logo bar of social network links',
    cell,
  }
}

export default sociallinksPlugin