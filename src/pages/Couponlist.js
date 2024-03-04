import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCoupons, deleteCoupon } from "../features/coupon/couponSlice";
import CustomModal from "../components/CustomModal";

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
    title: "Expiry",
    dataIndex: "expiry",
    sorter: (a, b) => a.name.length - b.name.length,
  },
  {
    title: "Action",
    dataIndex: "action",
  },
];

const Couponlist = () => {
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [couponId, setCouponId] = useState("");
  const showModal = (couponId) => {
    setOpen(true);
    setCouponId(couponId);
  };
  const hideModal = () => {
    setOpen(false);
  };

  useEffect(() => {
    dispatch(getCoupons());
  }, []);
  const { coupons } = useSelector((state) => state.coupons);

  const couponData = coupons.map((coupon, index) => ({
    key: coupon._id,
    id: index + 1,
    name: coupon.name,
    expiry: coupon.expiry,
    action: (
      <>
        <Link to={`/admin/coupon/${coupon._id}`} className="fs-3 text-danger">
          <BiEdit />
        </Link>
        <button
          className="ms-3 fs-3 text-danger bg-transparent border-0"
          onClick={() => showModal(coupon._id)}
        >
          {" "}
          <AiFillDelete />
        </button>
      </>
    ),
  }));

  const handleDeleteCoupon = (couponId) => {
    dispatch(deleteCoupon(couponId));

    setOpen(false);
  };

  return (
    <div>
      <h3 className="mb-4 title">Coupons</h3>
      <div>
        <Table columns={columns} dataSource={couponData} />
      </div>
      <CustomModal
        hideModal={hideModal}
        open={open}
        performAction={() => handleDeleteCoupon(couponId)}
        title="Are you sure you want to delete this coupon?"
      />
    </div>
  );
};

export default Couponlist;
