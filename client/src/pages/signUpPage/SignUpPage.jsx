import { SignUp } from "@clerk/clerk-react"


const SignUpPage = () => {
  return (
    <div className='h-screen flex justify-center items-center'>
      <SignUp path="/sign-up" signInUrl="/sign-in" forceRedirectUrl={'/dashboard'} />
    </div>
  )
}

export default SignUpPage