import React, { useEffect, useState } from "react";
import "./ProductList.css";
import { DataGrid } from "@mui/x-data-grid";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import MetaData from "../layout/MetaData";
import Sidebar from "./Sidebar";
import EditIcon from "@mui/icons-material/Edit";
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
import { deleteUser, getAllUsers } from "../../actions/userAction";
import { DELETE_USER_RESET } from "../../constants/userConstants";


const Users = () => {
  const dispatch = useDispatch();
  const [name, setName] = useState("")
  const [id, setId] = useState("")
  const { Error, users,loading } = useSelector((state) => state.allUsers); 
  const { isDeleted ,message ,error} = useSelector((state) => state.profile); 
  
  const columns = [
    { field: "id", headerName: "User ID", minWidth: 250, flex: 0.5 },
    { field: "email", headerName: "Email", minWidth: 350 },
    { field: "name", headerName: "Name", minWidth: 250 },
    { field: "role", headerName: "Role", minWidth: 200 },
    {
      field: "actions",
      headerName: "Actions",
      type: "number",
      minWidth: 250,
      sortable: false,
      
      renderCell: (params) => {
        function func(){
          setId(params.row.id)
        setName(params.row.name)
        handleClickOpen()
        }
        return (
          <Fragment>
            <Link to={`/admin/user/${params.row.id}`}>
              <EditIcon />
              Edit
            </Link>
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
  users &&
  users.forEach((item) => {
      rows.push({
        id: item._id,
        name: item.name,
        email: item.email,
        role: item.role,
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
    dispatch(deleteUser(id));
    setOpen(false);
  };

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

    if (error || Error) {
      errorAlert(error || Error, isCancelled);
      return () => {
        isCancelled = true;
      };
    }
    if(isDeleted){
      toast.success(message, {
        position: window.innerWidth < 600 ? "top-center" : "bottom-center",
        autoClose: 1500,
        hideProgressBar: isCancelled,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      dispatch({type:DELETE_USER_RESET})
    }
    dispatch(getAllUsers());
  }, [error, dispatch,isDeleted,Error,message]);
  return (
    <Fragment>
      <MetaData title={`ADMIN - ALL PRODUCTS`} />
      {loading ? (
        <Loader />
      ) : (
        <div className="dashboard">
          <Sidebar />
          <div className="productListContainer">
            <h1 id="productListHeading">All Users</h1>
            <DataGrid
              rows={rows}
              columns={columns}
              disableRowSelectionOnClick
              className="productListTable"
              headerAlign="center"
              align="center"
              autoPageSize
            />
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
                {`Are you sure, you want to Delete ${name} ?`}
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



export default Users