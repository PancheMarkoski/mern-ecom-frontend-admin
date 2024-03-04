import React, { useEffect, useMemo, useState } from "react";
import { Table } from "antd";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { getProducts, deleteProduct } from "../features/products/productSlice";
import { Link } from "react-router-dom";
import CustomModal from "../components/CustomModal";
const columns = [
  {
    title: "SNo",
    dataIndex: "id",
  },
  {
    title: "Title",
    dataIndex: "title",
    sorter: (a, b) => a.title.length - b.title.length,
  },
  {
    title: "Brand",
    dataIndex: "brand",
    sorter: (a, b) => a.brand.length - b.brand.length,
  },
  {
    title: "Category",
    dataIndex: "category",
    sorter: (a, b) => a.category.length - b.category.length,
  },
  {
    title: "Color",
    dataIndex: "color",
  },
  {
    title: "Price",
    dataIndex: "price",
    sorter: (a, b) => a.price - b.price,
  },
  {
    title: "Action",
    dataIndex: "action",
  },
];

const Productlist = () => {
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [productId, setProductId] = useState("");
  const showModal = (productId) => {
    setOpen(true);
    setProductId(productId);
  };
  const hideModal = () => {
    setOpen(false);
  };

  useEffect(() => {
    dispatch(getProducts());
  }, []);
  const productState = useSelector((state) => state.products.products);

  const productTableData = useMemo(
    () =>
      productState.map((product, index) => ({
        key: product._id,
        id: index + 1,
        title: product.title,
        brand: product.brand,
        category: product.category,
        color: product.color,
        price: `${product.price}`,
        action: (
          <>
            <Link
              to={`/admin/product/${product._id}`}
              className="fs-3 text-danger"
            >
              <BiEdit />
            </Link>
            <button
              className="ms-3 fs-3 text-danger bg-transparent border-0"
              onClick={() => showModal(product._id)}
            >
              <AiFillDelete />
            </button>
          </>
        ),
      })),
    [productState]
  );

  const handleDeleteProduct = (productId) => {
    dispatch(deleteProduct(productId));

    setOpen(false);
  };

  return (
    <div>
      <h3 className="mb-4 title">Products</h3>
      <div>
        <Table columns={columns} dataSource={productTableData} />
      </div>
      <CustomModal
        hideModal={hideModal}
        open={open}
        performAction={() => handleDeleteProduct(productId)}
        title="Are you sure you want to delete this product?"
      />
    </div>
  );
};

export default Productlist;
