const catchAsyncErrors = require("../middleware/catchAsyncErrors");

const stripe = require("stripe")(process.env.STRIPE_API_SECRET)

exports.processPayment = catchAsyncErrors(async (req,res,next)=>{
    const myPayment = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: "inr",
        metadata: {
            company: "Ecommerce"
        }
    })

    res.status(200).json({
        success:true,
        client_secret: myPayment.client_secret
    })
})

exports.sendStripeApiKey = catchAsyncErrors(async (req,res,next)=>{
    
    res.status(200).json({
        success:true,
        stripeApiKey: process.env.STRIPE_API_KEY
    })
})
