import React from 'react'
import Navigation from './Navigation'
import LandingPage from './LandingPage'
import Footer from './Footer'
import MidSection from './MidSection'
import FeatureExplain from './FeatureExplain'

const Home = () => {
  return (
    <div className="px-2 md:px-8">
        <Navigation/>
        <LandingPage/>
        <MidSection/>
        <FeatureExplain/>
        <Footer/>
    </div>
  )
}

export default Home