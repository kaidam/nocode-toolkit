const EventEmitter = require('events')

class Context extends EventEmitter {

  constructor({
    config,
    items,
    routes,
    externals,
  } = {}) {
    super()
    this.data = {
      config: config || {},
      items: items || {},
      routes: routes || {},
      externals: externals || {},
    }
  }

  config(name, data) {
    if(!name) throw new Error('name is required for context.config')
    if(typeof(data) !== 'undefined') {
      this.data.config[name] = data
      this.emit('config', {
        name,
        data,
      })
    }
    else {
      return this.data.config[name]
    }
  }

  setConfig(data) {
    this.data.config = data
  }

  item(type, id, data) {
    if(!type) throw new Error('type is required for context.item')
    if(!id) throw new Error('id is required for context.item')
    if(typeof(data) !== 'undefined') {
      if(!this.data.items[type]) this.data.items[type] = {}
      this.data.items[type][id] = data
      this.emit('item', {
        type,
        id,
        data,
      })
    }
    else {
      if(!this.data.items[type]) return undefined
      return this.data.items[type][id]
    }
  }

  items(type, data) {
    if(!type) throw new Error('type is required for context.items')
    if(typeof(data) !== 'undefined') {
      if(!this.data.items[type]) this.data.items[type] = {}
      this.data.items[type] = Object.assign({}, this.data.items[type], data)
      this.emit('items', {
        type,
        data,
      })
    }
    else {
      return this.data.items[type]
    }
  }

  route(path, data) {
    if(!path) throw new Error('path is required for context.route')
    if(typeof(data) !== 'undefined') {
      this.data.routes[path] = data
      this.emit('route', {
        path,
        data,
      })
    }
    else {
      return this.data.routes[path]
    }
  }

  routes(routes) {
    if(!routes) return this.data.routes
    Object.keys(routes).forEach(path => {
      this.route(path, routes[path])
    })
  }

  external(id, data) {
    if(!id) throw new Error('id is required for context.external')
    if(typeof(data) !== 'undefined') {
      this.data.externals[id] = data
      this.emit('external', {
        id,
        data,
      })
    }
    else {
      return this.data.externals[id]
    }
  }

  del(type, id) {
    delete(this.data.items[type][id])
  }

  log(message) {
    this.emit('log', message)
  }

  get state() {
    return {
      config: this.data.config,
      items: this.data.items,
      routes: this.data.routes,
      externals: this.data.externals,
    }
  } 
}

module.exports = Context