import React, { useEffect } from "react";
import { Table, Descriptions } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { Link, useLocation } from "react-router-dom";
import { getOrderByUser, getOrders } from "../features/auth/authSlice";

const columns = [
  {
    title: "SNo",
    dataIndex: "key",
  },
  {
    title: "Product Name",
    dataIndex: "name",
  },
  {
    title: "Brand",
    dataIndex: "brand",
  },
  {
    title: "Count",
    dataIndex: "count",
  },
  {
    title: "Color",
    dataIndex: "color",
  },
  {
    title: "Amount",
    dataIndex: "amount",
  },
  {
    title: "Date",
    dataIndex: "date",
  },
];

const ViewOrder = () => {
  const location = useLocation();
  const userId = location.pathname.split("/")[3];
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getOrderByUser(userId));
  }, []);
  const order = useSelector((state) => state.auth.orderbyuser);

  const orderData = order?.products?.map((product, index) => ({
    key: product._id,
    id: index + 1,
    name: product.product.title,
    brand: product.product.brand,
    count: product.count,
    color: product.color,
    amount: `$${product.product.price.toFixed(2)}`,
    date: new Date(order.createdAt).toLocaleDateString(),
  }));

  return (
    <div>
      <h3 className="mb-4 title">View {order?.orderby?.firstname} Order</h3>
      <h3 className="mb-4 title">Order Details</h3>
      <Descriptions bordered>
        <Descriptions.Item label="Order ID">{order?._id}</Descriptions.Item>
        <Descriptions.Item label="Order Status">
          {order?.orderStatus}
        </Descriptions.Item>
        <Descriptions.Item label="Currency">
          {order?.paymentIntent?.currency}
        </Descriptions.Item>
        <Descriptions.Item label="Total Amount">
          ${order?.paymentIntent?.amount?.toFixed(2)}
        </Descriptions.Item>
        <Descriptions.Item label="Order Date">
          {new Date(order?.createdAt).toLocaleDateString()}
        </Descriptions.Item>
      </Descriptions>
      <h3 className="mt-4 mb-4 title">Product Details</h3>
      <Table columns={columns} dataSource={orderData} />
    </div>
  );
};

export default ViewOrder;
