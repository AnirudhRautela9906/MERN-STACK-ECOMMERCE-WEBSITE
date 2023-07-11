import React, { Fragment,useEffect ,useState } from 'react'
import {useSelector,useDispatch} from "react-redux"
import {updateProduct,getProductDetails,} from "../../actions/productAction"
import { Button } from '@mui/material';
import MetaData from "../layout/MetaData"
import Sidebar from "./Sidebar"
import {  toast } from 'react-toastify';
import Loader from "../layout/Loader/Loader"
import { UPDATE_PRODUCT_RESET } from '../../constants/productConstants'
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import DescriptionIcon from '@mui/icons-material/Description';
import StorageIcon from '@mui/icons-material/Storage';
import SpellcheckIcon from '@mui/icons-material/Spellcheck';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import {  useParams } from 'react-router-dom';
import NotFound from "../../component/layout/NotFound.js";


const UpdateProduct = () => {
    const dispatch = useDispatch()
    const {error,product,loading}= useSelector(state => state.productDetails)
    const {updateError,isUpdated}= useSelector(state => state.productDelete)
    let [name, setName] = useState("")  
    let [price, setPrice] = useState(10000)  
    let [description, setDescription] = useState("")  
    let [category, setCategory] = useState("")  
    let [stock, setStock] = useState(1)  
    let [images, setImages] = useState([])  
    let [oldImages, setOldImages] = useState([])  
    let [imagesPreview, setImagesPreview] = useState([])  
    const {id} =useParams()


    const categories = [
        "Laptop",
        "Footwear",
        "Bottom",
        "Tops",
        "Attire",
        "Camera",
        "SmartPhones",
    ]

   
      const errorAlert = (reviewError,isCancelled)=>{
        toast.error(reviewError, {
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

      const createProductSubmitHandler = (e) => {
        e.preventDefault()
        const myForm = new FormData()

        myForm.set("name",name)
        myForm.set("price",price)
        myForm.set("description",description)
        myForm.set("category",category)
        myForm.set("stock",stock)
        
        images.forEach(image => {
            myForm.append("images",image)
        });

        dispatch(updateProduct(id,myForm))
      }

      const updateProductImagesChange = (e) =>{
        const files = Array.from(e.target.files)
        setImages([])
        setImagesPreview([])
        setOldImages([])

        files.forEach((file) => {
            const reader = new FileReader()            

            reader.onload = () =>{
                if(reader.readyState === 2){
                    setImagesPreview((old)  => [...old, reader.result])
                    setImages((old)  => [...old, reader.result])
                }
            }
            reader.readAsDataURL(file)
        });
      }
    
      useEffect(() => {
        let isCancelled = false
       
        if(updateError === "Cannot read properties of undefined (reading 'length')"){
            errorAlert("Please Enter Images of Product",isCancelled)
           return ()=>{isCancelled = true}
        }
    
        if(updateError || error){
          errorAlert(updateError || error,isCancelled)
           return ()=>{isCancelled = true}
        }
    
      
        if(product && product._id !== id){
            dispatch(getProductDetails(id))
           }else{   setOldImages(product.images)
            setName(product.name)
            setPrice(product.price)
            setDescription(product.description)
            setCategory(product.category)
            setStock(product.stock)
            setImagesPreview([])
        }

        if(isUpdated){
            toast.success("Product Updated Successfully", {
                position:window.innerWidth < 600 ? "top-center" :"bottom-center" ,
                autoClose: 1500,
                hideProgressBar: isCancelled,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                });;
                dispatch({type:UPDATE_PRODUCT_RESET})
            dispatch(getProductDetails(id))

        }
      }, [updateError,dispatch,error,isUpdated,id,product])
      if (error) {
        return <NotFound text={"Product Not Found"} />;
      }

  return (
    <Fragment>
    <MetaData title={`ADMIN - UPDATE PRODUCT`} />
    {loading ? <Loader/> :
    <div className="dashboard">
        <Sidebar/>
        <div className="newProductContainer">
            
            <form  className="createProductForm"  encType='multipart/form-data' onSubmit={createProductSubmitHandler}>
            <h1>Update Product</h1>
                <div>
                    <SpellcheckIcon/>
                    <input 
                    type="text"  
                    placeholder='Product Name'
                    required
                    value={name}
                    id='name'
                    onChange={(e) => setName(e.target.value)}
                    />
                    
                </div>
                <div >
                    <CurrencyRupeeIcon/>
                    <input 
                    type="number"  
                    placeholder='Price'
                    required
                    value={price}
                    id='email'

                    onChange={(e) => setPrice(e.target.value)}
                    />
                </div>
                <div>
                    <DescriptionIcon/>
                    <textarea 
                    placeholder='Product Description'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                     cols="30"
                      rows="2"
                      required
                      id='description'
                      ></textarea>
                </div>
                <div>
                <AccountTreeIcon/>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">Choose Category</option>
                    {categories.map((cate) => (
                        <option key={cate} value={cate}>{cate}</option>
                    ))}
                </select>
                </div>
                <div >
                    <StorageIcon/>
                    <input 
                    type="StorageIcon"  
                    placeholder='Stock'
                    required
                    value={stock}
                    id='stock'

                    onChange={(e) => setStock(e.target.value)}
                    />
                </div>
                <div id='createProductFormFile'>
                    <input 
                    type="file" 
                    id='avatar'
                    accept='image/*'
                    multiple
                    onChange={updateProductImagesChange}
                    />
                </div>
                <div id='createProductFormImage'>
                    {oldImages && oldImages.map((image,index) => (
                        <img key={index} src={image.url} alt="Product Preview" />
                    )) } 
                </div>
                <div id='updateProductFormImage'>
                    {imagesPreview.map((image,index) => (
                        <img key={index} src={image} alt="Product Preview" />
                    )) } 
                </div>
                <Button
                 id='createProductBtn'
                 type="submit"
                 disabled={loading ?  true : false}
                >
                Update
                </Button>
               
            </form>
        </div>

    </div>
      }
   </Fragment>
  )
}

export default UpdateProduct