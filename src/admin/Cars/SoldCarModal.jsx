// src/admin/Cars/SoldCarModal.jsx
import React, { useEffect, useRef, useState } from "react";
import { Modal, message } from "antd";
import { FiPlus, FiX } from "react-icons/fi";
import api from "../../api";

export default function SoldCarModal({ open, onClose, car, onSold }) {
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    soldPrice: "",
    paymentMode: "UPI",
    remarks: "",
    soldDate: "",
    fullName: "",
    mobileNumber: "",
    email: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    idProofType: "Aadhar",
    idProofNumber: "",
  });

  const [idProofImage, setIdProofImage] = useState(null);

  // ==========================
  // Reset on open
  // ==========================
  useEffect(() => {
    if (open) {
      setForm({
        soldPrice: "",
        paymentMode: "UPI",
        remarks: "",
        soldDate: "",
        fullName: "",
        mobileNumber: "",
        email: "",
        street: "",
        city: "",
        state: "",
        pincode: "",
        idProofType: "Aadhar",
        idProofNumber: "",
      });
      setIdProofImage(null);
    }
  }, [open]);

  // ==========================
  // Handlers (same pattern as AddCarModal)
  // ==========================
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const openFilePicker = () => fileInputRef.current.click();

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIdProofImage(file); // ONLY ONE IMAGE
    e.target.value = null;
  };

  const removeImage = () => {
    setIdProofImage(null);
  };

  // ==========================
  // Sold Car API
  // ==========================
  const handleSold = async () => {
    if (!idProofImage) {
      return message.error("ID Proof image is required");
    }

    try {
      const formData = new FormData();

      // Basic
      formData.append("car", car._id);
      formData.append("soldPrice", form.soldPrice);
      formData.append("paymentMode", form.paymentMode);
      formData.append("remarks", form.remarks);
      formData.append("soldDate", form.soldDate);

      // Buyer
      formData.append("buyer[fullName]", form.fullName);
      formData.append("buyer[mobileNumber]", form.mobileNumber);
      formData.append("buyer[email]", form.email);

      // Address
      formData.append("buyer[address][street]", form.street);
      formData.append("buyer[address][city]", form.city);
      formData.append("buyer[address][state]", form.state);
      formData.append("buyer[address][pincode]", form.pincode);

      // ID Proof
      formData.append("buyer[idProof][type]", form.idProofType);
      formData.append("buyer[idProof][number]", form.idProofNumber);

      // Image
      formData.append("idProofImage", idProofImage);

      const res = await api.post("/admin/sold", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.success) {
        message.success("🚗 Car marked as SOLD");
        onClose();
        onSold(); // refresh car list
      }
    } catch (err) {
      console.error(err);
      message.error("❌ Failed to mark car as sold");
    }
  };

  return (
    <Modal
      title={`Sell Car - ${car?.name || ""}`}
      open={open}
      onCancel={onClose}
      onOk={handleSold}
      okText="Confirm Sale"
      centered
    >
      {/* Buyer */}
      <input className="modal-input" name="fullName" placeholder="Buyer Full Name" value={form.fullName} onChange={handleChange} />
      <input className="modal-input" name="mobileNumber" placeholder="Mobile Number" value={form.mobileNumber} onChange={handleChange} />
      <input className="modal-input" name="email" placeholder="Email" value={form.email} onChange={handleChange} />

      {/* Address */}
      <input className="modal-input" name="street" placeholder="Street" value={form.street} onChange={handleChange} />
      <input className="modal-input" name="city" placeholder="City" value={form.city} onChange={handleChange} />
      <input className="modal-input" name="state" placeholder="State" value={form.state} onChange={handleChange} />
      <input className="modal-input" name="pincode" placeholder="Pincode" value={form.pincode} onChange={handleChange} />

      {/* ID Proof */}
      <select className="modal-input" name="idProofType" value={form.idProofType} onChange={handleChange}>
        <option value="Aadhar">Aadhar</option>
        <option value="PAN">PAN</option>
        <option value="Driving License">Driving License</option>
        <option value="Passport">Passport</option>
      </select>

      <input className="modal-input" name="idProofNumber" placeholder="ID Proof Number" value={form.idProofNumber} onChange={handleChange} />

      {/* Image Picker (SAME UX AS AddCarModal) */}
      <div className="image-picker" style={{ marginBottom:'10px'}}>
        {idProofImage && (
          <div className="image-box">
            <img src={URL.createObjectURL(idProofImage)} alt="ID Proof" />
            <button type="button" className="remove-img" onClick={removeImage}>
              <FiX />
            </button>
          </div>
        )}

        {!idProofImage && (
          <div className="image-box add-box" onClick={openFilePicker}>
            <FiPlus />
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleImageSelect}
        />
      </div>

      {/* Sale Info */}
      <input className="modal-input" name="soldPrice" type="number" placeholder="Sold Price" value={form.soldPrice} onChange={handleChange} />
      <textarea className="modal-input" name="remarks" placeholder="Remarks" value={form.remarks} onChange={handleChange} />
      <input className="modal-input" name="soldDate" type="date" value={form.soldDate} onChange={handleChange} />
    </Modal>
  );
}
