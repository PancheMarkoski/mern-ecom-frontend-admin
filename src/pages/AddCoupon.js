import { React, useEffect, useState } from "react";
import CustomInput from "../components/CustomInput";
import { useNavigate, useLocation } from "react-router-dom";
import * as yup from "yup";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  createCoupon,
  resetState,
  updateCoupon,
  getCoupon,
} from "../features/coupon/couponSlice";

let schema = yup.object().shape({
  name: yup.string().required("Title is Required"),
  expiry: yup.date().required("Expiry Date is Required"),
  discount: yup.number().required("Discount Percentage is Required"),
});

const AddCoupon = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const getCouponId = location.pathname.split("/")[3];

  const [initialValues, setInitialValues] = useState({
    name: "",
    expiry: "",
    discount: "",
  });

  useEffect(() => {
    if (getCouponId) {
      dispatch(getCoupon(getCouponId))
        .unwrap()
        .then((coupon) => {
          // Format the expiry date to YYYY-MM-DD
          const formattedExpiryDate = new Date(coupon.expiry)
            .toISOString()
            .split("T")[0];
          setInitialValues({
            name: coupon.name,
            expiry: formattedExpiryDate,
            discount: coupon.discount,
          });
        })
        .catch((error) => {
          toast.error("Could not fetch coupon details");
        });
    } else {
      setInitialValues({ name: "", expiry: "", discount: "" });
    }
  }, [getCouponId, dispatch]);

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: schema,
    onSubmit: (values) => {
      const action = getCouponId
        ? updateCoupon({ id: getCouponId, ...values })
        : createCoupon(values);
      dispatch(action)
        .unwrap()
        .then(() => {
          // Handle success, e.g., show a success toast, navigate away, etc.
          toast.success(
            `Coupon ${getCouponId ? "updated" : "added"} successfully`
          );
          navigate("/admin/coupon-list");
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
      <h3 className="mb-4 title">
        {getCouponId ? "Edit Coupon" : "Add Coupon"}
      </h3>
      <div>
        <form action="" onSubmit={formik.handleSubmit}>
          <CustomInput
            type="text"
            name="name"
            onChng={formik.handleChange("name")}
            onBlr={formik.handleBlur("name")}
            val={formik.values.name}
            label="Enter Coupon Name"
            id="name"
          />
          <div className="error">
            {formik.touched.name && formik.errors.name}
          </div>
          <CustomInput
            type="date"
            name="expiry"
            onChng={formik.handleChange("expiry")}
            onBlr={formik.handleBlur("expiry")}
            val={formik.values.expiry}
            label="Enter Expiry Data"
            id="date"
          />
          <div className="error">
            {formik.touched.expiry && formik.errors.expiry}
          </div>
          <CustomInput
            type="number"
            name="discount"
            onChng={formik.handleChange("discount")}
            onBlr={formik.handleBlur("discount")}
            val={formik.values.discount}
            label="Enter Discount"
            id="discount"
          />
          <div className="error">
            {formik.touched.discount && formik.errors.discount}
          </div>
          <button
            className="btn btn-success border-0 rounded-3 my-5"
            type="submit"
          >
            {getCouponId ? "Edit Coupon" : "Add Coupon"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCoupon;
