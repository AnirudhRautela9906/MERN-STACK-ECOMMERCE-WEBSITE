import React, { Fragment, useEffect, useState } from "react";
import "./Products.css";
import { useSelector, useDispatch } from "react-redux";
import { getProduct } from "../../actions/productAction";
import Loader from "../layout/Loader/Loader";
import ProductCard from "../Home/ProductCard";
import { toast } from "react-toastify";
// import { useParams } from "react-router-dom";
import Pagination from "react-js-pagination";
// import Filter from "../layout/Filter";
import MetaData from "../layout/MetaData";
import { Typography, Slider } from "@mui/material";

const Products = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState("All Products");
  const [rating, setRating] = useState(0);

  const setCurrentPageNo = (e) => {
    setCurrentPage(e);
  };
  // let { keyword } = useParams();
  const dispatch = useDispatch();
  const { loading, error, products, resultPerPage, filteredProductsCount } =
    useSelector((state) => state.products);
  let count = filteredProductsCount;

  const categories = [
    "All Products",
    "Laptop",
    "Footwear",
    "Bottom",
    "Tops",
    "Attire",
    "Camera",
    "SmartPhones",
  ];

  // const infoAlert = (message)=>{
  //   toast.info(message, {
  //     position: "bottom-center",
  //     autoClose: 1500,
  //     hideProgressBar: false,
  //     closeOnClick: true,
  //     pauseOnHover: true,
  //     draggable: true,
  //     progress: undefined,
  //     theme: "light",
  //   });
  // }
  const errorAlert = (error, isCancelled) => {
    toast.error(error, {
      position: "bottom-center",
      autoClose: 1500,
      hideProgressBar: isCancelled,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };
  const [price, setPrice] = useState([0, 50000]);
  const [keyword, setKeyword] = useState(localStorage.getItem("keyword"));

  const priceHandler = (event, newPrice) => {
    setPrice(newPrice);
  };

  const filterProducts = products.filter((item) =>
    item.price >= price[0] &&
    item.price <= price[1] &&
    item.category ===
      (category === "All Products" ? item.category : category) &&
    item.ratings >= rating )

  useEffect(() => {
    let isCancelled = false;
    if (error) {
      errorAlert(error, isCancelled);
      return () => {
        isCancelled = true;
      };
    }
    dispatch(getProduct(currentPage));
  }, [dispatch, currentPage, error]);


  return (
    <Fragment>
      <MetaData title="ECOMMERECE-PRODUCTS" />
      <h2 className="productsHeading">{keyword  ?  `You searched for ${keyword}` : category}</h2>
      <div className="products flexCenterRow">
        {loading ? (
          <Loader />
        ) : (
          <Fragment>
            {filterProducts &&
              filterProducts.filter((item)=>
              item.name.toLowerCase().includes(keyword ? keyword.toLowerCase() : item.name.toLowerCase() )
              ).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
          </Fragment>
        )}
      </div>
      <div className="filterBox ">
        <Typography>Price</Typography>
        <Slider
          value={price}
          onChange={priceHandler}
          valueLabelDisplay="auto"
          aria-labelledby="range-slider"
          min={0}
          max={50000}
        />
        <Typography>Categories</Typography>
        <ul className="categoryBox">
          {categories.map((category) => [
            <li
              className="categoryLink"
              key={category}
              onClick={() => {
                setCategory(category);
                localStorage.removeItem("keyword");
                setKeyword("")
              }}
            >
              {category}
            </li>,
          ])}
        </ul>
        <fieldset>
          <Typography component="legend">Ratings Above</Typography>
          <Slider
            value={rating}
            onChange={(e, newRating) => {
              setRating(newRating);
            }}
            aria-labelledby="continuous-slider"
            valueLabelDisplay="auto"
            min={0}
            max={5}
          />
        </fieldset>
      </div>

      {resultPerPage < count && (
        <div className="paginationBox">
          <Pagination
            activePage={currentPage}
            itemsCountPerPage={resultPerPage}
            totalItemsCount={count}
            onChange={setCurrentPageNo}
            nextPageText="Next"
            prevPageText="Prev"
            firstPageText="First"
            lastPageText="Last"
            itemClass="page-item"
            linkClass="page-link"
            activeClass="pageItemActive"
            activeLinkClass="pageLinkActive"
          />
        </div>
      )}
    </Fragment>
  );
};

export default Products;
