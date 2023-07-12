import React, { Fragment, useEffect, useRef ,useState} from 'react'
import './LoginSignUp.css'
import MetaData from '../layout/MetaData'
import {Link, useLocation} from "react-router-dom"
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {useSelector,useDispatch} from "react-redux"
import {login,register} from "../../actions/userAction"
import {  toast } from 'react-toastify';
import Loader from '../layout/Loader/Loader.js'
import { useNavigate } from "react-router-dom"
import image from "../../images/image"
import passToText from '../layout/PassToggle'



const LoginSignUp = () => {

    const [registerPassInputType,registerIconToggle] = passToText()
    const [loginPassInputType,loginIconToggle] = passToText()

    const {error,loading,isAuthenticated,Name,isloggedOut} = useSelector((state) => state.user)
    const dispatch = useDispatch()
   const navigate = useNavigate()

   
    
    const loginTab = useRef(null)
    const registerTab = useRef(null)
    const switcherTab = useRef(null)

    const [loginEmail, setLoginEmail] = useState("")
    const [loginPassword, setLoginPassword] = useState("")
    // const [avatar, setAvatar] = useState("/logo512.png")
    // const [avatarPreview, setAvatarPreview] = useState("/logo512.png")
    
    const [user, setUser] = useState({
        name:"",
        email:"",
        password:"",
    })
    const {name,email,password} = user

    const loginSubmit = (e) => {
        e.preventDefault()
        const myForm = new FormData()

        myForm.set("loginEmail",loginEmail)
        myForm.set("loginPassword",loginPassword)
        dispatch(login(loginEmail,loginPassword))
    }

    const registerSubmit = (e)=>{
        e.preventDefault()
        const myForm = new FormData()

        myForm.set("name",name)
        myForm.set("email",email)
        myForm.set("password",password)
        myForm.set("avatar",image)
        // myForm.set("avatar","../../images/logo512.png")
        dispatch(register(myForm))

    }

    const registerDataChange = (e)=>{
        // if(e.target.id === "avatar"){
        //     const reader = new FileReader()

        //     reader.onload = () => {
        //         if(reader.readyState === 2){
        //             setAvatarPreview(reader.result)
        //             setAvatar(reader.result)
        //         }
        //     }
        //     reader.readAsDataURL(e.target.files[0]);
        // }
        // else{
            setUser(()=>{
                let helper = {...user}
                helper[`${e.target.id}`] = e.target.value
                return helper
            })
        //     console.log(e.target.value)
        // console.log(user)
        // }
    }

    const switchTabs = (e,tab)=> {
        if(tab === "login"){
            switcherTab.current.classList.add('shiftToNeutral')
            switcherTab.current.classList.remove('shiftToRight')
            
            registerTab.current.classList.remove('shiftToNeutralForm')
            loginTab.current.classList.remove('shiftToLeft')
        }
        if(tab === "register"){
            switcherTab.current.classList.add('shiftToRight')
            switcherTab.current.classList.remove('shiftToNeutral')
            
            registerTab.current.classList.add('shiftToNeutralForm')
            loginTab.current.classList.add('shiftToLeft')
        }
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

      const location = useLocation()

    useEffect(() => {
        let isCancelled = false
        if (error === "Please Login to access this resource") {
           return
        }
    
    else 
    if(isAuthenticated === true){
        if(location.search){
            navigate(`/${location.search.split("=")[1]}`)
        }
        else{
            navigate('/account')
        }
        if(Name || name)
        toast.success(`Welcome ${Name || name}`, {
            position: window.innerWidth < 600 ? "top-center" :"bottom-center",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            });;
      }
      if (isloggedOut === true) {
        toast.success(`SEE U SOON`, {
          position: window.innerWidth < 600 ? "top-center" : "bottom-center",
          autoClose: 1500,
          hideProgressBar: isCancelled,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
       
      }


      else  {
        errorAlert(error,isCancelled)
       return ()=>{isCancelled = true}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch,error,isAuthenticated,navigate,isloggedOut])
    

  return (
<Fragment>
<MetaData title={`ECOMMERECE-LOGIN/SIGNUP`} />
    {loading ? <Loader/> :
    
    <div className="loginSignUpContainer flexCenterRow">
        <div className="loginSignUpBox">
            <div>
                <div className="login_signUp_toggle">
                    <p onClick={(e)=> switchTabs(e,"login")}>LOGIN</p>
                    <p onClick={(e)=> switchTabs(e,"register")}>REGISTER</p>
                </div>
                <button ref={switcherTab}></button>
            </div>
            <form action="" className="loginForm flexCenterColumn" ref={loginTab} onSubmit={loginSubmit}>
                <div className="loginEmail">
                    <MailOutlineIcon/>
                    <input 
                    type="email"  
                    placeholder='Email'
                    required
                    id='loginEmail'
                    value={loginEmail}
                    onChange={(e)=> setLoginEmail(e.target.value)}
                    />
                </div>
                <div className="loginPassword">
                    <LockOpenIcon/>
                    <input 
                       type={loginPassInputType}
                    placeholder='Password'
                    required
                    id='loginPassword'
                    value={loginPassword}
                    onChange={(e)=> setLoginPassword(e.target.value)}
                    />
                    <span className="eye">
                    {loginIconToggle}
                    </span>
                </div>
                <Link to="/forgot_password">Forgot Password ?</Link>
                <input type="submit" value="Login" className='loginBtn'/>
            </form>
            <form  className="signUpForm flexCenterColumn" ref={registerTab} encType='multipart/form-data' onSubmit={registerSubmit}>
                <div className="signUpName">
                    <AccountCircleIcon/>
                    <input 
                    type="text"  
                    placeholder='Name'
                    required
                    value={name}
                    id='name'
                    onChange={registerDataChange}
                    />
                    
                </div>
                <div className="signUpEmail">
                    <MailOutlineIcon/>
                    <input 
                    type="email"  
                    placeholder='Email'
                    required
                    value={email}
                    id='email'

                    onChange={registerDataChange}
                    />
                </div>
                <div className="signUpPassword">
                    <LockOpenIcon/>
                    <input 
                   type={registerPassInputType}
                    placeholder='Password'
                    required
                    value={password}
                    id='password'
                    autoComplete='on'

                    onChange={registerDataChange}
                    />
                    <span className="eye">
                    {registerIconToggle}
                    </span>
                    
                </div>
                {/* <div id="registerImage">
                    <img src={avatarPreview} alt="Avatar Preview" />
                    <input type="file"
                    name='avatar'
                    id='avatar'
                    accept='image/*'
                    onChange={registerDataChange}
                    />
                </div> */}
                <input type="submit"
                value="Register"
                className='signUpBtn'
                // disabled={loading ?  true : false}
                />
            </form>
        </div>
    </div>

    }
</Fragment>
    )
}

export default LoginSignUp