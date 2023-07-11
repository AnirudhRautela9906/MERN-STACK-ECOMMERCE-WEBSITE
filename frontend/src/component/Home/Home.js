import React, { Fragment, useEffect } from 'react'
import {CgMouse} from 'react-icons/cg'
import "./Home.css"
import MetaData from '../layout/MetaData'
import {getProduct} from "../../actions/productAction"
import {useSelector,useDispatch} from "react-redux"
import Loader from "../layout/Loader/Loader"
import {  toast } from 'react-toastify';
import ProductCard from './ProductCard'
import 'react-toastify/dist/ReactToastify.css';



const Home = () => {

    const dispatch = useDispatch()
    const { loading, error, products } = useSelector((state) => state.products);
    
  const errorAlert = (error,isCancelled)=>{
    toast.error(error, {
        position: window.innerWidth < 600 ? "top-center" :"bottom-center",
        autoClose: 1500,
        hideProgressBar: isCancelled,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });;
  }
      
    useEffect(() => {
        let isCancelled = false
        if (error) {
            errorAlert(error,isCancelled)
           return ()=>{isCancelled = true}
        }
        dispatch(getProduct())
    }, [dispatch, error])
    
   

  return (
    
<Fragment>
    {/* <Loader/> */}

    {loading ? <Loader/>: <Fragment>
    <MetaData title={`ECOMMERCE - HOME`}/>
    <div className="banner flexCenterColumn">
        <p>Welcome to My Ecommerce Website</p>
        <h1>FIND AMAZING PRODUCT BELOW</h1>

        <a href="#featuredProducts">
            <button>
                Scroll <CgMouse/>
            </button>
        </a>
    </div>
    <h2 className="homeHeading" id="featuredProducts">Featured Products</h2>
    <div className="container  flexCenterRow" >
       {
           products && products.map(product =>(
            <ProductCard key={product._id} product={product}/>
        ))
       }
    </div>
    
</Fragment>  }
</Fragment>
)
}

export default Home