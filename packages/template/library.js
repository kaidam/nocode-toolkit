import widgets from './widgets'
import forms from './forms'

const library = {
  settings: {
    initialValues: {},
    tabs: [],
  },
  templates: {
    layouts: {},
    pages: {},
  },
  components: {},
  widgets: widgets,
  forms: forms,
  autoSnackbar: true,
  topbarHeight: 0,
  handlers: {},
  onboardingElements: {},
  onboarding: {
    steps: [],
  },
  initialise: null,
  hooks: {},
}

export default library