import React, { useEffect, useRef, useState } from "react";
import { Modal, message } from "antd";
import { FiPlus, FiX } from "react-icons/fi";
import api, { rawBase } from "../../api";

export default function EditCarModal({ open, onClose, car, onUpdated }) {
  const [form, setForm] = useState({
    name: "",
    brand: "",
    model: "",
    year: "",
    price: "",
    description: "",
  });

  // Existing images from DB (string paths)
  const [existingImages, setExistingImages] = useState([]);

  // New images to upload (File objects)
  const [newImages, setNewImages] = useState([]);

  // Images marked for deletion
  const [deletedImages, setDeletedImages] = useState([]);

  const fileInputRef = useRef(null);

  // ==========================
  // Init form when car changes
  // ==========================
  useEffect(() => {
    if (car) {
      setForm({
        name: car.name || "",
        brand: car.brand || "",
        model: car.model || "",
        year: car.year || "",
        price: car.price || "",
        description: car.description || "",
      });

      setExistingImages(car.images || []);
      setNewImages([]);
      setDeletedImages([]);
    }
  }, [car]);

  // ==========================
  // Handlers
  // ==========================
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const openFilePicker = () => fileInputRef.current.click();

  const handleNewImageSelect = (e) => {
    const files = Array.from(e.target.files);
    setNewImages((prev) => [...prev, ...files]);
    e.target.value = null;
  };

  // Remove existing image (DB)
  const removeExistingImage = (img) => {
    setExistingImages((prev) => prev.filter((i) => i !== img));
    setDeletedImages((prev) => [...prev, img]);
  };

  // Remove newly added image
  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  // ==========================
  // Update API
  // ==========================
  const handleUpdate = async () => {
    try {
      const formData = new FormData();

      // Text fields
      Object.keys(form).forEach((key) =>
        formData.append(key, form[key])
      );

      // New images
      newImages.forEach((img) =>
        formData.append("images", img)
      );

      // Deleted images
      deletedImages.forEach((img) =>
        formData.append("deletesImage", img)
      );

      const res = await api.put(`/cars/${car._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.success) {
        message.success("✏️ Car updated successfully");
        onUpdated();
        onClose();
      }
    } catch (err) {
      message.error("❌ Failed to update car");
    }
  };

  return (
    <Modal
      title="Edit Car"
      open={open}
      onCancel={onClose}
      onOk={handleUpdate}
      okText="Update"
      centered
    >
      <input className="modal-input" name="name" value={form.name} onChange={handleChange} />
      <input className="modal-input" name="brand" value={form.brand} onChange={handleChange} />
      <input className="modal-input" name="model" value={form.model} onChange={handleChange} />
      <input className="modal-input" type="number" name="year" value={form.year} onChange={handleChange} />
      <input className="modal-input" type="number" name="price" value={form.price} onChange={handleChange} />
      <textarea className="modal-input" name="description" value={form.description} onChange={handleChange} />

      {/* ==========================
          Image Manager
      ========================== */}
      <div className="image-picker">
        {/* Existing images */}
        {existingImages.map((img, index) => (
          <div className="image-box" key={index}>
            <img src={`${rawBase}${img}`} alt="existing" />
            <button
              type="button"
              className="remove-img"
              onClick={() => removeExistingImage(img)}
            >
              <FiX />
            </button>
          </div>
        ))}

        {/* New images */}
        {newImages.map((img, index) => (
          <div className="image-box" key={`new-${index}`}>
            <img src={URL.createObjectURL(img)} alt="new" />
            <button
              type="button"
              className="remove-img"
              onClick={() => removeNewImage(index)}
            >
              <FiX />
            </button>
          </div>
        ))}

        {/* Add Image */}
        <div className="image-box add-box" onClick={openFilePicker}>
          <FiPlus />
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={handleNewImageSelect}
        />
      </div>
    </Modal>
  );
}
