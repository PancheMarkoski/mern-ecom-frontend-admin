import React, { useEffect, useState, useMemo } from "react";
import { Table } from "antd";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  getCategories,
  deleteProductCategory,
} from "../features/pcategory/pcategorySlice";
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
    title: "Action",
    dataIndex: "action",
  },
];

const Categorylist = () => {
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [productCatId, setProductCatId] = useState("");
  const showModal = (productCatId) => {
    setOpen(true);
    setProductCatId(productCatId);
  };
  const hideModal = () => {
    setOpen(false);
  };

  useEffect(() => {
    dispatch(getCategories());
  }, []);

  const pCatState = useSelector((state) => state.pCategory.pCategories);

  const categoryData = useMemo(
    () =>
      pCatState.map((category, index) => ({
        key: category._id,
        id: index + 1,
        name: category.title,
        action: (
          <>
            <Link
              to={`/admin/category/${category._id}`}
              className="fs-3 text-danger"
            >
              <BiEdit />
            </Link>
            <button
              className="ms-3 fs-3 text-danger bg-transparent border-0"
              onClick={() => showModal(category._id)}
            >
              <AiFillDelete />
            </button>
          </>
        ),
      })),
    [pCatState]
  );

  const handleDeleteProductCat = (productCatId) => {
    dispatch(deleteProductCategory(productCatId));

    setOpen(false);
  };

  return (
    <div>
      <h3 className="mb-4 title">Product Categories</h3>
      <div>
        <Table columns={columns} dataSource={categoryData} />
      </div>
      <CustomModal
        hideModal={hideModal}
        open={open}
        performAction={() => handleDeleteProductCat(productCatId)}
        title="Are you sure you want to delete this brand?"
      />
    </div>
  );
};

export default Categorylist;
