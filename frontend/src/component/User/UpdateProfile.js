import React, { Fragment, useEffect, useState} from 'react'
import './UpdateProfile.css'
import Loader from '../layout/Loader/Loader.js'
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {useSelector,useDispatch} from "react-redux"
import {loadUser, updateProfile} from "../../actions/userAction"
import {  toast } from 'react-toastify';
import { UPDATE_PROFILE_RESET } from '../../constants/userConstants';
import MetaData from '../layout/MetaData'


const UpdateProfile = () => {

    const {user} = useSelector((state) => state.user)
    const {error,isUpdated,loading} = useSelector((state) => state.profile)
    const dispatch = useDispatch()

   const [name, setName] = useState("")
   const [email, setEmail] = useState("")

    const [avatar, setAvatar] = useState("")
    const [avatarPreview, setAvatarPreview] = useState()


    const updateProfileSubmit = (e)=>{
        e.preventDefault()
        const myForm = new FormData()

        myForm.set("name",name)
        myForm.set("email",email)
        myForm.set("avatar",avatar)

        dispatch(updateProfile(myForm))

    }

    const updateProfileDataChange = (e)=>{
            const reader = new FileReader()
            reader.onload = () => {
                if(reader.readyState === 2){
                    setAvatarPreview(reader.result)
                    setAvatar(reader.result)
                }
            }
            reader.readAsDataURL(e.target.files[0]);
        }
        
        const errorAlert = (error,isCancelled)=>{
            toast.error(error, {
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
        
        useEffect(() => {
                let isCancelled = false
                if(user){
                    setName(user.name)
                    setEmail(user.email)
                    setAvatarPreview(user.avatar?.url)
                }
                if (error) {
                    isCancelled =false
                errorAlert(error,isCancelled)
               return ()=>{isCancelled = true}
            }
          if(isUpdated){
            toast.success(`Profile Updated Successfully`, {
                position: window.innerWidth < 600 ? "top-center" :"bottom-center",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                });
            dispatch(loadUser())
            dispatch({
                type: UPDATE_PROFILE_RESET
            })
          }
        }, [dispatch,error,isUpdated,user])

  return (
    <Fragment>
        {
            loading ? <Loader/> :

            <Fragment>

                <MetaData title={`Update Profile`} />
        
                <div className="updateProfileContainer flexCenterRow">
                <div className="updateProfileBox">
                    
                    <h2 className='updateProfileHeading'>Update Profile</h2>
                   
                    <form  className="updateProfileForm flexCenterColumn"  encType='multipart/form-data' onSubmit={updateProfileSubmit}>
                        <div className="updateProfileName">
                            <AccountCircleIcon/>
                            <input 
                            type="text"  
                            placeholder='Name'
                            required
                            value={name}
                            id='name'
                            onChange={(e)=> setName(e.target.value)}
                            />
                            
                        </div>
                        <div className="updateProfileEmail">
                            <MailOutlineIcon/>
                            <input 
                            type="email"  
                            placeholder='Email'
                            required
                            value={email}
                            id='email'
        
                            onChange={(e)=> setEmail(e.target.value)}
                            />
                        </div>
                        <div id="updateProfileImage">
                            <img src={avatarPreview} alt="Avatar Preview" />
                            <input type="file"
                            name='avatar'
                            id='avatar'
                            accept='image/*'
                            onChange={updateProfileDataChange}
                            />
                        </div>
                        <input type="submit"
                        value="Update Profile"
                        className='updateProfileBtn'
                        />
                    </form>
                </div>
            </div>
            </Fragment>
        }
    </Fragment>
  )
}

export default UpdateProfile