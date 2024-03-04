import React, { useEffect, useState, useMemo } from "react";
import { Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteAColor,
  deleteColor,
  getColors,
} from "../features/color/colorSlice";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { Link } from "react-router-dom";
import CustomModal from "../components/CustomModal";

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
    title: "Action",
    dataIndex: "action",
  },
];

const Colorlist = () => {
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [colorId, setColorId] = useState("");
  const showModal = (colorId) => {
    setOpen(true);
    setColorId(colorId);
  };
  const hideModal = () => {
    setOpen(false);
  };

  useEffect(() => {
    dispatch(getColors());
  }, []);
  const colorState = useSelector((state) => state.colors.colors);

  const colorData = useMemo(
    () =>
      colorState.map((color, i) => ({
        key: color._id,
        id: i + 1,
        name: color.title,
        action: (
          <>
            <Link
              to={`/admin/color/${color._id}`}
              className=" fs-3 text-danger"
            >
              <BiEdit />
            </Link>
            <button
              className="ms-3 fs-3 text-danger bg-transparent border-0"
              onClick={() => showModal(color._id)}
            >
              <AiFillDelete />
            </button>
          </>
        ),
      })),
    [colorState]
  );

  const handleDeleteColor = (colorId) => {
    dispatch(deleteColor(colorId));

    setOpen(false);
  };

  return (
    <div>
      <h3 className="mb-4 title">Colors</h3>
      <div>
        <Table columns={columns} dataSource={colorData} />
      </div>
      <CustomModal
        hideModal={hideModal}
        open={open}
        performAction={() => handleDeleteColor(colorId)}
        title="Are you sure you want to delete this color?"
      />
    </div>
  );
};

export default Colorlist;
