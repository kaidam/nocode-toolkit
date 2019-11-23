const chalk = require('chalk')

const errorColor = chalk.hex('#FF6666')
const successColor = chalk.hex('#66FF66')
const infoColor = chalk.hex('#6666FF')

const error = (st) => errorColor.bold(st)
const success = (st) => successColor.bold(st)
const info = (st) => infoColor.bold(st)

module.exports = {
  errorColor,
  successColor,
  infoColor,
  error,
  success,
  info,
}