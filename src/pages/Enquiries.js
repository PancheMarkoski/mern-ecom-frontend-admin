import React, { useEffect, useState, useMemo } from "react";
import { Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  getEnquiries,
  updateEnquiry,
  deleteEnquiry,
} from "../features/enquiry/enquirySlice";
import { AiFillDelete, AiOutlineEye } from "react-icons/ai";
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
    title: "Email",
    dataIndex: "email",
  },
  {
    title: "Mobile",
    dataIndex: "mobile",
  },
  {
    title: "Staus",
    dataIndex: "status",
  },

  {
    title: "Action",
    dataIndex: "action",
  },
];

const Enquiries = () => {
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [enqId, setEnqId] = useState("");
  const showModal = (enqId) => {
    setOpen(true);
    setEnqId(enqId);
  };
  const hideModal = () => {
    setOpen(false);
  };

  useEffect(() => {
    dispatch(getEnquiries());
  }, []);

  const handleStatusChange = (status, enquieryId) => {
    const data = { enquieryId, status };

    dispatch(updateEnquiry(data));
  };

  const enqState = useSelector((state) => state.enquiries.enquiries);

  const enquiriesData = useMemo(
    () =>
      enqState.map((enquiery, i) => ({
        key: enquiery._id,
        id: i + 1,
        name: enquiery.name,
        email: enquiery.email,
        mobile: enquiery.mobile,
        status: (
          <>
            <select
              name=""
              onChange={(e) => handleStatusChange(e.target.value, enquiery._id)}
              value={enquiery.status}
              className="form-control form-select"
              id=""
            >
              <option value="Submitted">Submitted</option>
              <option value="Contacted">Contacted</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </>
        ),
        action: (
          <>
            <Link
              className="ms-3 fs-3 text-danger"
              to={`/admin/enquiries/${enquiery._id}`}
            >
              <AiOutlineEye />
            </Link>
            <button
              className="ms-3 fs-3 text-danger bg-transparent border-0"
              onClick={() => showModal(enquiery._id)}
            >
              <AiFillDelete />
            </button>
          </>
        ),
      })),
    [enqState]
  );

  const handleDeleteEnq = (enqId) => {
    dispatch(deleteEnquiry(enqId));

    setOpen(false);
  };

  return (
    <div>
      <h3 className="mb-4 title">Enquiries</h3>
      <div>
        <Table columns={columns} dataSource={enquiriesData} />
      </div>
      <CustomModal
        hideModal={hideModal}
        open={open}
        performAction={() => handleDeleteEnq(enqId)}
        title="Are you sure you want to delete this enquiery?"
      />
    </div>
  );
};

export default Enquiries;
