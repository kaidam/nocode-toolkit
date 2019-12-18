import schema from './schema'

const sociallinksPlugin = (opts) => {
  return {
    id: 'sociallinks',
    title: 'Social Links',
    schema,
  }
}

export default sociallinksPlugin