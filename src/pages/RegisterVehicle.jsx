import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createVehicle } from "../services/api"; // ✅ FIXED

const STEPS = ["Core Details", "Operations", "Owner Details", "Certifications"];

const INITIAL_STATE = {
  manufacture: "",
  model: "",
  year: "",
  vehicleType: "SUV",
  bodyType: "Sedan",
  color: "",
  fuelType: "PETROL",
  engineCapacity: "",
  seatingCapacity: "",
  odometerReading: "",
  vehiclePurpose: "PERSONAL",
  vehicleStatus: "USED",
  state: "Kigali",
  plateNumber: "",
  plateType: "PRIVATE",
  ownerName: "",
  ownerType: "INDIVIDUAL",
  nationalId: "",
  passportNumber: "",
  companyRegNumber: "",
  address: "",
  mobile: "",
  email: "",
  registrationStatus: "ACTIVE",
  registrationDate: "",
  expiryDate: "",
  policyNumber: "",
  companyName: "",
  insuranceType: "Comprehensive",
  insuranceStatus: "ACTIVE",
  insuranceExpiryDate: "",
  roadworthyCert: "",
  customsRef: "",
  proofOfOwnership: ""
};

const toNumber = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const addYears = (dateString, yearsToAdd) => {
  const date = dateString ? new Date(dateString) : new Date();
  date.setFullYear(date.getFullYear() + yearsToAdd);
  return date.toISOString();
};

const toISO = (value, fallback) => {
  if (value) {
    return new Date(value).toISOString();
  }

  return fallback;
};

const Field = ({ label, name, type = "text", options = [], value, onChange }) => (
  <div className="flex flex-col gap-1.5 mb-2">
    <label className="text-sm font-semibold text-gray-700">{label}</label>

    {type === "select" ? (
      <select
        name={name}
        value={value || ""}
        onChange={onChange}
        className="w-full border rounded px-3 py-2"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    ) : (
      <input
        type={type}
        name={name}
        value={value || ""}
        onChange={onChange}
        className="w-full border rounded px-3 py-2"
      />
    )}
  </div>
);

export default function RegisterVehicle() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState(INITIAL_STATE);

  const { mutate, isPending } = useMutation({
    mutationFn: createVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      toast.success("Vehicle registered!");
      navigate("/dashboard");
    },
    onError: (err) => toast.error(err.message || "Registration failed")
  });

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const next = () => step < STEPS.length - 1 && setStep(step + 1);
  const prev = () => step > 0 && setStep(step - 1);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (step !== STEPS.length - 1) return next();

    const id = Date.now().toString();
    const registrationDate = toISO(formData.registrationDate, new Date().toISOString());
    const expiryDate = toISO(formData.expiryDate, addYears(formData.registrationDate, 1));
    const insuranceExpiryDate = toISO(
      formData.insuranceExpiryDate,
      addYears(formData.registrationDate, 1)
    );

    const payload = {
      manufacture: formData.manufacture || "Toyota",
      model: formData.model || "Corolla",
      color: formData.color || "White",
      year: toNumber(formData.year, 2024),
      engineCapacity: toNumber(formData.engineCapacity, 1800),
      seatingCapacity: toNumber(formData.seatingCapacity, 5),
      odometerReading: toNumber(formData.odometerReading, 10000),
      vehicleType: formData.vehicleType,
      bodyType: formData.bodyType,
      fuelType: formData.fuelType,
      vehiclePurpose: formData.vehiclePurpose,
      vehicleStatus: formData.vehicleStatus,
      state: formData.state || "Kigali",
      plateNumber: formData.plateNumber || `RAE ${id.slice(-3)} A`,
      plateType: formData.plateType,
      ownerName: formData.ownerName || "Test Owner",
      ownerType: formData.ownerType,
      email: formData.email || `user${id}@example.com`,
      mobile: formData.mobile || "0780000000",
      address: formData.address || "KG 123 St, Kigali",
      nationalId: formData.nationalId || id.padEnd(16, "0").slice(0, 16),
      passportNumber: formData.passportNumber || `PC${id.slice(-7)}`,
      companyRegNumber: formData.companyRegNumber || `RWA/2026/${id.slice(-5)}`,
      roadworthyCert: formData.roadworthyCert || `RWC-${id.slice(-6)}`,
      customsRef: formData.customsRef || `CUS-RW-${id.slice(-6)}`,
      proofOfOwnership: formData.proofOfOwnership || `LOG-BOOK-${id.slice(-6)}`,
      policyNumber: formData.policyNumber || `POL-${id.slice(-6)}`,
      companyName: formData.companyName || "SANLAM Insurance Rwanda",
      insuranceType: formData.insuranceType,
      insuranceStatus: formData.insuranceStatus,
      registrationStatus: formData.registrationStatus,
      registrationDate,
      expiryDate,
      insuranceExpiryDate
    };

    mutate(payload);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 min-h-screen">
      <div className="bg-white p-6 shadow-md rounded-xl">
        <h1 className="text-2xl font-bold mb-2">Register Vehicle</h1>

        <form onSubmit={handleSubmit}>
          {step === 0 && (
            <>
              <Field label="Manufacture" name="manufacture" value={formData.manufacture} onChange={handleChange} />
              <Field label="Model" name="model" value={formData.model} onChange={handleChange} />
              <Field label="Year" name="year" type="number" value={formData.year} onChange={handleChange} />
              <Field label="Color" name="color" value={formData.color} onChange={handleChange} />
              <Field label="Engine Capacity" name="engineCapacity" type="number" value={formData.engineCapacity} onChange={handleChange} />
              <Field label="Seating Capacity" name="seatingCapacity" type="number" value={formData.seatingCapacity} onChange={handleChange} />
            </>
          )}

          {step === 1 && (
            <>
              <Field label="Plate Number" name="plateNumber" value={formData.plateNumber} onChange={handleChange} />
              <Field label="Odometer Reading" name="odometerReading" type="number" value={formData.odometerReading} onChange={handleChange} />
            </>
          )}

          {step === 2 && (
            <>
              <Field label="Owner Name" name="ownerName" value={formData.ownerName} onChange={handleChange} />
              <Field label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />
              <Field label="Mobile" name="mobile" value={formData.mobile} onChange={handleChange} />
            </>
          )}

          {step === 3 && (
            <>
              <Field label="Policy Number" name="policyNumber" value={formData.policyNumber} onChange={handleChange} />
              <Field label="Insurance Company" name="companyName" value={formData.companyName} onChange={handleChange} />
              <Field label="Insurance Expiry Date" name="insuranceExpiryDate" type="date" value={formData.insuranceExpiryDate} onChange={handleChange} />
            </>
          )}

          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={prev}
              disabled={step === 0}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Previous
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 bg-blue-950 text-white rounded"
            >
              {step === STEPS.length - 1
                ? isPending
                  ? "Submitting..."
                  : "Submit"
                : "Next"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
