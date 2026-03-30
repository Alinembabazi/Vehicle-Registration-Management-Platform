import axios from "axios";

const BASE_URL = "https://student-management-system-backend.up.railway.app/api/vehicle-service";

export const getVehicles = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/vehicle`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

export const getVehicleById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/vehicle/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

export const createVehicle = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/vehicle`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

export const updateVehicle = async (id, data) => {
  try {
    const response = await axios.put(`${BASE_URL}/vehicle/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

// DELETE vehicle
export const deleteVehicle = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/vehicle/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};
export const getVehicleByTab = async (id, tab) => {
  try {
    const response = await axios.get(`${BASE_URL}/vehicle/${id}`, {
      headers: { "Content-Type": "application/json" },
    });

    const vehicle = response.data;

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
    throw error.response?.data?.message || error.message;
  }
};