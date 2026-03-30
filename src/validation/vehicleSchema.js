import { z } from "zod";

export const VEHICLE_TYPES = [
  "ELECTRIC",
  "SUV",
  "TRUCK",
  "MOTORCYCLE",
  "BUS",
  "VAN",
  "PICKUP",
  "OTHER",
];

export const FUEL_TYPES = [
  "PETROL",
  "DIESEL",
  "ELECTRIC",
  "HYBRID",
  "GAS",
  "OTHER",
];

export const VEHICLE_PURPOSES = ["PERSONAL", "COMMERCIAL", "TAXI", "GOVERNMENT"];

export const VEHICLE_STATUSES = ["NEW", "USED", "REBUILT"];

export const OWNER_TYPES = ["INDIVIDUAL", "COMPANY", "NGO", "GOVERNMENT"];

export const PLATE_TYPES = [
  "PRIVATE",
  "COMMERCIAL",
  "GOVERNMENT",
  "DIPLOMATIC",
  "PERSONALIZED",
];

export const REGISTRATION_STATUSES = ["ACTIVE", "SUSPENDED", "EXPIRED", "PENDING"];

export const INSURANCE_STATUSES = ["ACTIVE", "SUSPENDED", "EXPIRED"];

const currentYear = new Date().getFullYear();
const today = new Date();
today.setHours(0, 0, 0, 0);

const requiredText = (label) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`);

const futureOrTodayDate = (label) =>
  z
    .string()
    .min(1, `${label} is required`)
    .refine((value) => !Number.isNaN(new Date(value).getTime()), {
      message: `${label} must be a valid date`,
    })
    .refine((value) => {
      const date = new Date(value);
      date.setHours(0, 0, 0, 0);
      return date >= today;
    }, {
      message: `${label} cannot be in the past`,
    });

export const vehicleFormSchema = z
  .object({
    manufacture: requiredText("Manufacture"),
    model: requiredText("Model"),
    year: z.coerce.number().int().min(1886).max(currentYear + 1),
    vehicleType: z.enum(VEHICLE_TYPES),
    bodyType: requiredText("Body type"),
    color: requiredText("Color"),
    fuelType: z.enum(FUEL_TYPES),
    engineCapacity: z.coerce.number().int().positive("Engine capacity must be greater than 0"),
    odometerReading: z.coerce.number().int().min(0, "Odometer reading must be 0 or greater"),
    seatingCapacity: z.coerce.number().int().min(1, "Seating capacity must be at least 1"),
    vehiclePurpose: z.enum(VEHICLE_PURPOSES),
    vehicleStatus: z.enum(VEHICLE_STATUSES),
    ownerName: requiredText("Owner name"),
    ownerType: z.enum(OWNER_TYPES),
    nationalId: z.string().regex(/^\d{16}$/, "National ID must be exactly 16 digits"),
    passportNumber: z.string().trim().optional().or(z.literal("")),
    companyRegNumber: z.string().trim().optional().or(z.literal("")),
    address: requiredText("Address"),
    mobile: z.string().regex(/^\d{10}$/, "Mobile number must be exactly 10 digits"),
    email: z.email("Enter a valid email address"),
    plateNumber: z
      .string()
      .trim()
      .regex(/^(R[A-Z]{2}|GR|CD)\s?\d{3}\s?[A-Z]?$/i, "Enter a valid Rwandan plate number"),
    registrationStatus: z.enum(REGISTRATION_STATUSES),
    registrationDate: z
      .string()
      .min(1, "Registration date is required")
      .refine((value) => !Number.isNaN(new Date(value).getTime()), {
        message: "Registration date must be a valid date",
      }),
    expiryDate: futureOrTodayDate("Expiry date"),
    state: requiredText("State"),
    plateType: z.enum(PLATE_TYPES),
    policyNumber: requiredText("Policy number"),
    companyName: requiredText("Company name"),
    insuranceExpiryDate: futureOrTodayDate("Insurance expiry date"),
    insuranceStatus: z.enum(INSURANCE_STATUSES),
    insuranceType: requiredText("Insurance type"),
    roadworthyCert: requiredText("Roadworthy certificate"),
    customsRef: requiredText("Customs reference"),
    proofOfOwnership: requiredText("Proof of ownership"),
  })
  .superRefine((data, ctx) => {
    if (data.ownerType === "COMPANY" && !data.companyRegNumber?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["companyRegNumber"],
        message: "Company registration number is required for company owners",
      });
    }
  });

export const getVehicleFieldErrors = (values) => {
  const result = vehicleFormSchema.safeParse(values);

  if (result.success) {
    return {};
  }

  return result.error.issues.reduce((acc, issue) => {
    const field = issue.path[0];

    if (typeof field === "string" && !acc[field]) {
      acc[field] = issue.message;
    }

    return acc;
  }, {});
};
