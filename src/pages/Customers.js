import React, { useEffect, useMemo } from "react";
import { Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../features/cutomers/customerSlice";
const columns = [
  {
    title: "SNo",
    dataIndex: "id",
  },
  {
    title: "Name",
    dataIndex: "name",
    sorter: (a, b) => a.name.length - b.name.length,
  },
  {
    title: "Email",
    dataIndex: "email",
  },
  {
    title: "Mobile",
    dataIndex: "mobile",
  },
];

const Customers = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUsers());
  }, []);

  const customerstate = useSelector((state) => state.customers.customers);
  const customerData = useMemo(() => {
    return customerstate.reduce((acc, customer, index) => {
      if (customer.role !== "admin") {
        acc.push({
          key: customer._id,
          id: index + 1,
          name: `${customer.firstname} ${customer.lastname}`,
          email: customer.email,
          mobile: customer.mobile,
        });
      }
      return acc;
    }, []);
  }, [customerstate]);

  return (
    <div>
      <h3 className="mb-4 title">Customers</h3>
      <div>
        <Table columns={columns} dataSource={customerData} />
      </div>
    </div>
  );
};

export default Customers;
