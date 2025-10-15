import React from 'react'
import Link from 'next/link'
import Navitems from './Navitems'
import { SignInButton, SignedOut, UserButton, SignedIn } from '@clerk/nextjs'

const Navbar = () => {
  return (
    <nav className='navbar'>
      <Link href={'/'}>
        <div className='flex items-center gap-2.5 cursor-pointer'>
          <img src="/images/logo.svg" alt="logo" width={46} height={44} />
        </div>
      </Link>
      <div className='flex items-center gap-8'>
        <Navitems />
        <SignedOut>
          <SignInButton>
            <button className='btn-signin'>Sign in</button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <Link href="/subscription" className="btn-subscription">Subscription</Link>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  )
}

export default Navbar