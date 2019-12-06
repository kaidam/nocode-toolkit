const required_env = [
  ''
]

const missing_env = required_env.filter(name => process.env[name] ? false : true)

if(missing_env.length>0) {
  console.error(`The following variables are required:

${missing_env.join("\n")}
`)

  process.exit(1)
}

const args = require('minimist')(process.argv, {
  default:{
    port: process.env.PORT || 80,
  }
})

module.exports = args