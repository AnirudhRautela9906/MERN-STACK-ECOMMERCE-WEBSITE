import { ADD_TO_CART , REMOVE_CART_ITEM, SAVE_SHIPPING_INFO ,ORDER_SUCCESS_CART_EMPTY} from "../constants/cartConstants.js";
import axios from "axios"


//   Cart
// export const addItemsToCart = (id,Name,Price,Image,Stock,quantity)=> async (dispatch,getState) =>{
export const addItemsToCart = (id,quantity)=> async (dispatch,getState) =>{

        const {data} = await axios.get(`/api/v1/product/${id}`)
        
        dispatch({
            type:ADD_TO_CART,
            payload:{
                // productId:id,
                // name:Name,
                // price:Price,
                // image:Image,
                // stock:Stock,
                productId:data.product._id,
                name:data.product.name,
                price:data.product.price,
                image:data.product.images[0].url,
                stock:data.product.stock,
                quantity
            }
        })
        localStorage.setItem("cartItems",JSON.stringify(getState().cart.cartItems))

  }

// Remove from Cart
export const removeItemsToCart = (prouductId)=> async (dispatch,getState) =>{
    dispatch({
        type:REMOVE_CART_ITEM,
        payload: prouductId
    })
    localStorage.setItem("cartItems",JSON.stringify(getState().cart.cartItems))
    
}

//  Shipping Info
export const saveShippingInfo = (data)=> async (dispatch) =>{
   
    dispatch({
        type: SAVE_SHIPPING_INFO,
        payload: data,
    })
    localStorage.setItem("shippingInfo",JSON.stringify(data))

}

// Order success cart empty
export const orderSuccessCartEmpty = ()=> async (dispatch) =>{
   
    dispatch({
        type: ORDER_SUCCESS_CART_EMPTY,
    })
    localStorage.setItem("cartItems",[])

}