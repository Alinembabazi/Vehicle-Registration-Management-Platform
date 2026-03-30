import axios from "axios";

const BASE_URL = "https://student-management-system-backend.up.railway.app/api/vehicle-service";

const toNumber = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toIsoDate = (value, fallback) => {
  if (!value) return fallback;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? fallback : date.toISOString();
};

const addYears = (value, yearsToAdd) => {
  const date = value ? new Date(value) : new Date();

  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString();
  }

  date.setFullYear(date.getFullYear() + yearsToAdd);
  return date.toISOString();
};

const formatVehiclePayload = (input = {}, existingVehicle = {}) => {
  const seed = `${Date.now()}`;
  const numericSeed = seed.slice(-5);
  const source = { ...existingVehicle, ...input };

  const registrationDate = toIsoDate(
    source.registrationDate,
    existingVehicle.registrationDate || new Date().toISOString()
  );

  return {
    manufacture: source.manufacture || existingVehicle.manufacture || "Toyota",
    model: source.model || existingVehicle.model || "Corolla",
    year: toNumber(source.year, existingVehicle.year || 2024),
    vehicleType: source.vehicleType || existingVehicle.vehicleType || "SUV",
    bodyType: source.bodyType || existingVehicle.bodyType || "Sedan",
    color: source.color || existingVehicle.color || "White",
    fuelType: source.fuelType || existingVehicle.fuelType || "PETROL",
    engineCapacity: toNumber(source.engineCapacity, existingVehicle.engineCapacity || 1800),
    odometerReading: toNumber(source.odometerReading, existingVehicle.odometerReading || 10000),
    seatingCapacity: toNumber(source.seatingCapacity, existingVehicle.seatingCapacity || 5),
    vehiclePurpose: source.vehiclePurpose || existingVehicle.vehiclePurpose || "PERSONAL",
    vehicleStatus: source.vehicleStatus || existingVehicle.vehicleStatus || "USED",
    ownerName: source.ownerName || existingVehicle.ownerName || "Test Owner",
    ownerType: source.ownerType || existingVehicle.ownerType || "INDIVIDUAL",
    nationalId:
      source.nationalId || existingVehicle.nationalId || seed.padEnd(16, "0").slice(0, 16),
    passportNumber:
      source.passportNumber || existingVehicle.passportNumber || `PC2024${seed.slice(-3)}`,
    companyRegNumber:
      source.companyRegNumber ||
      existingVehicle.companyRegNumber ||
      `RWA/2026/${numericSeed.padStart(5, "0")}`,
    address: source.address || existingVehicle.address || "KG 123 St, Kigali",
    mobile: source.mobile || existingVehicle.mobile || "0780000000",
    email: source.email || existingVehicle.email || `user${seed}@example.com`,
    plateNumber: source.plateNumber || existingVehicle.plateNumber || `RAE ${seed.slice(-3)} A`,
    registrationStatus:
      source.registrationStatus || existingVehicle.registrationStatus || "ACTIVE",
    registrationDate,
    expiryDate: toIsoDate(
      source.expiryDate,
      existingVehicle.expiryDate || addYears(registrationDate, 1)
    ),
    state: source.state || existingVehicle.state || "Kigali",
    plateType: source.plateType || existingVehicle.plateType || "PRIVATE",
    policyNumber:
      source.policyNumber ||
      existingVehicle.policyNumber ||
      `POL-2026-${numericSeed.padStart(5, "0")}`,
    companyName:
      source.companyName || existingVehicle.companyName || "SANLAM Insurance Rwanda",
    insuranceExpiryDate: toIsoDate(
      source.insuranceExpiryDate,
      existingVehicle.insuranceExpiryDate || addYears(registrationDate, 1)
    ),
    insuranceStatus: source.insuranceStatus || existingVehicle.insuranceStatus || "ACTIVE",
    insuranceType:
      source.insuranceType || existingVehicle.insuranceType || "Comprehensive",
    roadworthyCert:
      source.roadworthyCert ||
      existingVehicle.roadworthyCert ||
      `RWC-2026-${numericSeed.padStart(5, "0")}`,
    customsRef:
      source.customsRef ||
      existingVehicle.customsRef ||
      `CUS-RW-2026-${numericSeed.padStart(5, "0")}`,
    proofOfOwnership:
      source.proofOfOwnership ||
      existingVehicle.proofOfOwnership ||
      `LOG-BOOK-2026-${numericSeed.padStart(5, "0")}`,
  };
};

const normalizeVehicle = (vehicle) => {
  if (!vehicle || typeof vehicle !== "object") {
    return vehicle;
  }

  return {
    ...vehicle,
    id: vehicle.id || vehicle._id,
    status: vehicle.status || vehicle.vehicleStatus,
  };
};

const getApiError = (error) => {
  const data = error.response?.data;
  const status = error.response?.status;

  const prefix = status ? `Request failed (${status})` : "Request failed";

  if (typeof data === "string" && data.trim()) {
    return new Error(`${prefix}: ${data}`);
  }

  if (data?.message) {
    return new Error(`${prefix}: ${data.message}`);
  }

  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    return new Error(
      `${prefix}: ${data.errors.map((item) => item.message || item).join(", ")}`
    );
  }

  if (data && typeof data === "object") {
    return new Error(`${prefix}: ${JSON.stringify(data)}`);
  }

  return new Error(error.message || prefix);
};

export const getVehicles = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/vehicle`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return Array.isArray(response.data)
      ? response.data.map(normalizeVehicle)
      : normalizeVehicle(response.data);
  } catch (error) {
    throw getApiError(error);
  }
};

export const getVehicleById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/vehicle/${id}`);
    return normalizeVehicle(response.data);
  } catch (error) {
    throw getApiError(error);
  }
};

export const createVehicle = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/vehicle`, formatVehiclePayload(data), {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return normalizeVehicle(response.data);
  } catch (error) {
    throw getApiError(error);
  }
};

export const updateVehicle = async (id, data) => {
  try {
    const currentVehicle = await getVehicleById(id);
    const response = await axios.put(
      `${BASE_URL}/vehicle/${id}`,
      formatVehiclePayload(data, currentVehicle),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return normalizeVehicle(response.data);
  } catch (error) {
    throw getApiError(error);
  }
};

// DELETE vehicle
export const deleteVehicle = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/vehicle/${id}`);
    return response.data;
  } catch (error) {
    throw getApiError(error);
  }
};
export const getVehicleByTab = async (id, tab) => {
  try {
    const response = await axios.get(`${BASE_URL}/vehicle/${id}`, {
      headers: { "Content-Type": "application/json" },
    });

    const vehicle = normalizeVehicle(response.data);

    switch (tab) {
      case "info":
        return {
          manufacture: vehicle.manufacture,
          model: vehicle.model,
          year: vehicle.year,
          vehicleType: vehicle.vehicleType,
          fuelType: vehicle.fuelType,
          bodyType: vehicle.bodyType,
          color: vehicle.color,
          engineCapacity: vehicle.engineCapacity,
          seatingCapacity: vehicle.seatingCapacity,
          odometerReading: vehicle.odometerReading,
          purpose: vehicle.vehiclePurpose,
          status: vehicle.vehicleStatus,
        };
      case "owner":
        return {
          ownerName: vehicle.ownerName,
          ownerType: vehicle.ownerType,
          nationalId: vehicle.nationalId,
          passportNumber: vehicle.passportNumber,
          companyRegNumber: vehicle.companyRegNumber,
          mobile: vehicle.mobile,
          email: vehicle.email,
          address: vehicle.address,
        };
      case "registration":
        return {
          plateNumber: vehicle.plateNumber,
          plateType: vehicle.plateType,
          registrationDate: vehicle.registrationDate,
          expiryDate: vehicle.expiryDate,
          registrationStatus: vehicle.registrationStatus,
          roadworthyCert: vehicle.roadworthyCert,
          proofOfOwnership: vehicle.proofOfOwnership,
          customsRef: vehicle.customsRef,
        };
      case "insurance":
        return {
          policyNumber: vehicle.policyNumber,
          companyName: vehicle.companyName,
          insuranceType: vehicle.insuranceType,
          insuranceStatus: vehicle.insuranceStatus,
          insuranceExpiryDate: vehicle.insuranceExpiryDate,
        };
      default:
        return vehicle;
    }
  } catch (error) {
    throw getApiError(error);
  }
};
