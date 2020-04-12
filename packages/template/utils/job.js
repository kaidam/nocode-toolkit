const getJobUrl = (config, job) => {
  const port = config.main_port == 80 || config.main_port == 443 ? '' : `:${config.main_port}`
  return `${config.main_protocol}://job-${job.website}-${job.jobid}.${config.main_domain}${port}`
}

const utils = {
  getJobUrl,
}

export default utils