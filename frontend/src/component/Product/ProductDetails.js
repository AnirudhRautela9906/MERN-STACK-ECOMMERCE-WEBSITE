import React, { Fragment, useEffect, useState } from "react";
import "./ProductDetails.css";
import Carousel from "react-material-ui-carousel";
import { useSelector, useDispatch } from "react-redux";
import { getProductDetails, newReview } from "../../actions/productAction";
import { useParams } from "react-router-dom";
import Loader from "../layout/Loader/Loader";
import ReviewCard from "./ReviewCard.js";
import { toast } from "react-toastify";
import MetaData from "../layout/MetaData";
import NotFound from "../../component/layout/NotFound.js";
import { addItemsToCart } from "../../actions/cartAction";

import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Button,
  Rating,
  Stack
} from "@mui/material";
import { NEW_REVIEW_RESET } from "../../constants/productConstants";

const ProductDetails = () => {
  const errorAlert = (error, isCancelled) => {
    toast.error(error, {
      position: window.innerWidth < 600 ? "top-center" : "bottom-center",
      autoClose: 1500,
      hideProgressBar: isCancelled,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };
  const { id } = useParams();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);


  const decreaseQuantity = () => {
    if (quantity <= 1) return;
    setQuantity(quantity - 1);
  };
  const increaseQuantity = () => {
    if (product.stock <= quantity) return;
    setQuantity(quantity + 1);
  };
  const { product, loading, error } = useSelector(
    (state) => state.productDetails
  );
  const { success, reviewError } = useSelector((state) => state.newReview);

  const addToCartHandler = () => {
    // dispatch(addItemsToCart(id,product.name,product.price,product.images[0].url,product.stock,quantity))
    dispatch(addItemsToCart(id, quantity));
    toast.success("Items added to Cart", {
      position: window.innerWidth < 600 ? "top-center" : "bottom-center",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  // eslint-disable-next-line no-unused-vars
  const [value, setValue] = useState();

 
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const submitReviewToggle = () => {
    open ? setOpen(false) : setOpen(true);
  };

  const reviewSubmitHandler = () => {
    const myForm = new FormData();
    setValue(rating);
    myForm.set("rating", rating);
    myForm.set("comment", comment);
    myForm.set("productId", id);

    dispatch(newReview(myForm));
    submitReviewToggle();
  };
  const Review = () => {
    if (product.numOfReviews < 1) {
      return "No Reviews";
    }
    if (product.numOfReviews === 1) {
      return "Review";
    } else {
      return "Reviews";
    }
  };

  useEffect(() => {
    let isCancelled = false;
    if (error) {
      errorAlert(error, isCancelled);
      return () => {
        isCancelled = true;
      };
    }
    if (reviewError) {
      toast.error(reviewError, {
        position: window.innerWidth < 600 ? "top-center" : "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
    if (success) {
      toast.success("Review Submitted Successfully", {
        position: window.innerWidth < 600 ? "top-center" : "bottom-center",
        autoClose: 5000,
        hideProgressBar: isCancelled,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      dispatch({ type: NEW_REVIEW_RESET });
    }

    dispatch(getProductDetails(id));
  }, [dispatch, error, id, success, reviewError]);

  if (error) {
    return <NotFound text={"Product Not Found"} />;
  }

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        !error && (
          <Fragment>
            <MetaData title={`ECOMMERECE-${product.name}`} />
            <div  className="productDetails">
              <div>
                <div className="CarouselBox">
                  <Carousel navButtonsAlwaysVisible={true}>
                    {product.images &&
                      product.images.map((item, i) => (
                        <img
                          key={item.url}
                          src={item.url}
                          alt={`${i} Slide `}
                          className="CarouselImage"
                        />
                      ))}
                  </Carousel>
                </div>
              </div>
              <div>
                <div className="detailsBlock-1">
                  <h2>{product.name} </h2>
                  <p>Product # {product._id} </p>
                </div>
                <div className="detailsBlock-2">
                  <Stack>
                    <Rating
                      value={product.ratings}
                      readOnly
                      style={{color:"tomato"}}
                      color=""
                      size="large"
                      precision={0.5}
                      />
                      </Stack>
                  <span>
                    {product.numOfReviews < 1 ? "" : product.numOfReviews}{" "}
                    {Review()}{" "}
                  </span>
                </div>
                <div className="detailsBlock-3">
                  <div className="price">Rs {product.price} </div>
                  <div className="detailsBlock-3-1">
                    <div className="detailsBlock-3-1-1">
                      <button onClick={decreaseQuantity}>-</button>
                      <input readOnly type="number" value={quantity} />
                      <button onClick={increaseQuantity}>+</button>
                    </div>
                    <button
                      disabled={product.stock < 1}
                      onClick={addToCartHandler}
                    >
                      Add to Cart
                    </button>
                  </div>
                  <p>
                    Status:{" "}
                    <b
                      className={product.stock < 1 ? "redColor" : "greenColor"}
                    >
                      {product.stock < 1 ? "Out of Stock" : "In Stock"}
                    </b>
                  </p>
                </div>
                <div className="detailsBlock-4">
                  Description: <p>{product.description} </p>
                </div>
                <button onClick={submitReviewToggle} className="submitReview">
                  Submit Review
                </button>
              </div>
            </div>

            <h3 className="reviewsHeading">REVIEWS</h3>

            <Dialog
              aria-labelledby="simple-dialog-title"
              open={open}
              onClose={submitReviewToggle}
            >
              <DialogTitle>Submit Review</DialogTitle>
              <DialogContent className="submitDialog">
                <Rating
                  name="simple-controlled"
                  value={rating}
                  size="large"
                  onChange={(event, newValue) => {
                    setRating(newValue);
                  }}
                />
                <textarea
                  className="submitDialogTextArea"
                  cols="50"
                  rows="5"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                ></textarea>
              </DialogContent>
              <DialogActions>
                <Button onClick={submitReviewToggle} color="secondary">
                  Cancel
                </Button>
                <Button onClick={reviewSubmitHandler}>Submit</Button>
              </DialogActions>
            </Dialog>

            {product.reviews && product.reviews[0] ? (
              <div className="reviews">
                {product.reviews.map((review) => (
                  <ReviewCard key={review._id} review={review}></ReviewCard>
                ))}
              </div>
            ) : (
              <div className="noReviews">No Reviews Yet</div>
            )}
          </Fragment>
        )
      )}
    </Fragment>
  );
};

export default ProductDetails;
