import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getEnquiry, updateEnquiry } from "../features/enquiry/enquirySlice";
import { BiArrowBack } from "react-icons/bi";

const ViewEnq = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const getEnqId = location.pathname.split("/")[3];
  const { enquiry } = useSelector((state) => state.enquiries);

  useEffect(() => {
    dispatch(getEnquiry(getEnqId));
  }, [getEnqId]);

  const goBack = () => {
    navigate(-1);
  };
  const handleStatusChange = (status, enquieryId) => {
    const data = { enquieryId, status };

    dispatch(updateEnquiry(data));
  };

  return (
    <>
      <div>
        <div className="d-flex justify-content-between align-items-center">
          <h3 className="mb-4 title">View Enquiry</h3>
          <button
            className="bg-transpatent border-0 fs-6 mb-0 d-flex align-items-center gap-1"
            onClick={goBack}
          >
            <BiArrowBack className="fs-5" /> Go Back
          </button>
        </div>
        <div className="mt-5 bg-white p-4 d-flex gap-3 flex-column rounded-3">
          <div className="d-flex align-items-center gap-3">
            <h6 className="mb-0">Name:</h6>
            <p className="mb-0">{enquiry?.name}</p>
          </div>
          <div className="d-flex align-items-center gap-3">
            <h6 className="mb-0">Mobile:</h6>
            <p className="mb-0">
              <a href={`tel:+91123123123`}>{enquiry?.mobile}</a>
            </p>
          </div>
          <div className="d-flex align-items-center gap-3">
            <h6 className="mb-0">Email:</h6>
            <p className="mb-0">
              <a href={`mailto${enquiry?.email}`}>{enquiry?.email}</a>
            </p>
          </div>
          <div className="d-flex align-items-center gap-3">
            <h6 className="mb-0">Comment:</h6>
            <p className="mb-0">{enquiry?.comment}</p>
          </div>
          <div className="d-flex align-items-center gap-3">
            <h6 className="mb-0">Status:</h6>
            <p className="mb-0">{enquiry?.status}</p>
          </div>
          <div className="d-flex align-items-center gap-3">
            <h6 className="mb-0">Change Status:</h6>
            <div>
              <select
                name=""
                value={enquiry?.status}
                className="form-control form-select"
                id=""
                onChange={(e) =>
                  handleStatusChange(e.target.value, enquiry._id)
                }
              >
                <option value="Submitted">Submitted</option>
                <option value="Contacted">Contacted</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewEnq;
