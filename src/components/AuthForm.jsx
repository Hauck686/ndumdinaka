import React from 'react'

export default function AuthForm ({ type }) {
  const isRegister = type === 'register'

  return (
    <div className='auth-container'>
      <h2 className='auth-title'>
        {isRegister ? 'Create an account' : 'Log in to your account'}
      </h2>

      <form className='auth-form'>
        {isRegister && (
          <div className='name-fields'>
            <div className={'inputGroup'}>
              <input type='first name' id='first name' required />
              <label htmlFor='first name'>First name*</label>
              <span className={'underline'}></span>
            </div>
            <div className={'inputGroup'}>
              <input type='last name' id='last name' required />
              <label htmlFor='last name'>Last name*</label>
              <span className={'underline'}></span>
            </div>
          </div>
        )}

        <div className={'inputGroup'}>
          <input type='email' id='email' required />
          <label htmlFor='email'>Email*</label>
          <span className={'underline'}></span>
        </div>
        <div className={'inputGroup'}>
          <input type='Password' id='Password' required />
          <label htmlFor='Password'>Password*</label>
          <span className={'underline'}></span>
        </div>
        {isRegister && (
          <input type='password' placeholder='Confirm password*' required />
        )}
        <button type='submit' className='auth-button'>
          {isRegister ? 'Confirm' : 'Log In'}
        </button>
      </form>

      <p className='auth-switch'>
        {isRegister ? (
          <>
            Already have an account? <a href='/auth/login'>Log in</a>
          </>
        ) : (
          <>
            Don’t have an account? <a href='/auth/register'>Create one</a>
          </>
        )}
      </p>
    </div>
  )
}
