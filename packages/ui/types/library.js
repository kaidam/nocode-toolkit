const library = {}
const names = []
const plugins = []

const add = (type, schema) => {
  if(typeof(type) === 'string' && typeof(schema) === 'object') {
    const name = [schema.driver, type].join('.')
    if(!library[name]) names.push(name)
    library[name] = schema
  }
  else if(typeof(type) === 'object') {
    Object.keys(type).forEach(n => {
      add(n, type[n])
    })
  }
}
const list = () => names.map(name => library[name])
const set = (type, schema) => {
  const name = [schema.driver, type].join('.')
  library[name] = schema
}
const get = (name) => library[name]
const getItemSchema = (item) => {
  const name = [item.driver, item.type].join('.')
  return get(name)
}

const addPlugin = (plugin) => {
  if(plugin.settingsTab) {
    const settingsSchema = get('local.settings')
    const tab = {
      id: plugin.id,
      title: plugin.title,
      schema: plugin.settingsTab.schema,
    }
    settingsSchema.tabs.push(tab)
    settingsSchema.initialValues = Object.assign({}, settingsSchema.initialValues, plugin.settingsTab.initialValues)
  }
  if(plugin.schema) {
    add(plugin.schema)
  }
  plugins.push(plugin)
}

const types = {
  add,
  set,
  get,
  list,
  getItemSchema,
  addPlugin,
  plugins,
}

export default types