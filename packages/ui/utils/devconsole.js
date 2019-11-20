const log = (v) => {
  if(process.env.NODE_ENV == 'development') console.log(v)
}

const dir = (v) => {
  if(process.env.NODE_ENV == 'development') console.dir(v)
}

const utils = {
  log,
  dir,
}

export default utils