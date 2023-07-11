import React, { Fragment } from 'react'
import {Typography ,Slider} from "@mui/material"


const Filter = ({price, priceHandler,setCategory,category,rating,setRating}) => {

    const categories = [
        "Laptop",
        "Footwear",
        "Bottom",
        "Tops",
        "Attire",
        "Camera",
        "SmartPhones",
    ]
  
  return (
    <Fragment>
        <Typography>Price</Typography>
    <Slider
    value={price}
    onChange={priceHandler}
    valueLabelDisplay='auto'
    aria-labelledby='range-slider'
    min={0}
    max={50000}
    />
    <Typography>Categories</Typography>
    <ul className="categoryBox">
        {categories.map((category)=>[
            <li className="categoryLink" key={category} onClick={()=> setCategory(category)}>{category}</li>
        ])}
    </ul>
    <fieldset>
    <Typography component="legend">Ratings Above</Typography>
    <Slider
    value={rating}
    onChange={(e,newRating)=>{setRating(newRating)}}
    aria-labelledby='continuous-slider'
    valueLabelDisplay='auto'

    min={0}
    max={5}
    />
    </fieldset>
    </Fragment>
  )
}

export default Filter