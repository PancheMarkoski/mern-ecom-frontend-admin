import React, { useEffect, useState } from "react";
import CustomInput from "../components/CustomInput";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useLocation } from "react-router-dom";
import * as yup from "yup";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { getBrands } from "../features/brand/brandSlice";
import { getCategories } from "../features/pcategory/pcategorySlice";
import { getColors } from "../features/color/colorSlice";
import { Select } from "antd";
import ImageUpload from "../components/ImageUpload";
import { delImg, uploadImg } from "../features/upload/uploadSlice";
import {
  createProducts,
  resetState,
  getProduct,
  updateProduct,
} from "../features/products/productSlice";
import { toast } from "react-toastify";

let schema = yup.object().shape({
  title: yup.string().required("Title is Required"),
  description: yup.string().required("Description is Required"),
  price: yup.number().required("Price is Required"),
  brand: yup.string().required("Brand is Required"),
  category: yup.string().required("Category is Required"),
  tags: yup.string().required("Tag is Required"),
  color: yup
    .array()
    .min(1, "Pick at least one color")
    .required("Color is Required"),
  quantity: yup.number().required("Quantity is Required"),
  images: yup
    .array()
    .of(
      yup.object().shape({
        public_id: yup.string().required("Image ID is required"),
        url: yup.string().required("Image URL is required"),
      })
    )
    .min(1, "At least one image is required"),
});

const Addproduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const getProductId = location.pathname.split("/")[3];

  const [initialValues, setInitialValues] = useState({
    title: "",
    description: "",
    price: "",
    brand: "",
    category: "",
    tags: "",
    color: "",
    quantity: "",
    images: [],
  });

  useEffect(() => {
    dispatch(getBrands());
    dispatch(getCategories());
    dispatch(getColors());
    if (getProductId) {
      dispatch(getProduct(getProductId))
        .unwrap()
        .then((product) => {
          formik.setValues({
            title: product.title,
            description: product.description,
            price: product.price,
            brand: product.brand,
            category: product.category,
            tags: product.tags,
            color: product.color,
            quantity: product.quantity,
            images: product.images,
          });
        })
        .catch((error) => {
          toast.error("Could not fetch blog details");
        });
    }
  }, [getProductId]);

  const brandState = useSelector((state) => state.brands.brands);
  const catState = useSelector((state) => state.pCategory.pCategories);
  const colorState = useSelector((state) => state.colors.colors);

  const coloropt = colorState.map((color) => ({
    label: color.title,
    value: color._id,
  }));

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: schema,
    onSubmit: (values) => {
      const action = getProductId
        ? updateProduct({ id: getProductId, ...values })
        : createProducts(values);

      dispatch(action)
        .unwrap()
        .then(() => {
          // Handle success, e.g., show a success toast, navigate away, etc.
          toast.success(
            `Product ${getProductId ? "updated" : "added"} successfully`
          );
          navigate("/admin/list-product");
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

  const onDrop = (acceptedFiles) => {
    // Directly dispatching acceptedFiles to the Redux action
    dispatch(uploadImg(acceptedFiles))
      .then((actionResponse) => {
        // Assuming each file's data is returned in the actionResponse.payload
        if (actionResponse.payload && actionResponse.payload.length > 0) {
          // Process each file data and update Formik's images field
          const updatedImages = actionResponse.payload.map((fileData) => ({
            public_id: fileData.public_id,
            url: fileData.url,
            asset_id: fileData.asset_id,
          }));

          // Update Formik's 'images' field with the new images array
          formik.setFieldValue("images", [
            ...formik.values.images,
            ...updatedImages,
          ]);
        } else {
          console.error("No file data in payload", actionResponse.payload);
        }
      })
      .catch((error) => {
        console.error("Error uploading files:", error);
      });
  };

  const handleRemoveImage = (publicId) => {
    dispatch(delImg(publicId)).then(() => {
      const filteredImages = formik.values.images.filter(
        (image) => image.public_id !== publicId
      );
      formik.setFieldValue("images", filteredImages);
    });
  };

  return (
    <div>
      <h3 className="mb-4 title">
        {getProductId ? "Edit Product" : "Add Product"}
      </h3>
      <div>
        <form
          onSubmit={formik.handleSubmit}
          className="d-flex gap-3 flex-column"
        >
          <CustomInput
            type="text"
            label="Enter Product Title"
            name="title"
            onChng={formik.handleChange("title")}
            onBlr={formik.handleBlur("title")}
            val={formik.values.title}
          />
          <div className="error">
            {formik.touched.title && formik.errors.title}
          </div>
          <div className="">
            <ReactQuill
              theme="snow"
              name="description"
              onChange={formik.handleChange("description")}
              value={formik.values.description}
            />
          </div>
          <div className="error">
            {formik.touched.description && formik.errors.description}
          </div>
          <CustomInput
            type="number"
            label="Enter Product Price"
            name="price"
            onChng={formik.handleChange("price")}
            onBlr={formik.handleBlur("price")}
            val={formik.values.price}
          />
          <div className="error">
            {formik.touched.price && formik.errors.price}
          </div>
          <select
            name="brand"
            onChange={formik.handleChange("brand")}
            onBlur={formik.handleBlur("brand")}
            value={formik.values.brand}
            className="form-control py-3 mb-3"
            id=""
          >
            <option value="">Select Brand</option>
            {brandState.map((brand) => {
              return (
                <option key={brand._id} value={brand.title}>
                  {brand.title}
                </option>
              );
            })}
          </select>
          <div className="error">
            {formik.touched.brand && formik.errors.brand}
          </div>
          <select
            name="category"
            onChange={formik.handleChange("category")}
            onBlur={formik.handleBlur("category")}
            value={formik.values.category}
            className="form-control py-3 mb-3"
            id=""
          >
            <option value="">Select Category</option>
            {catState.map((cat) => {
              return (
                <option key={cat._id} value={cat.title}>
                  {cat.title}
                </option>
              );
            })}
          </select>
          <div className="error">
            {formik.touched.category && formik.errors.category}
          </div>
          <select
            name="tags"
            onChange={formik.handleChange("tags")}
            onBlur={formik.handleBlur("tags")}
            value={formik.values.tags}
            className="form-control py-3 mb-3"
            id=""
          >
            <option value="" disabled>
              Select Tags
            </option>
            <option value="featured">Featured</option>
            <option value="popular">Popular</option>
            <option value="special">Special</option>
          </select>
          <div className="error">
            {formik.touched.tags && formik.errors.tags}
          </div>
          <Select
            mode="multiple"
            allowClear
            className="w-100"
            placeholder="Select colors"
            defaultValue={[]}
            onChange={(selectedColorValues) =>
              formik.setFieldValue("color", selectedColorValues)
            }
            onBlur={() => formik.setFieldTouched("color", true)}
            options={coloropt}
          />
          <div className="error">
            {formik.touched.color && formik.errors.color}
          </div>
          <CustomInput
            type="number"
            label="Enter Product Quantity"
            name="quantity"
            onChng={formik.handleChange("quantity")}
            onBlr={formik.handleBlur("quantity")}
            val={formik.values.quantity}
          />
          <div className="error">
            {formik.touched.quantity && formik.errors.quantity}
          </div>

          <ImageUpload
            onDrop={onDrop}
            images={formik.values.images}
            onRemove={handleRemoveImage}
          />
          <div className="error">
            {formik.touched.images && formik.errors.images}
          </div>
          <button
            className="btn btn-success border-0 rounded-3 my-5"
            type="submit"
          >
            {getProductId ? "Edit Product" : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Addproduct;
