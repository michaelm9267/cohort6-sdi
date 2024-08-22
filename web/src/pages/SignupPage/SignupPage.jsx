import { useRef } from 'react'
import { useEffect } from 'react'

import {
  Form,
  Label,
  TextField,
  PasswordField,
  FieldError,
  Submit,
  SelectField,
} from '@redwoodjs/forms'
import { Link, navigate, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import { toast, Toaster } from '@redwoodjs/web/toast'

import { useAuth } from 'src/auth'
import skySupplyLogo from 'src/components/PresentationPageComponents/images/SkySupplyLogo.png'


const SignupPage = () => {
  const { signUp } = useAuth()

  // focus on email box on page load
  const emailRef = useRef(null)
  useEffect(() => {
    emailRef.current?.focus()
  }, [])

  const onSubmit = async (data) => {
    const response = await signUp({ ...data })

    if (response.message) {
      toast.error(response.message)
    } else {
      toast.success('Welcome')
      navigate(routes.login())
    }
  }

  return (
    <>
      <MetaTags title="Signup" />

      <main className="rw-main">
        <Toaster toastOptions={{ className: 'rw-toast', duration: 6000 }} />
        <div className="rw-scaffold rw-login-container">
          <img src={skySupplyLogo} alt="Sky Supply Logo" />
          <div className="rw-segment">
            <header className="rw-segment-header">
              <h2 className="rw-heading rw-heading-secondary">Signup</h2>
            </header>

            <div className="rw-segment-main">
              <div className="rw-form-wrapper">
                <Form onSubmit={onSubmit} className="rw-form-wrapper">
                  <Label
                    name="username"
                    className="rw-label"
                    errorClassName="rw-label rw-label-error"
                  >
                    Email
                  </Label>
                  <TextField
                    name="username"
                    className="rw-input"
                    errorClassName="rw-input rw-input-error"
                    ref={emailRef}
                    validation={{
                      required: {
                        value: true,
                        message: 'Email is required',
                      },
                    }}
                  />

                  <FieldError name="email" className="rw-field-error" />

                  <Label
                    name="password"
                    className="rw-label"
                    errorClassName="rw-label rw-label-error"
                  >
                    Password
                  </Label>
                  <PasswordField
                    name="password"
                    className="rw-input"
                    errorClassName="rw-input rw-input-error"
                    autoComplete="current-password"
                    validation={{
                      required: {
                        value: true,
                        message: 'Password is required',
                      },
                    }}
                  />

                  <FieldError
                    name="hashedPassword"
                    className="rw-field-error"
                  />

                  <Label
                    name="firstName"
                    className="rw-label"
                    errorClassName="rw-label rw-label-error"
                  >
                    First Name
                  </Label>
                  <TextField
                    name="firstName"
                    className="rw-input"
                    errorClassName="rw-input rw-input-error"
                    validation={{
                      required: {
                        value: true,
                        message: 'First name is required',
                      },
                    }}
                  />

                  <FieldError name="firstName" className="rw-field-error" />

                  <Label
                    name="lastName"
                    className="rw-label"
                    errorClassName="rw-label rw-label-error"
                  >
                    Last Name
                  </Label>
                  <TextField
                    name="lastName"
                    className="rw-input"
                    errorClassName="rw-input rw-input-error"
                    validation={{
                      required: {
                        value: true,
                        message: 'Last name is required',
                      },
                    }}
                  />

                  <FieldError name="lastName" className="rw-field-error" />

                  <Label
                    name="rank"
                    className="rw-label"
                    errorClassName="rw-label rw-label-error"
                  >
                    Rank
                  </Label>
                  <SelectField
                    name="rank"
                    className="rw-input"
                    errorClassName="rw-input rw-input-error"
                    validation={{
                      required: {
                        matchesInitialValue: (value) => {
                          return (
                            value !== 'Please select an option' ||
                            'Select an Option'
                          )
                        },
                      },
                    }}
                  >
                    <option>AB</option>
                    <option>Amn</option>
                    <option>A1C</option>
                    <option>SrA</option>
                    <option>SSgt</option>
                    <option>TSgt</option>
                    <option>MSgt</option>
                    <option>2Lt</option>
                    <option>1Lt</option>
                    <option>Capt</option>
                  </SelectField>

                  <FieldError name="rank" className="rw-field-error" />

                  <Label
                    name="shop"
                    className="rw-label"
                    errorClassName="rw-label rw-label-error"
                  >
                    Shop
                  </Label>
                  <SelectField
                    name="shop"
                    className="rw-input"
                    errorClassName="rw-input rw-input-error"
                    type="number"
                    validation={{
                      required: {
                        matchesInitialValue: (value) => {
                          return (
                            value !== 'Please select an option' ||
                            'Select an Option'
                          )
                        },
                      },
                    }}
                  >
                    <option value={121}>ELAB</option>
                    <option value={120}>Transportation</option>
                    <option value={123}>CFP</option>
                    <option value={124}>EMT</option>
                    <option value={125}>LRS</option>
                  </SelectField>

                  <FieldError name="selectShop" className="rw-field-error" />

                  <div className="rw-button-group">
                    <Submit className="rw-button rw-button-blue">
                      Sign Up
                    </Submit>
                  </div>
                </Form>
              </div>
            </div>
          </div>
          <div className="rw-login-link">
            <span>Already have an account?</span>{' '}
            <Link to={routes.login()} className="rw-link">
              Log in!
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}

export default SignupPage
