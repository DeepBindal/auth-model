import Signinform from '@/components/SignInForm'
import React from 'react'

const SignInPage = ({searchParams}) => {
  return (
    <Signinform callbackUrl={searchParams.callbackUrl}/>
  )
}

export default SignInPage