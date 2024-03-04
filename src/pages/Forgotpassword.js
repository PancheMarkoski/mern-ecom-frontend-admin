import React, { useState } from "react";
import CustomInput from "../components/CustomInput";
import * as yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { forgotPasswordEmailSend } from "../features/auth/authSlice";
import { useDispatch } from "react-redux";

let schema = yup.object().shape({
  email: yup.string().required("Email is Required"),
});

const Forgotpassword = () => {
  const dispatch = useDispatch();
  const [initialValues, setInitialValues] = useState({
    email: "",
  });

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: schema,
    onSubmit: (values) => {
      dispatch(forgotPasswordEmailSend(values));
      toast.success(
        "Check your inbox! We've just emailed you instructions to reset your password."
      );
      formik.resetForm();
    },
  });

  return (
    <div
      className="py-5"
      style={{
        background: "#ffd333",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="my-5 w-25 bg-white rounded-3 mx-auto p-4">
        <h3 className="text-center title">Forgot Password</h3>
        <p className="text-center">
          Please Enter your register email to get reset password mail.
        </p>
        <form action="" onSubmit={formik.handleSubmit}>
          <div className="error">
            {formik.touched.email && formik.errors.email}
          </div>
          <CustomInput
            type="email"
            label="Email Address"
            id="email"
            name="email"
            onChng={formik.handleChange("email")}
            onBlr={formik.handleBlur("email")}
            val={formik.values.email}
          />

          <button
            className="border-0 px-3 py-2 mt-5 text-white fw-bold w-100"
            style={{ background: "#ffd333" }}
            type="submit"
          >
            Send Link
          </button>
        </form>
      </div>
    </div>
  );
};

export default Forgotpassword;
