import React from 'react'

import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import StepContent from '@material-ui/core/StepContent'
import Typography from '@material-ui/core/Typography'
import LinearProgress from '@material-ui/core/LinearProgress'
import Loading from '../system/Loading'

const PublishProgressTextContent = ({
  stepData,
}) => {
  if(stepData.type == 'count') {
    return (
      <Typography>
        <strong>{ stepData.count }</strong> { stepData.countTitle }
      </Typography>
    )
  }
  else if(stepData.type == 'progress') {
    return (
      <Typography>
        <strong>{ stepData.current }</strong> of <strong>{ stepData.total }</strong> { stepData.countTitle }
      </Typography>
    )
  }
  else {
    return null
  }
}

const PublishProgressExtraContent = ({
  stepData,
}) => {
  if(stepData.type == 'progress') {

    const percentDone = stepData.total > 0 ?
      stepData.current / stepData.total :
      0

    return (
      <LinearProgress 
        variant="determinate"
        value={ percentDone * 100 }
      />
    )
  }
  else {
    return null
  }
}

const PublishProgress = ({
  jobData,
}) => {
  const progress = jobData ? jobData.progress : null

  if(!progress || !progress.stepOrder) {
    return (
      <Loading />
    )
  }

  let activeStep = 0
  
  progress.stepOrder.forEach((stepName, i) => {
    const stepData = progress.steps[stepName]
    if(stepData.complete) activeStep = i + 1
  })

  if(activeStep >= progress.stepOrder.length) activeStep = progress.stepOrder.length - 1

  if(jobData.status == 'complete') {
    activeStep =  progress.stepOrder.length
  }

  return (
    <Stepper activeStep={ activeStep } orientation="vertical">
      {progress.stepOrder.map((stepName, index) => {
        const stepData = progress.steps[stepName]
        return (
          <Step key={ index }>
            <StepLabel>{ stepData.title }</StepLabel>
            <StepContent>
              <PublishProgressTextContent
                stepData={ stepData }
              />
              <PublishProgressExtraContent
                stepData={ stepData }
              />
              {
                stepData.description ? (
                  <Typography>{ stepData.description }</Typography>
                ) : null
              }
            </StepContent>
          </Step>
        )
      })}
    </Stepper>
  )
}

export default PublishProgress