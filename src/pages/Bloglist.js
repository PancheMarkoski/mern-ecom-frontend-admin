import React, { useEffect, useState, useMemo } from "react";
import { Table } from "antd";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getBlogs, deleteBlog } from "../features/blogs/blogSlice";
import CustomModal from "../components/CustomModal";

const columns = [
  {
    title: "SNo",
    dataIndex: "id",
  },
  {
    title: "Title",
    dataIndex: "name",
  },
  {
    title: "Category",
    dataIndex: "category",
  },
  {
    title: "Action",
    dataIndex: "action",
  },
];

const Bloglist = () => {
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [blogId, setBlogId] = useState("");
  const showModal = (blogId) => {
    setOpen(true);
    setBlogId(blogId);
  };
  const hideModal = () => {
    setOpen(false);
  };

  useEffect(() => {
    dispatch(getBlogs());
  }, []);

  const getBlogState = useSelector((state) => state.blogs.blogs);

  const blogData = useMemo(
    () =>
      getBlogState.map((blog, index) => ({
        key: blog._id,
        id: index + 1,
        category: blog.category,
        name: blog.title,
        action: (
          <>
            <Link to={`/admin/blog/${blog._id}`} className="fs-3 text-danger">
              <BiEdit />
            </Link>
            <button
              className="ms-3 fs-3 text-danger bg-transparent border-0"
              onClick={() => showModal(blog._id)}
            >
              <AiFillDelete />
            </button>
          </>
        ),
      })),
    [getBlogState]
  );

  const handleDeleteBlog = (blogId) => {
    dispatch(deleteBlog(blogId));

    setOpen(false);
  };

  return (
    <div>
      <h3 className="mb-4 title">Blogs List</h3>
      <div>
        <Table columns={columns} dataSource={blogData} />
      </div>
      <CustomModal
        hideModal={hideModal}
        open={open}
        performAction={() => handleDeleteBlog(blogId)}
        title="Are you sure you want to delete this blog?"
      />
    </div>
  );
};

export default Bloglist;
