// import Signinform from '@/components/SignInForm'
// import React from 'react'

// const SignInPage = ({searchParams}) => {
//   return (
//     <Signinform callbackUrl={searchParams.callbackUrl}/>
//   )
// }

// export default SignInPage
import Signinform from "@/components/Signinform";

import React from 'react'

function Page({searchParams}) {
  return (
    <Signinform  callbackUrl={searchParams.callbackUrl}/>
  )
}

export default Page