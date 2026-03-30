import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getVehicleById, updateVehicle } from "../services/api"; // ✅ named imports

function EditVehicle() {
const { id } = useParams();
const navigate = useNavigate();
const queryClient = useQueryClient();

const [form, setForm] = useState({
  manufacture: "",
  model: "",
  year: "",
  plateNumber: "",
  ownerName: "",
  mobile: "",
});

const { isLoading, error } = useQuery({
  queryKey: ["vehicle", id],
  queryFn: () => getVehicleById(id),
  onSuccess: (data) => {
    if (data) {
      setForm({
        manufacture: data.manufacture || "",
        model: data.model || "",
        year: data.year || "",
        plateNumber: data.plateNumber || "",
        ownerName: data.ownerName || "",
        mobile: data.mobile || "",
      });
    }
  },
});

const mutation = useMutation({
  mutationFn: (payload) => updateVehicle(id, payload),
  onSuccess: () => {
    queryClient.invalidateQueries(["vehicles"]);
    toast.success("Vehicle updated!");
    navigate(`/vehicle/${id}`);
  },
  onError: (err) => toast.error(err.response?.data?.message || "Update failed"),
});

const handleSubmit = (e) => {
  e.preventDefault();
  mutation.mutate({ ...form, year: parseInt(form.year, 10) });
};

if (isLoading) return <p>Loading vehicle...</p>;
if (error) return <p>Error loading vehicle.</p>;

return (
  <div className="p-4 max-w-lg mx-auto border rounded shadow-sm">
    <h2 className="text-xl font-bold mb-4">Edit Vehicle</h2>
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        placeholder="Manufacture"
        value={form.manufacture}
        onChange={(e) => setForm({ ...form, manufacture: e.target.value })}
        className="border p-2 w-full"
        required
      />
      <input
        type="text"
        placeholder="Model"
        value={form.model}
        onChange={(e) => setForm({ ...form, model: e.target.value })}
        className="border p-2 w-full"
        required
      />
      <input
        type="number"
        placeholder="Year"
        value={form.year}
        onChange={(e) => setForm({ ...form, year: e.target.value })}
        className="border p-2 w-full"
        required
      />
      <input
        type="text"
        placeholder="Plate Number"
        value={form.plateNumber}
        onChange={(e) => setForm({ ...form, plateNumber: e.target.value })}
        className="border p-2 w-full"
        required
      />
      <input
        type="text"
        placeholder="Owner Name"
        value={form.ownerName}
        onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
        className="border p-2 w-full"
        required
      />
      <input
        type="text"
        placeholder="Mobile"
        value={form.mobile}
        onChange={(e) => setForm({ ...form, mobile: e.target.value })}
        className="border p-2 w-full"
        required
      />

      <div className="flex justify-between mt-4">
        <button
          type="button"
          onClick={() => navigate(`/vehicle/${id}`)}
          className="px-4 py-2 border rounded"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={mutation.isLoading}
          className="px-4 py-2 bg-blue-950 text-white rounded"
        >
          {mutation.isLoading ? "Saving..." : "Update Vehicle"}
        </button>
      </div>
    </form>
  </div>
);
}

export default EditVehicle;