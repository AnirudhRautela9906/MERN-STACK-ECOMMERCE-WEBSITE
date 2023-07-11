import React, { Fragment, useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom"
import './Search.css'
import MetaData from '../layout/MetaData'


const Search = () => {
   const navigate = useNavigate()
    let [keyword,setKeyword] = useState("")
    useEffect(() => {
    }, [keyword])

    const searchSubmitHandler = (e) =>{
        e.preventDefault();
        keyword = keyword.trim()
        if(keyword){
            navigate(`/products/${keyword}`)
        }
        else{
            navigate(`/products`
            // ,{replace:true}
            )

        }
    }
    
  return (
<Fragment>
<MetaData title={`ECOMMERECE-SEARCH PRODUCTS`} />

    <form className='searchBox flexCenterRow' onSubmit={searchSubmitHandler}>

    <input type="text" placeholder='Search a Product...' onChange={(e)=> setKeyword(e.target.value)}/>
    <input type="submit" value="Search" />
    </form>
</Fragment>
    )
}

export default Search