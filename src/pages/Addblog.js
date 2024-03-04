import { React, useState, useEffect } from "react";
import CustomInput from "../components/CustomInput";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useLocation } from "react-router-dom";
import * as yup from "yup";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  createBlog,
  resetState,
  getBlog,
  updateBlog,
} from "../features/blogs/blogSlice";
import ImageUpload from "../components/ImageUpload";
import { delImg, uploadImg } from "../features/upload/uploadSlice";
import { getCategories } from "../features/bcategory/bcategorySlice";

let schema = yup.object().shape({
  title: yup.string().required("Blog title is Required"),
  category: yup.string().required("Blog Category is Required"),
  description: yup.string().required("Description is Required"),
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

const Addblog = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const getBlogId = location.pathname.split("/")[3];

  const [initialValues, setInitialValues] = useState({
    title: "",
    category: "",
    description: "",
    images: [],
  });

  useEffect(() => {
    dispatch(getCategories());
    if (getBlogId) {
      dispatch(getBlog(getBlogId))
        .unwrap()
        .then((blog) => {
          formik.setValues({
            title: blog.title,
            category: blog.category,
            description: blog.description,
            images: blog.images,
          });
        })
        .catch((error) => {
          toast.error("Could not fetch blog details");
        });
    }
  }, [getBlogId, dispatch]);

  const { bCategories } = useSelector((state) => state.bCategory);

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: schema,
    onSubmit: (values) => {
      const action = getBlogId
        ? updateBlog({ id: getBlogId, ...values })
        : createBlog(values);
      dispatch(action)
        .unwrap()
        .then(() => {
          // Handle success, e.g., show a success toast, navigate away, etc.
          toast.success(`Blog ${getBlogId ? "updated" : "added"} successfully`);
          navigate("/admin/blog-list");
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
      <h3 className="mb-4 title">{getBlogId ? "Edit Blog" : "Add Blog"}</h3>

      <div>
        <form action="" onSubmit={formik.handleSubmit}>
          <div className="mt-4">
            <CustomInput
              type="text"
              label="Enter Blog Title"
              name="title"
              onChng={formik.handleChange("title")}
              onBlr={formik.handleBlur("title")}
              val={formik.values.title}
            />
          </div>
          <div className="error">
            {formik.touched.title && formik.errors.title}
          </div>
          <select
            name="category"
            className="form-control py-3  mt-3"
            id=""
            onChange={formik.handleChange("category")}
            onBlur={formik.handleBlur("category")}
            value={formik.values.category}
          >
            <option value="">Select Blog Category</option>
            {bCategories.map((blogCat) => {
              return (
                <option key={blogCat._id} value={blogCat.title}>
                  {blogCat.title}
                </option>
              );
            })}
          </select>
          <div className="error">
            {formik.touched.category && formik.errors.category}
          </div>
          <ReactQuill
            theme="snow"
            className="mt-3"
            name="description"
            onChange={formik.handleChange("description")}
            value={formik.values.description}
          />
          <div className="error">
            {formik.touched.description && formik.errors.description}
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
            {getBlogId ? "Edit Blog" : "Add Blog"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Addblog;
