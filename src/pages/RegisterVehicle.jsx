import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';

// ─── STEP 1 SCHEMA: Vehicle Info ───
const step1Schema = z.object({
  manufacture: z.string().min(1, 'Manufacture is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.coerce.number()
    .int()
    .min(1886, 'Year must be 1886 or later')
    .max(new Date().getFullYear() + 1, 'Year is too far in the future'),
  vehicleType: z.enum(['ELECTRIC', 'SUV', 'TRUCK', 'MOTORCYCLE', 'BUS', 'VAN', 'PICKUP', 'OTHER']),
  fuelType: z.enum(['PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID', 'GAS', 'OTHER']),
  bodyType: z.string().min(1, 'Body type is required'),
  color: z.string().min(1, 'Color is required'),
  engineCapacity: z.coerce.number().int().min(1, 'Engine capacity must be greater than 0'),
  seatingCapacity: z.coerce.number().int().min(1, 'Seating capacity must be at least 1'),
  odometerReading: z.coerce.number().int().min(0, 'Odometer must be 0 or more'),
  purpose: z.enum(['PERSONAL', 'COMMERCIAL', 'TAXI', 'GOVERNMENT']),
  status: z.enum(['NEW', 'USED', 'REBUILT']),
});

// ─── STEP 2 SCHEMA: Owner Info ───
const step2Schema = z.object({
  ownerName: z.string().min(1, 'Owner name is required'),
  ownerType: z.enum(['INDIVIDUAL', 'COMPANY', 'NGO', 'GOVERNMENT']),
  nationalId: z.string().regex(/^\d{16}$/, 'National ID must be exactly 16 digits'),
  mobile: z.string().regex(/^\d{10}$/, 'Mobile must be exactly 10 digits'),
  email: z.string().email('Must be a valid email address'),
  address: z.string().min(1, 'Address is required'),
  companyRegNumber: z.string().optional(),
  passportNumber: z.string().optional(),
}).refine(data => {
  if (data.ownerType === 'COMPANY' && !data.companyRegNumber) {
    return false;
  }
  return true;
}, {
  message: 'Company registration number is required for COMPANY owner type',
  path: ['companyRegNumber'],
});

// ─── STEP 3 SCHEMA: Registration & Insurance ───
const step3Schema = z.object({
  plateNumber: z.string()
    .regex(/^(R[A-Z]{2}|GR|CD)\s?\d{3}\s?[A-Z]?$/i, 'Invalid Rwandan plate number e.g. RAB 123 A'),
  plateType: z.enum(['PRIVATE', 'COMMERCIAL', 'GOVERNMENT', 'DIPLOMATIC', 'PERSONALIZED']),
  registrationDate: z.string().min(1, 'Registration date is required'),
  expiryDate: z.string().min(1, 'Expiry date is required'),
  registrationStatus: z.enum(['ACTIVE', 'SUSPENDED', 'EXPIRED', 'PENDING']),
  customsRef: z.string().min(1, 'Customs reference is required'),
  proofOfOwnership: z.string().min(1, 'Proof of ownership is required'),
  roadworthyCert: z.string().min(1, 'Roadworthy certificate is required'),
  policyNumber: z.string().min(1, 'Policy number is required'),
  companyName: z.string().min(1, 'Insurance company name is required'),
  insuranceType: z.string().min(1, 'Insurance type is required'),
  insuranceExpiryDate: z.string().min(1, 'Insurance expiry date is required'),
  insuranceStatus: z.enum(['ACTIVE', 'SUSPENDED', 'EXPIRED']),
}).refine(data => {
  return new Date(data.expiryDate) > new Date();
}, {
  message: 'Expiry date cannot be in the past',
  path: ['expiryDate'],
}).refine(data => {
  return new Date(data.insuranceExpiryDate) > new Date();
}, {
  message: 'Insurance expiry date cannot be in the past',
  path: ['insuranceExpiryDate'],
});

const schemas = [step1Schema, step2Schema, step3Schema];

const STEPS = ['Vehicle Info', 'Owner Info', 'Registration & Insurance'];

export default function RegisterVehicle() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: zodResolver(schemas[step]),
  });

  const ownerType = watch('ownerType');

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => api.post('/vehicle', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      toast.success('Vehicle registered successfully! 🎉');
      navigate('/dashboard');
    },
    onError: (error) => {
      const errors = error.response?.data?.errors;
      if (errors && Array.isArray(errors)) {
        errors.forEach(err => toast.error(err.message || err));
      } else {
        toast.error(error.response?.data?.message || 'Registration failed');
      }
    },
  });

  const onNext = (data) => {
    const updated = { ...formData, ...data };
    setFormData(updated);
    if (step < 2) {
      setStep(step + 1);
    } else {
      mutate(updated);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">

      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Register New Vehicle</h1>
      <p className="text-gray-500 mb-6">Fill in all details carefully</p>

      {/* Step Indicator */}
      <div className="flex items-center mb-8">
        {STEPS.map((label, i) => (
          <div key={i} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
              ${i < step ? 'bg-green-500 text-white' :
                i === step ? 'bg-blue-700 text-white' :
                'bg-gray-200 text-gray-500'}`}>
              {i < step ? '✓' : i + 1}
            </div>
            <span className={`ml-2 text-sm font-medium
              ${i === step ? 'text-blue-700' : 'text-gray-400'}`}>
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <div className={`h-1 w-12 mx-3 rounded ${i < step ? 'bg-green-500' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onNext)} className="bg-white rounded-xl shadow p-6 space-y-4">

        {/* ── STEP 1: Vehicle Info ── */}
        {step === 0 && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Manufacture" error={errors.manufacture}>
                <input {...register('manufacture')} placeholder="e.g. Toyota" className={input(errors.manufacture)} />
              </Field>
              <Field label="Model" error={errors.model}>
                <input {...register('model')} placeholder="e.g. Corolla" className={input(errors.model)} />
              </Field>
              <Field label="Year" error={errors.year}>
                <input {...register('year')} type="number" placeholder="e.g. 2020" className={input(errors.year)} />
              </Field>
              <Field label="Color" error={errors.color}>
                <input {...register('color')} placeholder="e.g. White" className={input(errors.color)} />
              </Field>
              <Field label="Body Type" error={errors.bodyType}>
                <input {...register('bodyType')} placeholder="e.g. Sedan" className={input(errors.bodyType)} />
              </Field>
              <Field label="Engine Capacity (cc)" error={errors.engineCapacity}>
                <input {...register('engineCapacity')} type="number" placeholder="e.g. 1500" className={input(errors.engineCapacity)} />
              </Field>
              <Field label="Seating Capacity" error={errors.seatingCapacity}>
                <input {...register('seatingCapacity')} type="number" placeholder="e.g. 5" className={input(errors.seatingCapacity)} />
              </Field>
              <Field label="Odometer Reading (km)" error={errors.odometerReading}>
                <input {...register('odometerReading')} type="number" placeholder="e.g. 50000" className={input(errors.odometerReading)} />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Vehicle Type" error={errors.vehicleType}>
                <select {...register('vehicleType')} className={input(errors.vehicleType)}>
                  <option value="">Select type</option>
                  {['ELECTRIC','SUV','TRUCK','MOTORCYCLE','BUS','VAN','PICKUP','OTHER'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </Field>
              <Field label="Fuel Type" error={errors.fuelType}>
                <select {...register('fuelType')} className={input(errors.fuelType)}>
                  <option value="">Select fuel</option>
                  {['PETROL','DIESEL','ELECTRIC','HYBRID','GAS','OTHER'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </Field>
              <Field label="Purpose" error={errors.purpose}>
                <select {...register('purpose')} className={input(errors.purpose)}>
                  <option value="">Select purpose</option>
                  {['PERSONAL','COMMERCIAL','TAXI','GOVERNMENT'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </Field>
              <Field label="Status" error={errors.status}>
                <select {...register('status')} className={input(errors.status)}>
                  <option value="">Select status</option>
                  {['NEW','USED','REBUILT'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </Field>
            </div>
          </>
        )}

        {/* ── STEP 2: Owner Info ── */}
        {step === 1 && (
          <div className="grid grid-cols-2 gap-4">
            <Field label="Owner Name" error={errors.ownerName}>
              <input {...register('ownerName')} placeholder="Full name" className={input(errors.ownerName)} />
            </Field>
            <Field label="Owner Type" error={errors.ownerType}>
              <select {...register('ownerType')} className={input(errors.ownerType)}>
                <option value="">Select type</option>
                {['INDIVIDUAL','COMPANY','NGO','GOVERNMENT'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </Field>
            <Field label="National ID (16 digits)" error={errors.nationalId}>
              <input {...register('nationalId')} placeholder="1234567890123456" className={input(errors.nationalId)} />
            </Field>
            <Field label="Mobile (10 digits)" error={errors.mobile}>
              <input {...register('mobile')} placeholder="0781234567" className={input(errors.mobile)} />
            </Field>
            <Field label="Email" error={errors.email}>
              <input {...register('email')} type="email" placeholder="owner@email.com" className={input(errors.email)} />
            </Field>
            <Field label="Address" error={errors.address}>
              <input {...register('address')} placeholder="Kigali, Rwanda" className={input(errors.address)} />
            </Field>
            {ownerType === 'COMPANY' && (
              <Field label="Company Registration Number" error={errors.companyRegNumber}>
                <input {...register('companyRegNumber')} placeholder="REG123456" className={input(errors.companyRegNumber)} />
              </Field>
            )}
            <Field label="Passport Number (optional)" error={errors.passportNumber}>
              <input {...register('passportNumber')} placeholder="Optional" className={input(errors.passportNumber)} />
            </Field>
          </div>
        )}

        {/* ── STEP 3: Registration & Insurance ── */}
        {step === 2 && (
          <div className="grid grid-cols-2 gap-4">
            <Field label="Plate Number" error={errors.plateNumber}>
              <input {...register('plateNumber')} placeholder="RAB 123 A" className={input(errors.plateNumber)} />
            </Field>
            <Field label="Plate Type" error={errors.plateType}>
              <select {...register('plateType')} className={input(errors.plateType)}>
                <option value="">Select plate type</option>
                {['PRIVATE','COMMERCIAL','GOVERNMENT','DIPLOMATIC','PERSONALIZED'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </Field>
            <Field label="Registration Date" error={errors.registrationDate}>
              <input {...register('registrationDate')} type="date" className={input(errors.registrationDate)} />
            </Field>
            <Field label="Expiry Date" error={errors.expiryDate}>
              <input {...register('expiryDate')} type="date" className={input(errors.expiryDate)} />
            </Field>
            <Field label="Registration Status" error={errors.registrationStatus}>
              <select {...register('registrationStatus')} className={input(errors.registrationStatus)}>
                <option value="">Select status</option>
                {['ACTIVE','SUSPENDED','EXPIRED','PENDING'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </Field>
            <Field label="Customs Reference" error={errors.customsRef}>
              <input {...register('customsRef')} placeholder="CUST-001" className={input(errors.customsRef)} />
            </Field>
            <Field label="Proof of Ownership" error={errors.proofOfOwnership}>
              <input {...register('proofOfOwnership')} placeholder="DOC-001" className={input(errors.proofOfOwnership)} />
            </Field>
            <Field label="Roadworthy Certificate" error={errors.roadworthyCert}>
              <input {...register('roadworthyCert')} placeholder="CERT-001" className={input(errors.roadworthyCert)} />
            </Field>
            <Field label="Policy Number" error={errors.policyNumber}>
              <input {...register('policyNumber')} placeholder="POL-001" className={input(errors.policyNumber)} />
            </Field>
            <Field label="Insurance Company" error={errors.companyName}>
              <input {...register('companyName')} placeholder="e.g. Sanlam" className={input(errors.companyName)} />
            </Field>
            <Field label="Insurance Type" error={errors.insuranceType}>
              <input {...register('insuranceType')} placeholder="e.g. Comprehensive" className={input(errors.insuranceType)} />
            </Field>
            <Field label="Insurance Expiry Date" error={errors.insuranceExpiryDate}>
              <input {...register('insuranceExpiryDate')} type="date" className={input(errors.insuranceExpiryDate)} />
            </Field>
            <Field label="Insurance Status" error={errors.insuranceStatus}>
              <select {...register('insuranceStatus')} className={input(errors.insuranceStatus)}>
                <option value="">Select status</option>
                {['ACTIVE','SUSPENDED','EXPIRED'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </Field>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4 border-t mt-4">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-5 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
            >
              ← Back
            </button>
          ) : <div />}

          <button
            type="submit"
            disabled={isPending}
            className="bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-800 transition disabled:opacity-50"
          >
            {step < 2 ? 'Next →' : isPending ? 'Submitting...' : 'Submit ✓'}
          </button>
        </div>

      </form>
    </div>
  );
}

// ─── Helper Components ───
function Field({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs">{error.message}</p>}
    </div>
  );
}

function input(error) {
  return `w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
    error ? 'border-red-500 bg-red-50' : 'border-gray-300'
  }`;
}