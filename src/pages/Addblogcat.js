import React, { useEffect, useState } from "react";
import CustomInput from "../components/CustomInput";
import { useNavigate, useLocation } from "react-router-dom";
import * as yup from "yup";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  createBlogCat,
  resetState,
  getBlogCat,
  updateBlogCat,
} from "../features/bcategory/bcategorySlice";

let schema = yup.object().shape({
  title: yup.string().required("Blog category is Required"),
});

const Addblogcat = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const getBlogCatId = location.pathname.split("/")[3];

  const [initialValues, setInitialValues] = useState({ title: "" });

  useEffect(() => {
    if (getBlogCatId) {
      dispatch(getBlogCat(getBlogCatId))
        .unwrap()
        .then((blogCat) => {
          setInitialValues({ title: blogCat.title });
        })
        .catch((error) => {
          toast.error("Could not fetch blogCat details");
        });
    } else {
      setInitialValues({ title: "" });
    }
  }, [getBlogCatId, dispatch]);

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: schema,
    onSubmit: (values) => {
      const action = getBlogCatId
        ? updateBlogCat({ id: getBlogCatId, ...values })
        : createBlogCat(values);
      dispatch(action)
        .unwrap()
        .then(() => {
          // Handle success, e.g., show a success toast, navigate away, etc.
          toast.success(
            `Blog category ${getBlogCat ? "updated" : "added"} successfully`
          );
          navigate("/admin/blog-category-list");
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
      <h3 className="mb-4  title">
        {getBlogCatId ? "Edit Blog Category" : "Add Blog Category"}
      </h3>
      <div>
        <form action="" onSubmit={formik.handleSubmit}>
          <CustomInput
            type="text"
            name="title"
            label="Enter Blog Category"
            id="blogcat"
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
            {getBlogCatId ? "Edit Blog Category" : "Add Blog Category"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Addblogcat;
