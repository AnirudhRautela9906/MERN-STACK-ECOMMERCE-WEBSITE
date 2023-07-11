import React, { Fragment,useEffect ,useState } from 'react'
import "./NewProduct.css"
import {useSelector,useDispatch} from "react-redux"
import { Button } from '@mui/material';
import MetaData from "../layout/MetaData"
import Sidebar from "./Sidebar"
import {  toast } from 'react-toastify';
import Loader from "../layout/Loader/Loader"
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import {  useParams } from 'react-router-dom';
import { getUserDetails, updateUser } from '../../actions/userAction';
import { UPDATE_USER_RESET } from '../../constants/userConstants';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotFound from "../../component/layout/NotFound.js";



const UpdateUser = () => {
    const dispatch = useDispatch()
    const {loading,Error,user}= useSelector(state => state.userDetails)
    const {isUpdated,error}= useSelector(state => state.profile)

    const [name, setName] = useState("")  
    const [email, setEmail] = useState("")  
    const [role, setRole] = useState("")  
   
    const {id} =useParams()



   
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
        myForm.set("email",email)
        myForm.set("role",role)
        
        
        dispatch(updateUser(id,myForm))
      }

   
    
      useEffect(() => {
        let isCancelled = false
        if(error || Error){
            errorAlert(error || Error,isCancelled)
             return ()=>{isCancelled = true}
          }
        if(user && user._id !== id){
            dispatch(getUserDetails(id))
           }else{   
            setName(user.name)
            setEmail(user.email)
            setRole(user.role)
            
        }
       
       

        if(isUpdated){
            toast.success("User Updated Successfully", {
                position:window.innerWidth < 600 ? "top-center" :"bottom-center" ,
                autoClose: 1500,
                hideProgressBar: isCancelled,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                });;
                dispatch({type:UPDATE_USER_RESET})
            dispatch(getUserDetails(id))

        }
      }, [error,dispatch,isUpdated,Error,id,user])
if(Error){
    return <NotFound text={"User Not Found"} />;

}
  return (
    <Fragment>
    <MetaData title={`ADMIN - UPDATE USER`} />
    {loading ? <Loader/> :
    <div className="dashboard">
        <Sidebar/>
        <div className="newProductContainer">
            <form  className="createProductForm"  encType='multipart/form-data' onSubmit={createProductSubmitHandler}>
            <h1>Update User</h1>
                <div>
                    <AccountCircleIcon/>
                    <input 
                    type="text"  
                    placeholder='Name'
                    required
                    value={name}
                    id='name'
                    onChange={(e) => setName(e.target.value)}
                    />
                    
                </div>
                <div >
                    <MailOutlineIcon/>
                    <input 
                    type="text"  
                    placeholder='Email'
                    required
                    value={email}
                    id='email'
                    onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
             
                <div>
                <AccountTreeIcon/>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="">Choose Role</option>
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                   
                </select>
                </div>
                
                <Button
                 id='createProductBtn'
                 type="submit"
                 disabled={loading ?  true : false}
                >
                Update user
                </Button>
               
            </form>
        </div>

    </div>
      }
   </Fragment>
  )
}

export default UpdateUser