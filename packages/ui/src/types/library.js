const library = {}
const names = []

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

const types = {
  add,
  set,
  get,
  list,
  getItemSchema,
}

export default types