import React, { Fragment, useEffect, useState } from 'react'
import Payment from './Payment'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import axios from "axios";

const StripeWrap = () => {
  const [stripeApiKey,setStripeApikey] = useState("")
  const getStripeApiKey = async()=> {
    const { data } = await axios.get("/api/v1/stripeapikey");
    setStripeApikey(data.stripeApiKey)
  }
  useEffect(() => {
   
    getStripeApiKey()
  }, [])
  
if(!stripeApiKey)return;  
  return (
   <Fragment>
     < Elements stripe={loadStripe(`${stripeApiKey}`)}>
        {stripeApiKey && <Payment  />}
    </Elements>
   </Fragment>
  )
}

export default StripeWrap