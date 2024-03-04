import React, { useEffect, useState } from "react";
import CustomInput from "../components/CustomInput";
import { useLocation, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import {
  createBrand,
  resetState,
  getBrand,
  updateBrand,
} from "../features/brand/brandSlice";
import { toast } from "react-toastify";

let schema = yup.object().shape({
  title: yup.string().required("Title is Required"),
});

const Addbrand = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const getBrandId = location.pathname.split("/")[3];

  const [initialValues, setInitialValues] = useState({ title: "" });

  useEffect(() => {
    if (getBrandId) {
      dispatch(getBrand(getBrandId))
        .unwrap()
        .then((brand) => {
          setInitialValues({ title: brand.title }); // Set the fetched brand title as initial form values
        })
        .catch((error) => {
          toast.error("Could not fetch brand details");
        });
    } else {
      setInitialValues({ title: "" });
    }
  }, [getBrandId, dispatch]);

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: schema,
    onSubmit: (values) => {
      const action = getBrandId
        ? updateBrand({ id: getBrandId, ...values })
        : createBrand(values);
      dispatch(action)
        .unwrap()
        .then(() => {
          // Handle success, e.g., show a success toast, navigate away, etc.
          toast.success(
            `Brand ${getBrandId ? "updated" : "added"} successfully`
          );
          navigate("/admin/list-brand");
        })
        .catch((error) => {
          // Handle error, e.g., show an error toast
          toast.error(
            `An error occurred during ${getBrandId ? "update" : "creation"}`
          );
        })
        .finally(() => {
          // Reset the product state after the product creation attempt
          dispatch(resetState());
          // Reset Formik form if staying on the same page
          formik.resetForm();
        });
    },
  });

  return (
    <div>
      <h3 className="mb-4  title">{getBrandId ? "Edit Brand" : "Add Brand"}</h3>
      <div>
        <form action="" onSubmit={formik.handleSubmit}>
          <CustomInput
            type="text"
            label="Enter Product Brand"
            id="brand"
            onChng={formik.handleChange("title")}
            onBlr={formik.handleBlur("title")}
            val={formik.values.title}
          />
          <div className="error">
            {formik.touched.title && formik.errors.title}
          </div>
          <button
            className="btn btn-success border-0 rounded-3 my-5"
            type="submit"
          >
            {getBrandId ? "Edit Brand" : "Add Brand"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Addbrand;
