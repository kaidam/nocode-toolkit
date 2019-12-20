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
  // if(plugin.settingsTab) {
  //   const settingsSchema = get('local.settings')
  //   const existingTab = settingsSchema.tabs.find(t => t.id == plugin.id)
  //   if(!existingTab) {
      
  //     const tab = {
  //       id: plugin.id,
  //       title: plugin.title,
  //       schema: plugin.settingsTab.schema,
  //     }
  //     settingsSchema.tabs.push(tab)
  //     settingsSchema.initialValues = Object.assign({}, settingsSchema.initialValues, plugin.settingsTab.initialValues)
  //   }
  // }
  if(plugin.schema) {
    add(plugin.schema)
  }
  plugins.push(plugin)
}

const addTab = (id, tab, initialValues) => {
  const schemaDefinition = get(id)
  if(!schemaDefinition) return
  const existingTab = (schemaDefinition.tabs || []).find(t => t.id == tab.id)
  if(existingTab) return
  schemaDefinition.tabs = (schemaDefinition.tabs || []).concat([tab])
  schemaDefinition.initialValues = Object.assign({}, schemaDefinition.initialValues, initialValues)
}

const types = {
  add,
  set,
  get,
  list,
  getItemSchema,
  plugins,
  addPlugin,
  addTab,
}

export default types