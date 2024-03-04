import React, { useEffect, useMemo, useState } from "react";
import { Table } from "antd";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getBrands, deleteBrand } from "../features/brand/brandSlice";
import CustomModal from "../components/CustomModal";

const columns = [
  {
    title: "SNo",
    dataIndex: "id",
  },
  {
    title: "Name",
    dataIndex: "name",
    sorter: (a, b) => a.name.localeCompare(b.name),
  },
  {
    title: "Action",
    dataIndex: "action",
  },
];

const Brandlist = () => {
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [brandId, setBrandId] = useState("");
  const showModal = (brandId) => {
    setOpen(true);
    setBrandId(brandId);
  };
  const hideModal = () => {
    setOpen(false);
  };

  useEffect(() => {
    dispatch(getBrands());
  }, []);

  const brandState = useSelector((state) => state.brands.brands);

  const brandData = useMemo(
    () =>
      brandState.map((brand, i) => ({
        key: brand._id,
        id: i + 1,
        name: brand.title,
        action: (
          <>
            <Link
              to={`/admin/brand/${brand._id}`}
              className=" fs-3 text-danger"
            >
              <BiEdit />
            </Link>
            <button
              className="ms-3 fs-3 text-danger bg-transparent border-0"
              onClick={() => showModal(brand._id)}
            >
              <AiFillDelete />
            </button>
          </>
        ),
      })),
    [brandState]
  );

  const handleDeleteBrand = (brandId) => {
    dispatch(deleteBrand(brandId));

    setOpen(false);
  };

  return (
    <div>
      <h3 className="mb-4 title">Brands</h3>
      <div>
        <Table columns={columns} dataSource={brandData} />
      </div>
      <CustomModal
        hideModal={hideModal}
        open={open}
        performAction={() => handleDeleteBrand(brandId)}
        title="Are you sure you want to delete this brand?"
      />
    </div>
  );
};

export default Brandlist;
