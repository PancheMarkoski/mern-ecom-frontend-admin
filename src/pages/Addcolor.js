import React, { useEffect, useState } from "react";
import CustomInput from "../components/CustomInput";
import { useNavigate, useLocation } from "react-router-dom";
import * as yup from "yup";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  createColor,
  resetState,
  getColor,
  updateColor,
} from "../features/color/colorSlice";

let schema = yup.object().shape({
  title: yup.string().required("Color is Required"),
});

const Addcolor = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const getColorId = location.pathname.split("/")[3];

  const [initialValues, setInitialValues] = useState({ title: "" });

  useEffect(() => {
    if (getColorId) {
      dispatch(getColor(getColorId))
        .unwrap()
        .then((color) => {
          setInitialValues({ title: color.title });
        })
        .catch((error) => {
          toast.error("Could not fetch brand details");
        });
    } else {
      setInitialValues({ title: "" });
    }
  }, [getColorId, dispatch]);

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: schema,
    onSubmit: (values) => {
      const action = getColorId
        ? updateColor({ id: getColorId, ...values })
        : createColor(values);
      dispatch(action)
        .unwrap()
        .then(() => {
          // Handle success, e.g., show a success toast, navigate away, etc.
          toast.success(
            `Color ${getColorId ? "updated" : "added"} successfully`
          );
          navigate("/admin/list-color");
        })
        .catch((error) => {
          // Handle error, e.g., show an error toast
          toast.error("An error occurred");
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
      <h3 className="mb-4 title">{getColorId ? "Edit Color" : "Add Color"}</h3>
      <div>
        <form action="" onSubmit={formik.handleSubmit}>
          <CustomInput
            type="color"
            label="Enter Product Color"
            id="color"
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
            {getColorId ? "Edit Color" : "Add Color"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Addcolor;
