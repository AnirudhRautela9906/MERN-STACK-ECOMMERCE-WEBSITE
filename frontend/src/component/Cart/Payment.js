import React, {Fragment,useEffect,useRef} from 'react'
import CheckoutSteps from "../Cart/CheckoutSteps"
import {useSelector,useDispatch} from "react-redux"
import MetaData from "../layout/MetaData"
import { Typography } from '@mui/material'
import {  toast } from 'react-toastify';
import {useNavigate} from "react-router-dom"
import {
    CardNumberElement,
    CardCvcElement,
    CardExpiryElement,
    useStripe,
    useElements,    
} from "@stripe/react-stripe-js"
import axios from "axios"
import "./Payment.css"
import CreditCardIcon from '@mui/icons-material/CreditCard';
import EventIcon from '@mui/icons-material/Event';
import KeyIcon from '@mui/icons-material/Key';
import {createOrder} from '../../actions/orderAction'
import { orderSuccessCartEmpty } from '../../actions/cartAction'




const Payment = () => {
    const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"))
    const paymentData = {
        amount: Math.round(orderInfo.totalPrice * 100)
    }
    const payBtn = useRef(null)
    const dispatch = useDispatch()
    const stripe =useStripe()
    const elements = useElements()
    const navigate = useNavigate()

    const {shippingInfo,cartItems} = useSelector(state => state.cart)
    const {user} = useSelector(state => state.user)
    const {error} = useSelector(state => state.newOrder)

    function errorAlert (errors,isCancelled){
        toast.error(errors, {
            position:window.innerWidth < 600 ? "top-center" :"bottom-center" ,
            autoClose: 1500,
            hideProgressBar: isCancelled,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            });;
      }
      const order={
        shippingInfo,
        orderItems: cartItems,
        itemPrice: orderInfo.subtotal,
        taxPrice: orderInfo.tax,
        shippingPrice: orderInfo.shippingCharges,
        totalPrice: orderInfo.totalPrice,
      }

    const submitHandler = async (e)=>{
        e.preventDefault()
        payBtn.current.disabled = true
        try {
            const config ={
                headers: {
                    "Content-Type": "application/json"
                }
            }
            const {data} = await axios.post("/api/v1/payment/process",paymentData,config)
            const client_secret =data.client_secret
            if(!stripe || !elements) return;
            const result = await stripe.confirmCardPayment(client_secret,{
                payment_method:{
                    card:elements.getElement(CardNumberElement),
                    billing_details:{
                        name: user.name,
                        email:user.email,
                        address:{
                            line1: shippingInfo.address,
                            city: shippingInfo.city,
                            state: shippingInfo.state,
                            postal_code: shippingInfo.pincode,
                            country: shippingInfo.country,
                        }
                    }
                }
            })
            if(result.error){
                payBtn.current.disabled = false
                errorAlert(result.error.message,false)
            }
            else {
                if(result.paymentIntent.status=== "succeeded"){

                    order.paymentInfo={
                        id:result.paymentIntent.id,
                        status:result.paymentIntent.status
                    }
                    
                    dispatch(createOrder(order))
                    
                    toast.success(`Payment Processed Successfully`, {
                        position: window.innerWidth < 600 ? "top-center" :"bottom-center",
                        autoClose: 1500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                        });;
                        navigate("/success")
                        setTimeout(() => {
                            
                            dispatch(orderSuccessCartEmpty())
                        }, 100);
                }
                else{
                    errorAlert("There's some issue while processing payment",false)
                }
            }
        } catch (error) {
            payBtn.current.disabled = false
            errorAlert(error.message,false)
        }
    }
  useEffect(() => {
    let isCancelled = false
    if(error){
        errorAlert(error,isCancelled)
        return ()=>{isCancelled = true}
    }
    if(cartItems.length === 0) return navigate('/orders')
  }, [error,cartItems.length,navigate])
  

  return (
    <Fragment>
        <MetaData title={"ECOMMERCE - PAYMENT"} />
        <CheckoutSteps activeStep={2} />
        <div className="paymentContainer">
        
            <form  className="paymentForm" onSubmit={(e)=> submitHandler(e)} >
                <Typography>Card Info</Typography>
                <div>
                    <CreditCardIcon />
                    <CardNumberElement className='paymentInput' />
                </div>
                <div>
                    <EventIcon />
                    <CardExpiryElement className='paymentInput' />
                </div>
                <div>
                    <KeyIcon />
                    <CardCvcElement className='paymentInput' />
                </div>
                <input 
                type="submit" 
                value={`Pay - Rs ${orderInfo && orderInfo.totalPrice}`}
                ref={payBtn}
                className='paymentFormBtn'
                />
            </form>
        </div>
    </Fragment>
  )
}

export default Payment