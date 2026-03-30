import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getVehicleById, updateVehicle } from "../services/api";

function EditVehicle() {
const { id } = useParams();
const navigate = useNavigate();
const queryClient = useQueryClient();

const [draft, setDraft] = useState(null);

const emptyForm = {
  manufacture: "",
  model: "",
  year: "",
  plateNumber: "",
  ownerName: "",
  mobile: "",
};

const { data, isLoading, error } = useQuery({
  queryKey: ["vehicle", id],
  queryFn: () => getVehicleById(id),
});

const form = draft ?? (data
  ? {
      manufacture: data.manufacture || "",
      model: data.model || "",
      year: data.year?.toString() || "",
      plateNumber: data.plateNumber || "",
      ownerName: data.ownerName || "",
      mobile: data.mobile || "",
    }
  : emptyForm);

const mutation = useMutation({
  mutationFn: (payload) => updateVehicle(id, payload),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    queryClient.invalidateQueries({ queryKey: ["vehicle", id] });
    toast.success("Vehicle updated!");
    navigate(`/vehicle/${id}`);
  },
  onError: (err) => toast.error(err.message || "Update failed"),
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
        onChange={(e) => setDraft({ ...form, manufacture: e.target.value })}
        className="border p-2 w-full"
        required
      />
      <input
        type="text"
        placeholder="Model"
        value={form.model}
        onChange={(e) => setDraft({ ...form, model: e.target.value })}
        className="border p-2 w-full"
        required
      />
      <input
        type="number"
        placeholder="Year"
        value={form.year}
        onChange={(e) => setDraft({ ...form, year: e.target.value })}
        className="border p-2 w-full"
        required
      />
      <input
        type="text"
        placeholder="Plate Number"
        value={form.plateNumber}
        onChange={(e) => setDraft({ ...form, plateNumber: e.target.value })}
        className="border p-2 w-full"
        required
      />
      <input
        type="text"
        placeholder="Owner Name"
        value={form.ownerName}
        onChange={(e) => setDraft({ ...form, ownerName: e.target.value })}
        className="border p-2 w-full"
        required
      />
      <input
        type="text"
        placeholder="Mobile"
        value={form.mobile}
        onChange={(e) => setDraft({ ...form, mobile: e.target.value })}
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
          disabled={mutation.isPending}
          className="px-4 py-2 bg-blue-950 text-white rounded"
        >
          {mutation.isPending ? "Saving..." : "Update Vehicle"}
        </button>
      </div>
    </form>
  </div>
);
}

export default EditVehicle;
