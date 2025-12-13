import React, { useRef, useState } from "react";
import { Modal, message } from "antd";
import { FiPlus, FiX } from "react-icons/fi";
import api from "../../api";

export default function AddCarModal({ open, onClose, onAdded }) {
  const [form, setForm] = useState({
    name: "",
    brand: "",
    model: "",
    year: "",
    price: "",
    description: "",
  });

  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);

  // ==========================
  // Handlers
  // ==========================
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const openFilePicker = () => fileInputRef.current.click();

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
    e.target.value = null;
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // ==========================
  // Add Car API
  // ==========================
  const handleAddCar = async () => {
    try {
      const formData = new FormData();

      Object.keys(form).forEach((key) =>
        formData.append(key, form[key])
      );

      images.forEach((img) =>
        formData.append("images", img)
      );

      const res = await api.post("/cars", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.success) {
        message.success("🚗 Car added successfully");
        setForm({
          name: "",
          brand: "",
          model: "",
          year: "",
          price: "",
          description: "",
        });
        setImages([]);
        onClose();
        onAdded(); // refresh list
      }
    } catch {
      message.error("❌ Failed to add car");
    }
  };

  return (
    <Modal
      title="Add Car"
      open={open}
      onCancel={onClose}
      onOk={handleAddCar}
      okText="Add Car"
      centered
    >
      <input className="modal-input" name="name" placeholder="Car Name" value={form.name} onChange={handleChange} />
      <input className="modal-input" name="brand" placeholder="Brand" value={form.brand} onChange={handleChange} />
      <input className="modal-input" name="model" placeholder="Model" value={form.model} onChange={handleChange} />
      <input className="modal-input" type="number" name="year" placeholder="Year" value={form.year} onChange={handleChange} />
      <input className="modal-input" type="number" name="price" placeholder="Price" value={form.price} onChange={handleChange} />
      <textarea className="modal-input" name="description" placeholder="Description" value={form.description} onChange={handleChange} />

      {/* Image Picker */}
      <div className="image-picker">
        {images.map((img, index) => (
          <div className="image-box" key={index}>
            <img src={URL.createObjectURL(img)} alt="preview" />
            <button type="button" className="remove-img" onClick={() => removeImage(index)}>
              <FiX />
            </button>
          </div>
        ))}

        <div className="image-box add-box" onClick={openFilePicker}>
          <FiPlus />
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={handleImageSelect}
        />
      </div>
    </Modal>
  );
}
