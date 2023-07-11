import React, { Fragment, useEffect, useState } from "react";
import "./Products.css";
import { useSelector, useDispatch } from "react-redux";
import { getProduct } from "../../actions/productAction";
import Loader from "../layout/Loader/Loader";
import ProductCard from "../Home/ProductCard";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import Pagination from "react-js-pagination";
import Filter from "../layout/Filter";
import MetaData from '../layout/MetaData'

const Products = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState("");
  const [rating, setRating] = useState(0);

  const setCurrentPageNo = (e) => {
    setCurrentPage(e);
  };
  const { keyword } = useParams();
  const dispatch = useDispatch();
  const { loading, error, products, resultPerPage, filteredProductsCount } =
    useSelector((state) => state.products);
  let count = filteredProductsCount;

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

  const priceHandler = (event, newPrice) => {
    setPrice(newPrice);
  };


  useEffect(() => {
    let isCancelled = false;
    if (error) {
      errorAlert(error, isCancelled);
      return () => {
        isCancelled = true;
      }
    }
    dispatch(getProduct(keyword, currentPage, price, category, rating));
  }, [dispatch, keyword, currentPage, error, price, category, rating]);

  
  // if((filteredProductsCount=== 0)){
  //   infoAlert("NO PRODUCTS FOUND")
  //   }

  return (
    <Fragment>
        <MetaData title="ECOMMERECE-PRODUCTS" />
        <h2 className="productsHeading">Products</h2>
        <div className="products flexCenterRow">
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
            {products &&
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
        </Fragment>
      )}
      </div>
      <div className="filterBox ">
        <Filter
          price={price}
          priceHandler={priceHandler}
          category={category}
          setCategory={setCategory}
          rating={rating}
          setRating={setRating}
        />
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
