// A React signup form with dynamic lift entry using useState
import React, { useState } from "react";
import { db } from "./firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

export default function SignupForm() {
  const [coachInfo, setCoachInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    programStyle: "",
    otherStyle: "",
    programFrequency: "",
    otherFrequency: "",
    additionalNotes: "",
    preferDiscussion: false,
    targetAudience: [],
  });

  const handleCoachChange = (field, value) => {
    setCoachInfo({ ...coachInfo, [field]: value });
  };

  const handleTargetAudienceChange = (value) => {
    const current = coachInfo.targetAudience;
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setCoachInfo({ ...coachInfo, targetAudience: updated });
  };

  const [lifts, setLifts] = useState([{ name: "", repRange: "", notes: "" }]);

  const [focusedNoteIndex, setFocusedNoteIndex] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [formStatus, setFormStatus] = useState(null);

  const handleLiftChange = (index, field, value) => {
    const updatedLifts = [...lifts];
    updatedLifts[index][field] = value;
    setLifts(updatedLifts);
  };

  const addLift = () => {
    setLifts([...lifts, { name: "", repRange: "", notes: "" }]);
  };

  const removeLift = (index) => {
    const updatedLifts = [...lifts];
    updatedLifts.splice(index, 1);
    setLifts(updatedLifts);
  };

  const isFormComplete = () => {
    const coachFieldsFilled =
      coachInfo.firstName &&
      coachInfo.lastName &&
      coachInfo.email &&
      coachInfo.phone;
    const liftsFilled = lifts.every((lift) => lift.name && lift.repRange);
    return coachFieldsFilled && liftsFilled;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let uploadedFileURL = null;

  if (uploadedFile) {
    const fileRef = ref(storage, `uploadedFiles/${uploadedFile.name}`);
    const snapshot = await uploadBytes(fileRef, uploadedFile);
    uploadedFileURL = await getDownloadURL(snapshot.ref);
  }

  const formData = {
    coachInfo,
    lifts,
    uploadedFileName: uploadedFile?.name || null,
    uploadedFileURL: uploadedFileURL || null,
    submittedAt: Timestamp.now(),
  };

    try {
      await addDoc(collection(db, "coach_submissions"), formData);
      setFormStatus("success"); // ✅ Mark as successful
    } catch (error) {
      console.error("Error submitting form:", error);
      setFormStatus("error"); // ✅ Mark as failed
    }
  };

  const inputStyle = {
    display: "block",
    width: "100%",
    padding: "0.5rem",
    marginBottom: "1rem",
    border: "1px solid #ccc",
    borderRadius: "4px",
  };

  const compactInputStyle = {
    flex: "1",
    padding: "0.4rem",
    marginRight: "0.5rem",
    border: "1px solid #ccc",
    borderRadius: "4px",
  };

  if (formStatus === "success") {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h2 style={{ color: "#28a745" }}>Thank you for signing up!</h2>
        <p>We will review your signup form and reach out to you shortly.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ padding: "1rem", maxWidth: "600px", margin: "0 auto" }}
    >
      <h2
        style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}
      >
        RepMate Signup
      </h2>
      {formStatus === "error" && (
        <div
          style={{
            padding: "0.75rem",
            marginBottom: "1rem",
            backgroundColor: "#f8d7da",
            color: "#721c24",
            border: "1px solid #f5c6cb",
            borderRadius: "4px",
          }}
        >
          Something went wrong. Please try again.
        </div>
      )}

      <div
        style={{
          marginBottom: "2rem",
          padding: "1rem",
          border: "1px solid #ccc",
          borderRadius: "6px",
          backgroundColor: "#f0f8ff",
        }}
      >
        <h3 style={{ fontWeight: "600", marginBottom: "1rem" }}>
          Coach Information
        </h3>
        <input
          type="text"
          placeholder="First Name"
          value={coachInfo.firstName}
          onChange={(e) => handleCoachChange("firstName", e.target.value)}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={coachInfo.lastName}
          onChange={(e) => handleCoachChange("lastName", e.target.value)}
          style={inputStyle}
        />
        <input
          type="email"
          placeholder="Email"
          value={coachInfo.email}
          onChange={(e) => handleCoachChange("email", e.target.value)}
          style={inputStyle}
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={coachInfo.phone}
          onChange={(e) => handleCoachChange("phone", e.target.value)}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Company Name (optional)"
          value={coachInfo.company}
          onChange={(e) => handleCoachChange("company", e.target.value)}
          style={inputStyle}
        />
      </div>

      <div
        style={{
          marginBottom: "2rem",
          padding: "1rem",
          border: "1px solid #ccc",
          borderRadius: "6px",
          backgroundColor: "#e8f5e9",
        }}
      >
        <h3 style={{ fontWeight: "600", marginBottom: "1rem" }}>
          Program Style
        </h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ flex: "1" }}>
            {["Push / Pull / Legs", "Upper / Lower", "Other"].map((option) => (
              <label
                key={option}
                style={{ display: "block", marginBottom: "0.5rem" }}
              >
                <input
                  type="radio"
                  name="programStyle"
                  value={option}
                  checked={coachInfo.programStyle === option}
                  onChange={(e) =>
                    handleCoachChange("programStyle", e.target.value)
                  }
                  style={{ marginRight: "0.5rem" }}
                />
                {option}
              </label>
            ))}
            {coachInfo.programStyle === "Other" && (
              <input
                type="text"
                placeholder="Describe your program style"
                value={coachInfo.otherStyle}
                onChange={(e) =>
                  handleCoachChange("otherStyle", e.target.value)
                }
                style={inputStyle}
              />
            )}
          </div>
          <div style={{ flex: "1" }}>
            <label style={{ fontWeight: "600" }}>Program Frequency</label>
            <select
              value={coachInfo.programFrequency}
              onChange={(e) =>
                handleCoachChange("programFrequency", e.target.value)
              }
              style={inputStyle}
            >
              <option value="">Select frequency</option>
              {[
                "1 day/week",
                "2 days/week",
                "3 days/week",
                "4 days/week",
                "5 days/week",
                "6 days/week",
                "Other",
              ].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {coachInfo.programFrequency === "Other" && (
              <input
                type="text"
                placeholder="Specify other frequency"
                value={coachInfo.otherFrequency}
                onChange={(e) =>
                  handleCoachChange("otherFrequency", e.target.value)
                }
                style={inputStyle}
              />
            )}
          </div>
        </div>
        <div style={{ marginTop: "1.5rem" }}>
          <label style={{ fontWeight: "600", display: "block" }}>
            Target Audience
          </label>
          {[
            "Beginners",
            "Intermediate lifters",
            "Competitive athletes",
            "Gen pop / general fitness",
            "Other",
          ].map((option) => (
            <label
              key={option}
              style={{ display: "block", marginBottom: "0.5rem" }}
            >
              <input
                type="checkbox"
                checked={coachInfo.targetAudience.includes(option)}
                onChange={() => handleTargetAudienceChange(option)}
                style={{ marginRight: "0.5rem" }}
              />
              {option}
            </label>
          ))}
        </div>
      </div>

      <div
        style={{
          marginBottom: "2rem",
          padding: "1rem",
          border: "1px solid #ccc",
          borderRadius: "6px",
          backgroundColor: "#fff8e1",
        }}
      >
        <h3 style={{ fontWeight: "600", marginBottom: "1rem" }}>
          Approved Lifts
        </h3>
        <div
          style={{
            marginBottom: "1rem",
            fontSize: "0.9rem",
            backgroundColor: "#fff3cd",
            padding: "0.75rem",
            borderRadius: "6px",
            border: "1px solid #ffeeba",
          }}
        >
          Add as much or as little to this section as you’d like. Feel free to
          leave it blank if you’d prefer to go over your lifts via phone or
          video chat.
        </div>
        {lifts.map((lift, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "0.5rem",
            }}
          >
            <input
              type="text"
              placeholder="Lift Name"
              value={lift.name}
              onChange={(e) => handleLiftChange(index, "name", e.target.value)}
              style={compactInputStyle}
            />
            <input
              type="text"
              placeholder="Preferred Rep Range"
              value={lift.repRange}
              onChange={(e) =>
                handleLiftChange(index, "repRange", e.target.value)
              }
              style={compactInputStyle}
            />
            <textarea
              placeholder="Notes"
              value={lift.notes}
              onFocus={() => setFocusedNoteIndex(index)}
              onBlur={() => setFocusedNoteIndex(null)}
              onChange={(e) => handleLiftChange(index, "notes", e.target.value)}
              style={{
                ...compactInputStyle,
                height: focusedNoteIndex === index ? "80px" : "36px",
                resize: "none",
              }}
            />
            {lifts.length > 1 && (
              <button
                type="button"
                onClick={() => removeLift(index)}
                style={{
                  background: "none",
                  border: "none",
                  color: "red",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addLift}
          style={{
            padding: "0.5rem 1rem",
            border: "none",
            borderRadius: "4px",
            marginRight: "0.5rem",
            backgroundColor: "#007bff",
            color: "white",
            cursor: "pointer",
          }}
        >
          Add Another Lift
        </button>
        <div style={{ marginTop: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            Upload Approved Lifts File:
          </label>
          <input
            type="file"
            onChange={(e) => setUploadedFile(e.target.files[0])}
            style={inputStyle}
          />
        </div>
        <div style={{ marginTop: "1rem" }}>
          <label>
            <input
              type="checkbox"
              checked={coachInfo.preferDiscussion}
              onChange={(e) =>
                handleCoachChange("preferDiscussion", e.target.checked)
              }
              style={{ marginRight: "0.5rem" }}
            />
            I'd rather discuss this over a call
          </label>
        </div>
      </div>

      <div
        style={{
          marginBottom: "2rem",
          padding: "1rem",
          border: "1px solid #ccc",
          borderRadius: "6px",
          backgroundColor: "#f3f3f3",
        }}
      >
        <h3 style={{ fontWeight: "600", marginBottom: "1rem" }}>
          Additional Notes
        </h3>
        <textarea
          placeholder="Anything else you'd like us to know..."
          value={coachInfo.additionalNotes}
          onChange={(e) => handleCoachChange("additionalNotes", e.target.value)}
          style={{ ...inputStyle, resize: "vertical" }}
        />
      </div>

      <button
        type="submit"
        style={{
          padding: "0.5rem 1rem",
          border: "none",
          borderRadius: "4px",
          backgroundColor: "#28a745",
          color: "white",
          cursor: "pointer",
          marginTop: "1rem",
        }}
      >
        Submit
      </button>
    </form>
  );
}
