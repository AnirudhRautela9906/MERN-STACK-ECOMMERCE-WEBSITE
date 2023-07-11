import React, { useEffect, useState } from "react";
import "./ProductReviews.css";
import { DataGrid } from "@mui/x-data-grid";
import { useSelector, useDispatch } from "react-redux";
import { getAllReviews,deleteReviews } from "../../actions/productAction";
import MetaData from "../layout/MetaData";
import Sidebar from "./Sidebar";
import DeleteIcon from "@mui/icons-material/Delete";
import { Fragment } from "react";
import { toast } from "react-toastify";
import Loader from "../layout/Loader/Loader";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { DELETE_REVIEW_RESET } from "../../constants/productConstants";
import SearchIcon from '@mui/icons-material/Search';


const ProductReviews = () => {
  const dispatch = useDispatch();
  const [reviewId, setReviewId] = useState("")
  const [id, setId] = useState("")
  const { error, reviews, loading } = useSelector((state) => state.productReviews); 
  const { isDeleted ,deleteError } = useSelector((state) => state.deleteReviews); 
  
  const columns = [
    { field: "id", headerName: "Review ID", minWidth: 250, flex: 0.2, },
    { field: "name", headerName: "Name", minWidth: 200 , flex: 0.1,},
    { field: "email", headerName: "Email", minWidth: 250, flex: 0.4,},
    { field: "comment", headerName: "Comment", minWidth: 200 },
    { field: "rating", headerName: "Rating", type: "number", minWidth: 190 },
    {
      field: "actions",
      
      headerName: "Actions",
      type: "number",
      mixWidth: 200,
      flex:.3,
      sortable: false,
      renderCell: (params) => {
        function func(){
        setReviewId(params.row.id)
        handleClickOpen()
        }
        return (
          <Fragment>
            <Button onClick={func}>
              <DeleteIcon />
              Delete
            </Button>
           
          </Fragment>
          
        );
      },
    },
  ];
  const rows = [];
  reviews &&
    reviews.forEach((item) => {
      rows.push({
        id: item._id,
        name: item.name,
        email: item.email,
        comment: item.comment,
        rating: item.rating,
      });
    });

  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
 
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleAgree = () => {
    setOpen(false);
    dispatch(deleteReviews(id,reviewId));

  };
  const searchProductSubmitHandler =(e)=>{
e.preventDefault()
dispatch(getAllReviews(id));

  }

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

  useEffect(() => {
    let isCancelled = false;
  
    if (error || deleteError) {
      errorAlert(error || deleteError, isCancelled);
      return () => {
        isCancelled = true;
      };
    }
    if(isDeleted){
      toast.success("Review Deleted Successfully", {
        position: window.innerWidth < 600 ? "top-center" : "bottom-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      dispatch({type:DELETE_REVIEW_RESET})
    }
if(id){ dispatch(getAllReviews(id));}
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, dispatch,isDeleted,deleteError]);
  return (
    <Fragment>
      <MetaData title={`ADMIN - ALL REVIEWS`} />
      {loading ? (
        <Loader />
      ) : (
        <div className="dashboard">
          <Sidebar />
          <div className="productListContainer">
            <div className="mobileView">
            <form  className="productReviewForm"   onSubmit={searchProductSubmitHandler}>
                <div>
                    <SearchIcon/>
                    <input 
                    type="text"  
                    placeholder='Enter Product ID'
                    required
                    value={id}
                    id='name'
                    onChange={(e) => setId(e.target.value)}
                    />
                    
                </div>
               
                
                <Button
                 id='createProductBtn'
                 type="submit"
                >
                Search Reviews
                </Button>
               
            </form>
            </div>
         
            <h1 id="productListHeading">All Reviews</h1>
           {reviews && reviews.length > 0 ? <DataGrid
              rows={rows}
              columns={columns}
              disableRowSelectionOnClick
              className="productListTable"
              headerAlign="center"
              align="center"
              autoPageSize
            /> : <h1 className="productReviewsFormHeading">No Reviews Found</h1>}
          </div>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Delete Product?"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {`Are you sure, you want to Delete this Review ?`}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="secondary">Cancel</Button>
              <Button onClick={handleAgree} autoFocus>
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      )}
    </Fragment>
  );
};


export default ProductReviews