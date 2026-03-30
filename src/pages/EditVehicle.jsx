import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getVehicleById, updateVehicle } from "../services/api";

function InputField({ label, value, onChange, type = "text", placeholder }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-slate-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-blue-900 focus:ring-2 focus:ring-blue-100"
        required
      />
    </div>
  );
}

function Panel({ title, subtitle, children }) {
  return (
    <section className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      <div className="mt-5 grid gap-4 md:grid-cols-2">{children}</div>
    </section>
  );
}

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

  const form =
    draft ??
    (data
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

  const updateField = (field, value) => {
    setDraft({ ...form, [field]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ ...form, year: parseInt(form.year, 10) });
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl p-6">
        <div className="rounded-[30px] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="animate-pulse space-y-5">
            <div className="h-10 w-64 rounded bg-slate-200" />
            <div className="h-4 w-80 rounded bg-slate-100" />
            <div className="grid gap-4 md:grid-cols-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-24 rounded-[24px] bg-slate-100" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <div className="rounded-[30px] border border-red-200 bg-red-50 p-8 text-center shadow-sm">
          <h2 className="text-2xl font-bold text-red-900">Unable to load vehicle</h2>
          <p className="mt-2 text-sm text-red-700">
            We could not fetch this vehicle&apos;s details for editing.
          </p>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="mt-6 rounded-2xl bg-red-900 px-5 py-3 text-white transition hover:bg-red-800"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_rgba(30,64,175,0.08),_transparent_26%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)] px-4 py-6 md:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_24px_80px_-40px_rgba(15,23,42,0.35)]">
          <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-slate-800 px-6 py-9 text-white md:px-8">
            <div className="grid gap-6 lg:grid-cols-[1.15fr_0.55fr] lg:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200">
                  Vehicle Record
                </p>
                <h1 className="mt-3 text-3xl font-bold md:text-4xl">Refine Vehicle Details</h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200">
                  Update core record information with a cleaner editing workspace built for
                  accuracy and quick review.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                  <p className="text-slate-300">Plate</p>
                  <p className="mt-1 font-semibold text-white">{form.plateNumber || "-"}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                  <p className="text-slate-300">Owner</p>
                  <p className="mt-1 font-semibold text-white">{form.ownerName || "-"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 px-6 py-6 lg:grid-cols-[0.78fr_0.22fr] md:px-8 md:py-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Panel
                title="Vehicle Details"
                subtitle="Keep the vehicle profile accurate for easy management and dashboard reporting."
              >
                <InputField
                  label="Manufacture"
                  value={form.manufacture}
                  onChange={(e) => updateField("manufacture", e.target.value)}
                  placeholder="Toyota"
                />
                <InputField
                  label="Model"
                  value={form.model}
                  onChange={(e) => updateField("model", e.target.value)}
                  placeholder="Corolla"
                />
                <InputField
                  label="Year"
                  type="number"
                  value={form.year}
                  onChange={(e) => updateField("year", e.target.value)}
                  placeholder="2024"
                />
                <InputField
                  label="Plate Number"
                  value={form.plateNumber}
                  onChange={(e) => updateField("plateNumber", e.target.value)}
                  placeholder="RAA 123 B"
                />
              </Panel>

              <Panel
                title="Owner Contact"
                subtitle="Update the visible contact information tied to this vehicle record."
              >
                <InputField
                  label="Owner Name"
                  value={form.ownerName}
                  onChange={(e) => updateField("ownerName", e.target.value)}
                  placeholder="Owner full name"
                />
                <InputField
                  label="Mobile"
                  value={form.mobile}
                  onChange={(e) => updateField("mobile", e.target.value)}
                  placeholder="0788123456"
                />
              </Panel>

              <div className="flex flex-col gap-3 rounded-[26px] border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => navigate(`/vehicle/${id}`)}
                  className="rounded-2xl border border-slate-300 px-5 py-3 font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="rounded-2xl bg-blue-950 px-5 py-3 font-semibold text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {mutation.isPending ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>
            </form>

            <aside className="space-y-4">
              <div className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Quick Summary
                </p>
                <div className="mt-4 space-y-4">
                  <div>
                    <p className="text-sm text-slate-500">Vehicle</p>
                    <p className="font-semibold text-slate-900">
                      {[form.manufacture, form.model].filter(Boolean).join(" ") || "Not set"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Year</p>
                    <p className="font-semibold text-slate-900">{form.year || "Not set"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Contact</p>
                    <p className="font-semibold text-slate-900">{form.mobile || "Not set"}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[26px] border border-amber-100 bg-amber-50 p-5">
                <h3 className="font-semibold text-amber-900">Review Before Saving</h3>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  Double-check the plate number and owner name first, since those are the most
                  visible fields across the dashboard and detail screens.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditVehicle;
