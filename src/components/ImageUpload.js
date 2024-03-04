import React from "react";
import Dropzone from "react-dropzone";

const ImageUpload = ({ onDrop, images, onRemove }) => {
  return (
    <div className="bg-white border-1 p-5 text-center">
      <Dropzone onDrop={onDrop}>
        {({ getRootProps, getInputProps }) => (
          <section>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <p>Drag 'n' drop some files here, or click to select files</p>
            </div>
          </section>
        )}
      </Dropzone>
      <div className="showimages d-flex flex-wrap gap-3 justify-content-center">
        {images.map((image, index) => (
          <div className="position-relative" key={image.public_id}>
            <button
              type="button"
              onClick={() => onRemove(image.public_id)}
              className="btn-close position-absolute"
              style={{ top: "10px", right: "10px" }}
            />
            <img src={image.url} alt="" width={200} height={200} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUpload;
