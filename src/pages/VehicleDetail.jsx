import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { deleteVehicle, getVehicleById, getVehicleByTab } from "../services/api";

const TABS = ["info", "owner", "registration", "insurance"];

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString();
}

function DetailItem({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-2 text-base font-semibold text-slate-900">{value || "-"}</p>
    </div>
  );
}

function DetailGrid({ children }) {
  return <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{children}</div>;
}

export default function VehicleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("info");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data: summary } = useQuery({
    queryKey: ["vehicle", id, "summary"],
    queryFn: () => getVehicleById(id),
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["vehicle", id, activeTab],
    queryFn: () => getVehicleByTab(id, activeTab),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteVehicle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      toast.success("Vehicle deleted successfully");
      navigate("/dashboard");
    },
    onError: () => {
      toast.error("Failed to delete vehicle");
    },
  });

  const renderInfoTab = (info) => (
    <DetailGrid>
      <DetailItem label="Manufacture" value={info.manufacture} />
      <DetailItem label="Model" value={info.model} />
      <DetailItem label="Year" value={info.year} />
      <DetailItem label="Vehicle Type" value={info.vehicleType} />
      <DetailItem label="Fuel Type" value={info.fuelType} />
      <DetailItem label="Body Type" value={info.bodyType} />
      <DetailItem label="Color" value={info.color} />
      <DetailItem label="Engine Capacity" value={info.engineCapacity ? `${info.engineCapacity} cc` : "-"} />
      <DetailItem label="Seating Capacity" value={info.seatingCapacity} />
      <DetailItem label="Odometer" value={info.odometerReading ? `${info.odometerReading} km` : "-"} />
      <DetailItem label="Purpose" value={info.purpose} />
      <DetailItem label="Status" value={info.status} />
    </DetailGrid>
  );

  const renderOwnerTab = (owner) => (
    <DetailGrid>
      <DetailItem label="Owner Name" value={owner.ownerName} />
      <DetailItem label="Owner Type" value={owner.ownerType} />
      <DetailItem label="Mobile" value={owner.mobile} />
      <DetailItem label="Email" value={owner.email} />
      <DetailItem label="National ID" value={owner.nationalId} />
      <DetailItem label="Passport Number" value={owner.passportNumber} />
      <DetailItem label="Company Reg Number" value={owner.companyRegNumber} />
      <DetailItem label="Address" value={owner.address} />
    </DetailGrid>
  );

  const renderRegistrationTab = (reg) => (
    <DetailGrid>
      <DetailItem label="Plate Number" value={reg.plateNumber} />
      <DetailItem label="Plate Type" value={reg.plateType} />
      <DetailItem label="Registration Date" value={formatDate(reg.registrationDate)} />
      <DetailItem label="Expiry Date" value={formatDate(reg.expiryDate)} />
      <DetailItem label="Registration Status" value={reg.registrationStatus} />
      <DetailItem label="Roadworthy Certificate" value={reg.roadworthyCert} />
      <DetailItem label="Customs Reference" value={reg.customsRef} />
      <DetailItem label="Proof Of Ownership" value={reg.proofOfOwnership} />
    </DetailGrid>
  );

  const renderInsuranceTab = (ins) => (
    <DetailGrid>
      <DetailItem label="Policy Number" value={ins.policyNumber} />
      <DetailItem label="Company Name" value={ins.companyName} />
      <DetailItem label="Insurance Type" value={ins.insuranceType} />
      <DetailItem label="Insurance Status" value={ins.insuranceStatus} />
      <DetailItem label="Insurance Expiry Date" value={formatDate(ins.insuranceExpiryDate)} />
    </DetailGrid>
  );

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(30,64,175,0.08),_transparent_26%),linear-gradient(180deg,_#f8fafc_0%,_#eef3ff_100%)] px-4 py-6 md:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_24px_80px_-40px_rgba(15,23,42,0.35)]">
          <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-slate-800 px-6 py-8 text-white md:px-8 md:py-10">
            <div className="grid gap-6 lg:grid-cols-[1.15fr_0.55fr] lg:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200">
                  Vehicle Detail
                </p>
                <h1 className="mt-3 text-3xl font-bold md:text-4xl">
                  {[summary?.manufacture, summary?.model].filter(Boolean).join(" ") || "Vehicle Record"}
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200">
                  Review vehicle information across identity, ownership, registration, and
                  insurance in one professional detail workspace.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                  <p className="text-slate-300">Plate</p>
                  <p className="mt-1 font-semibold text-white">{summary?.plateNumber || "-"}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                  <p className="text-slate-300">Status</p>
                  <p className="mt-1 font-semibold text-white">{summary?.vehicleStatus || "-"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 px-6 py-6 lg:grid-cols-[0.78fr_0.22fr] md:px-8 md:py-8">
            <div className="space-y-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`rounded-2xl px-4 py-3 text-sm font-semibold capitalize transition ${
                      activeTab === tab
                        ? "bg-blue-950 text-white shadow-lg"
                        : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="rounded-[28px] border border-slate-200 bg-slate-50/70 p-5 md:p-6">
                {isLoading ? (
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <div key={index} className="h-24 animate-pulse rounded-2xl bg-white" />
                    ))}
                  </div>
                ) : null}

                {isError ? (
                  <p className="text-sm font-medium text-red-600">Error loading vehicle data.</p>
                ) : null}

                {data && activeTab === "info" ? renderInfoTab(data) : null}
                {data && activeTab === "owner" ? renderOwnerTab(data) : null}
                {data && activeTab === "registration" ? renderRegistrationTab(data) : null}
                {data && activeTab === "insurance" ? renderInsuranceTab(data) : null}
              </div>
            </div>

            <aside className="space-y-4">
              <div className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Actions
                </p>
                <div className="mt-4 flex flex-col gap-3">
                  <Link
                    to={`/vehicle/${id}/edit`}
                    className="rounded-2xl bg-blue-950 px-4 py-3 text-center font-semibold text-white transition hover:bg-blue-900"
                  >
                    Edit Vehicle
                  </Link>
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(true)}
                    className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 font-semibold text-red-700 transition hover:bg-red-100"
                  >
                    Delete Vehicle
                  </button>
                </div>
              </div>

              <div className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Quick Facts
                </p>
                <div className="mt-4 space-y-4 text-sm">
                  <div>
                    <p className="text-slate-500">Owner</p>
                    <p className="font-semibold text-slate-900">{summary?.ownerName || "-"}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Type</p>
                    <p className="font-semibold text-slate-900">{summary?.vehicleType || "-"}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Fuel</p>
                    <p className="font-semibold text-slate-900">{summary?.fuelType || "-"}</p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {showDeleteModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4">
          <div className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-slate-900">Delete Vehicle</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Are you sure you want to delete this vehicle record? This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                className="rounded-2xl border border-slate-300 px-4 py-2.5 font-medium text-slate-700 transition hover:bg-slate-50"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-2xl bg-red-700 px-4 py-2.5 font-semibold text-white transition hover:bg-red-800 disabled:opacity-60"
                onClick={() => deleteMutation.mutate()}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
