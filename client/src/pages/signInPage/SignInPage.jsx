import React from 'react'
import { SignIn } from "@clerk/clerk-react"

const SignInPage = () => {
  return (
    <div className='h-screen flex justify-center items-center'>
    <SignIn path="/sign-in"  signUpUrl='/sign-up' forceRedirectUrl={"/dashboard"}/>
    </div>
  )
}

export default SignInPage