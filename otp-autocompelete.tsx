'use client'
import { useState } from 'react'
import { GetOtpWithMobile } from '@/services/user'
import toast from 'react-hot-toast'

const DateSelector: React.FC = () => {
  const [value, setValue] = useState('')

  const sendOtp = () => {
    GetOtpWithMobile({
      mobile: '09332343466',
    })
      .then(() => {
        if (navigator.credentials && navigator.credentials.get) {
          toast.success(`Requesting OTP...`)

          const ac = new AbortController()

          setTimeout(() => {
            navigator.credentials
              .get({
                otp: { transport: ['sms'] },
                signal: ac.signal,
              } as CredentialRequestOptions)
              .then((credential) => {
                toast.error('gogeromnamolardigoja')

                console.log('Received credential:', credential) // Log the received credential for review
                toast.success(`Received credential: ${JSON.stringify(credential)}`)

                if (credential && 'code' in credential && (credential as any).code) {
                  const otpCode = (credential as any).code
                  setValue(otpCode)
                  toast.success(`OTP received: ${otpCode}`)
                } else {
                  setValue('123456') // Simulated value in case OTP is not found
                  toast.error('Failed to retrieve OTP or OTP is null.')
                }
              })
              .catch((err) => {
                toast.error('Error retrieving OTP: ' + err)
              })
          }, 1000)
        } else {
          toast.error('Credentials API is not supported in this environment.')
        }
      })
      .catch((err) => {
        toast.error('Error sending OTP request: ' + err)
      })
  }

  return (
    <>
      <input
        value={value}
        autoFocus={true}
        inputMode='numeric'
        onChange={(e) => setValue(e.target.value)}
        autoComplete='one-time-code'
      />
      <button onClick={sendOtp}>ارسال</button>
    </>
  )
}

export default DateSelector
