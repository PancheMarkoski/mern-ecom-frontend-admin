import React, { useEffect, useMemo } from "react";
import { Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { Link } from "react-router-dom";
import { getOrders, updateOrder } from "../features/auth/authSlice";

const columns = [
  {
    title: "SNo",
    dataIndex: "id",
  },
  {
    title: "Name",
    dataIndex: "name",
  },
  {
    title: "Product",
    dataIndex: "product",
  },
  {
    title: "Amount",
    dataIndex: "amount",
  },
  {
    title: "Date",
    dataIndex: "date",
  },

  {
    title: "Status",
    dataIndex: "status",
  },
];

const Orders = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  const handleStatusChange = (status, orderId) => {
    const data = { orderId, status };

    dispatch(updateOrder(data));
  };

  const orderState = useSelector((state) => state?.auth?.orders?.orders || []);

  console.log("orderState", orderState);

  const ordersData = useMemo(() => {
    return orderState.length > 0
      ? orderState.map((order, i) => ({
          key: order?._id,
          id: i + 1,
          name: order?.user?.firstname,
          product: <Link to={`/admin/orders/${order?._id}`}>View Orders</Link>,
          amount: order?.totalPrice,
          date: new Date(order?.createdAt).toLocaleString(),
          status: (
            <select
              onChange={(e) => handleStatusChange(e.target.value, order._id)}
              value={order?.orderStatus}
              className="form-control form-select"
            >
              <option value="Not Processed">Not Processed</option>
              <option value="Cash on Delivery">Cash on Delivery</option>
              <option value="Dispatched">Dispatched</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Delivered">Delivered</option>
            </select>
          ),
        }))
      : [];
  }, [orderState]);

  return (
    <div>
      <h3 className="mb-4 title">Orders</h3>
      <div>{<Table columns={columns} dataSource={ordersData} />}</div>
    </div>
  );
};

export default Orders;
