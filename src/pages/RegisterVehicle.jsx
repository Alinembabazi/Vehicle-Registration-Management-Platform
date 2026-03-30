import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createVehicle } from "../services/api";
import {
  FUEL_TYPES,
  INSURANCE_STATUSES,
  OWNER_TYPES,
  PLATE_TYPES,
  REGISTRATION_STATUSES,
  VEHICLE_PURPOSES,
  VEHICLE_STATUSES,
  VEHICLE_TYPES,
  getVehicleFieldErrors,
} from "../validation/vehicleSchema";

const STEPS = ["Vehicle Details", "Registration", "Owner Details", "Insurance"];

const STEP_FIELDS = [
  ["manufacture", "model", "year", "vehicleType", "bodyType", "color", "fuelType", "engineCapacity", "odometerReading", "seatingCapacity", "vehiclePurpose", "vehicleStatus"],
  ["plateNumber", "plateType", "registrationStatus", "registrationDate", "expiryDate", "state"],
  ["ownerName", "ownerType", "nationalId", "passportNumber", "companyRegNumber", "address", "mobile", "email"],
  ["policyNumber", "companyName", "insuranceType", "insuranceStatus", "insuranceExpiryDate", "roadworthyCert", "customsRef", "proofOfOwnership"],
];

const INITIAL_STATE = {
  manufacture: "",
  model: "",
  year: "",
  vehicleType: "SUV",
  bodyType: "",
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
  insuranceType: "",
  insuranceStatus: "ACTIVE",
  insuranceExpiryDate: "",
  roadworthyCert: "",
  customsRef: "",
  proofOfOwnership: "",
};

function Field({ label, name, type = "text", options = [], value, onChange, error, required = false }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-slate-700">
        {label}
        {required ? " *" : ""}
      </label>
      {type === "select" ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full rounded-2xl border bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition ${
            error ? "border-red-400 ring-2 ring-red-100" : "border-slate-200 focus:border-blue-900 focus:ring-2 focus:ring-blue-100"
          }`}
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
          value={value}
          onChange={onChange}
          className={`w-full rounded-2xl border bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition ${
            error ? "border-red-400 ring-2 ring-red-100" : "border-slate-200 focus:border-blue-900 focus:ring-2 focus:ring-blue-100"
          }`}
        />
      )}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}

function SectionCard({ title, subtitle, children }) {
  return (
    <div className="rounded-[26px] border border-slate-200 bg-white/95 p-5 shadow-sm md:p-6">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      <div className="mt-5 grid gap-4 md:grid-cols-2">{children}</div>
    </div>
  );
}

export default function RegisterVehicle() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});

  const { mutate, isPending } = useMutation({
    mutationFn: createVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      toast.success("Vehicle registered!");
      navigate("/dashboard");
    },
    onError: (err) => toast.error(err.message || "Registration failed"),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validateStep = (index) => {
    const fieldErrors = getVehicleFieldErrors(formData);
    const nextStepErrors = STEP_FIELDS[index].reduce((acc, field) => {
      if (fieldErrors[field]) acc[field] = fieldErrors[field];
      return acc;
    }, {});

    setErrors((prev) => ({ ...prev, ...nextStepErrors }));

    if (Object.keys(nextStepErrors).length > 0) {
      toast.error("Please fix the highlighted fields before continuing.");
      return false;
    }

    return true;
  };

  const next = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    }
  };

  const prev = () => setStep((prev) => Math.max(prev - 1, 0));

  const handleSubmit = (e) => {
    e.preventDefault();

    if (step !== STEPS.length - 1) {
      next();
      return;
    }

    const fieldErrors = getVehicleFieldErrors(formData);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      toast.error("Please correct the form errors before submitting.");
      return;
    }

    mutate(formData);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(15,23,42,0.08),_transparent_30%),linear-gradient(180deg,_#f8fafc_0%,_#eef4ff_100%)] px-4 py-6 md:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_24px_80px_-40px_rgba(15,23,42,0.35)]">
          <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-slate-800 px-6 py-8 text-white md:px-8 md:py-10">
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.6fr] lg:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200">Vehicle Registry</p>
                <h1 className="mt-3 text-3xl font-bold md:text-4xl">Register a New Vehicle</h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200">
                  Add complete vehicle, ownership, registration, and insurance data using a guided workflow designed to reduce validation errors and keep records clean.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                  <p className="text-slate-300">Current Step</p>
                  <p className="mt-1 font-semibold text-white">{STEPS[step]}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                  <p className="text-slate-300">Completion</p>
                  <p className="mt-1 font-semibold text-white">{Math.round(((step + 1) / STEPS.length) * 100)}%</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 px-6 py-6 lg:grid-cols-[0.78fr_0.22fr] md:px-8 md:py-8">
            <div className="space-y-6">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {STEPS.map((label, index) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => {
                      if (index <= step || validateStep(step)) setStep(index);
                    }}
                    className={`rounded-2xl border px-4 py-4 text-left transition ${
                      index === step
                        ? "border-blue-950 bg-blue-950 text-white shadow-lg"
                        : index < step
                          ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                          : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] opacity-80">Step {index + 1}</p>
                    <p className="mt-2 font-semibold">{label}</p>
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {step === 0 ? (
                  <SectionCard title="Vehicle Profile" subtitle="Describe the vehicle’s core identity, category, and technical profile.">
                    <Field label="Manufacture" name="manufacture" value={formData.manufacture} onChange={handleChange} error={errors.manufacture} required />
                    <Field label="Model" name="model" value={formData.model} onChange={handleChange} error={errors.model} required />
                    <Field label="Year" name="year" type="number" value={formData.year} onChange={handleChange} error={errors.year} required />
                    <Field label="Vehicle Type" name="vehicleType" type="select" options={VEHICLE_TYPES} value={formData.vehicleType} onChange={handleChange} error={errors.vehicleType} required />
                    <Field label="Body Type" name="bodyType" value={formData.bodyType} onChange={handleChange} error={errors.bodyType} required />
                    <Field label="Color" name="color" value={formData.color} onChange={handleChange} error={errors.color} required />
                    <Field label="Fuel Type" name="fuelType" type="select" options={FUEL_TYPES} value={formData.fuelType} onChange={handleChange} error={errors.fuelType} required />
                    <Field label="Engine Capacity" name="engineCapacity" type="number" value={formData.engineCapacity} onChange={handleChange} error={errors.engineCapacity} required />
                    <Field label="Odometer Reading" name="odometerReading" type="number" value={formData.odometerReading} onChange={handleChange} error={errors.odometerReading} required />
                    <Field label="Seating Capacity" name="seatingCapacity" type="number" value={formData.seatingCapacity} onChange={handleChange} error={errors.seatingCapacity} required />
                    <Field label="Purpose" name="vehiclePurpose" type="select" options={VEHICLE_PURPOSES} value={formData.vehiclePurpose} onChange={handleChange} error={errors.vehiclePurpose} required />
                    <Field label="Vehicle Status" name="vehicleStatus" type="select" options={VEHICLE_STATUSES} value={formData.vehicleStatus} onChange={handleChange} error={errors.vehicleStatus} required />
                  </SectionCard>
                ) : null}

                {step === 1 ? (
                  <SectionCard title="Registration Details" subtitle="Provide the official registration information used for compliance and tracking.">
                    <Field label="Plate Number" name="plateNumber" value={formData.plateNumber} onChange={handleChange} error={errors.plateNumber} required />
                    <Field label="Plate Type" name="plateType" type="select" options={PLATE_TYPES} value={formData.plateType} onChange={handleChange} error={errors.plateType} required />
                    <Field label="Registration Status" name="registrationStatus" type="select" options={REGISTRATION_STATUSES} value={formData.registrationStatus} onChange={handleChange} error={errors.registrationStatus} required />
                    <Field label="Registration Date" name="registrationDate" type="date" value={formData.registrationDate} onChange={handleChange} error={errors.registrationDate} required />
                    <Field label="Expiry Date" name="expiryDate" type="date" value={formData.expiryDate} onChange={handleChange} error={errors.expiryDate} required />
                    <Field label="State" name="state" value={formData.state} onChange={handleChange} error={errors.state} required />
                  </SectionCard>
                ) : null}

                {step === 2 ? (
                  <SectionCard title="Owner Information" subtitle="Record the responsible owner and primary contact details for this vehicle.">
                    <Field label="Owner Name" name="ownerName" value={formData.ownerName} onChange={handleChange} error={errors.ownerName} required />
                    <Field label="Owner Type" name="ownerType" type="select" options={OWNER_TYPES} value={formData.ownerType} onChange={handleChange} error={errors.ownerType} required />
                    <Field label="National ID" name="nationalId" value={formData.nationalId} onChange={handleChange} error={errors.nationalId} required />
                    <Field label="Passport Number" name="passportNumber" value={formData.passportNumber} onChange={handleChange} error={errors.passportNumber} />
                    <Field label="Company Registration Number" name="companyRegNumber" value={formData.companyRegNumber} onChange={handleChange} error={errors.companyRegNumber} required={formData.ownerType === "COMPANY"} />
                    <Field label="Address" name="address" value={formData.address} onChange={handleChange} error={errors.address} required />
                    <Field label="Mobile Number" name="mobile" value={formData.mobile} onChange={handleChange} error={errors.mobile} required />
                    <Field label="Email" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} required />
                  </SectionCard>
                ) : null}

                {step === 3 ? (
                  <SectionCard title="Insurance & Documentation" subtitle="Attach the policy and supporting references required by the backend rules.">
                    <Field label="Policy Number" name="policyNumber" value={formData.policyNumber} onChange={handleChange} error={errors.policyNumber} required />
                    <Field label="Insurance Company" name="companyName" value={formData.companyName} onChange={handleChange} error={errors.companyName} required />
                    <Field label="Insurance Type" name="insuranceType" value={formData.insuranceType} onChange={handleChange} error={errors.insuranceType} required />
                    <Field label="Insurance Status" name="insuranceStatus" type="select" options={INSURANCE_STATUSES} value={formData.insuranceStatus} onChange={handleChange} error={errors.insuranceStatus} required />
                    <Field label="Insurance Expiry Date" name="insuranceExpiryDate" type="date" value={formData.insuranceExpiryDate} onChange={handleChange} error={errors.insuranceExpiryDate} required />
                    <Field label="Roadworthy Certificate" name="roadworthyCert" value={formData.roadworthyCert} onChange={handleChange} error={errors.roadworthyCert} required />
                    <Field label="Customs Reference" name="customsRef" value={formData.customsRef} onChange={handleChange} error={errors.customsRef} required />
                    <Field label="Proof Of Ownership" name="proofOfOwnership" value={formData.proofOfOwnership} onChange={handleChange} error={errors.proofOfOwnership} required />
                  </SectionCard>
                ) : null}

                <div className="flex flex-col gap-3 rounded-[26px] border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:justify-between">
                  <button
                    type="button"
                    onClick={prev}
                    disabled={step === 0}
                    className="rounded-2xl border border-slate-300 px-5 py-3 font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="rounded-2xl bg-blue-950 px-6 py-3 font-semibold text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {step === STEPS.length - 1 ? (isPending ? "Submitting..." : "Submit Vehicle") : "Continue"}
                  </button>
                </div>
              </form>
            </div>

            <aside className="space-y-4">
              <div className="rounded-[26px] border border-slate-200 bg-slate-950 p-5 text-white shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-200">Form Guide</p>
                <h3 className="mt-3 text-xl font-semibold">Submission Quality</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Complete each section carefully to avoid validation failures from the backend. Required fields and allowed enum values are enforced before submission.
                </p>
              </div>

              <div className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Live Snapshot</p>
                <div className="mt-4 space-y-4 text-sm">
                  <div>
                    <p className="text-slate-500">Vehicle</p>
                    <p className="font-semibold text-slate-900">{[formData.manufacture, formData.model].filter(Boolean).join(" ") || "Not set"}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Plate</p>
                    <p className="font-semibold text-slate-900">{formData.plateNumber || "Not set"}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Owner</p>
                    <p className="font-semibold text-slate-900">{formData.ownerName || "Not set"}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Insurance</p>
                    <p className="font-semibold text-slate-900">{formData.companyName || "Not set"}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[26px] border border-blue-100 bg-blue-50 p-5">
                <h3 className="font-semibold text-blue-950">Validation Reminder</h3>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  Use valid Rwandan plate numbers, a 16-digit national ID, and future expiry dates for registration and insurance.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
