import React, { Fragment, useEffect } from 'react'
import LaunchIcon from '@mui/icons-material/Launch';
import { DataGrid } from '@mui/x-data-grid';
import {useSelector,useDispatch} from "react-redux"
import {myOrders} from "../../actions/orderAction" 
import Loader from "../layout/Loader/Loader"
import {Link} from "react-router-dom"
import { Typography } from '@mui/material';
import MetaData from "../layout/MetaData"
import "./MyOrders.css"
import {  toast } from 'react-toastify';



const MyOrders = () => {

  const dispatch =useDispatch()
  const {loading,error,orders} = useSelector(state => state.myOrders)
  const {user} = useSelector(state => state.user)

  const columns = [
    {field: "id", headerName: "Order Id",minWidth:300,flex:1},
    {field: "status", headerName: "Status",minWidth:150,flex:.5,},
    {field: "itemsQty", headerName: "Items Qty",type:"number",minWidth:150,flex:.5},
    {field: "amount", headerName: "Amount(Rs)",type:"number",minWidth:270,flex:.5},
    {field: "actions", headerName: "Actions",type:"number",minWidth:150,flex:.3,sortable:false,
       renderCell:(params)=>{
        return (
          <Link to={`/order/${params.row.id}`}><LaunchIcon/></Link>
        )
       }  
  },
  ]
  const rows = []
  orders && orders.forEach((element,index) => {
    rows.push({
      id:element._id,
      status:element.orderStatus,
      itemsQty: element.orderItems.reduce(
        (accumulator,item)=> accumulator + item.quantity ,0
    ),
      amount:element.totalPrice
    })
  });

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

    if(error){
      errorAlert(error,isCancelled)
       return ()=>{isCancelled = true}
    }
    dispatch(myOrders())
  }, [error,dispatch])
  

  return (
   <Fragment>
    <MetaData title={`${user.name}`} />
    {loading ? <Loader/> :
    <div className="myOrdersPage">
      <DataGrid  
      rows={rows}
      columns={columns}
      disableRowSelectionOnClick
      className='myOrdersTable'
      headerAlign="center"
      align="center"
      autoPageSize
      />

      <Typography id="myOrdersHeading">{user.name}'s Orders</Typography>
    </div>
      }
   </Fragment>
  )
}

export default MyOrders