import schema from './schema'

const sociallinksPlugin = (opts) => {
  return {
    id: 'sociallinks',
    title: 'Social Links',
    description: 'A logo bar of social network links',
    schema,
  }
}

export default sociallinksPlugin