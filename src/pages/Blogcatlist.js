import React, { useEffect, useState, useMemo } from "react";
import { Table } from "antd";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  getCategories,
  deleteBlogCat,
} from "../features/bcategory/bcategorySlice";
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

const Blogcatlist = () => {
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [blogCatId, setBlogCatId] = useState("");
  const showModal = (blogCatId) => {
    setOpen(true);
    setBlogCatId(blogCatId);
  };
  const hideModal = () => {
    setOpen(false);
  };

  useEffect(() => {
    dispatch(getCategories());
  }, []);
  const bCatState = useSelector((state) => state.bCategory.bCategories);

  const blogCategoryData = bCatState.map((category, index) => ({
    key: category._id,
    id: index + 1,
    name: category.title,
    action: (
      <>
        <Link
          to={`/admin/blog-category/${category._id}`}
          className="fs-3 text-danger"
        >
          <BiEdit />
        </Link>
        <button
          className="ms-3 fs-3 text-danger bg-transparent border-0"
          onClick={() => showModal(category._id)}
        >
          {" "}
          <AiFillDelete />
        </button>
      </>
    ),
  }));

  const handleDeleteBlogCategory = (blogCatId) => {
    dispatch(deleteBlogCat(blogCatId));

    setOpen(false);
  };

  return (
    <div>
      <h3 className="mb-4 title">Blog Categories</h3>
      <div>
        <Table columns={columns} dataSource={blogCategoryData} />
      </div>
      <CustomModal
        hideModal={hideModal}
        open={open}
        performAction={() => handleDeleteBlogCategory(blogCatId)}
        title="Are you sure you want to delete this blog category?"
      />
    </div>
  );
};

export default Blogcatlist;
