import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getVehicles } from "../services/api";

function FleetIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 16.5V11l2.2-4h10.6l2.2 4v5.5" />
      <path d="M6 16.5h12" />
      <circle cx="7.5" cy="17.5" r="1.5" />
      <circle cx="16.5" cy="17.5" r="1.5" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3z" />
      <path d="M18.5 15l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2z" />
    </svg>
  );
}

function KeyIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="8" cy="10" r="3.5" />
      <path d="M11 10h10" />
      <path d="M17 10v2" />
      <path d="M20 10v2" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3l7 3v5c0 4.5-2.9 7.8-7 10-4.1-2.2-7-5.5-7-10V6l7-3z" />
      <path d="M9.5 12l1.7 1.7L14.8 10" />
    </svg>
  );
}

function StatsCard({ label, value, accent, icon, note }) {
  return (
    <div className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">{label}</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>
          <p className="mt-2 text-sm text-slate-500">{note}</p>
        </div>
        <div className={`rounded-2xl p-3 ${accent}`}>{icon}</div>
      </div>
    </div>
  );
}

const fetchVehicles = async () => {
  return await getVehicles();
};

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["vehicles"],
    queryFn: fetchVehicles,
  });

  const total = data?.length || 0;
  const newVehicles = data?.filter((v) => v.status === "NEW").length || 0;
  const usedVehicles = data?.filter((v) => v.status === "USED").length || 0;
  const rebuilt = data?.filter((v) => v.status === "REBUILT").length || 0;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(15,23,42,0.08),_transparent_30%),linear-gradient(180deg,_#f8fafc_0%,_#eef4ff_100%)]">
      <div className="mx-auto max-w-7xl p-6">
        <div className="mb-8 flex flex-col gap-5 rounded-[30px] border border-slate-200 bg-white px-6 py-7 shadow-sm md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Fleet Dashboard</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Vehicle Overview</h1>
            <p className="mt-2 text-sm text-slate-500">Monitor all registered vehicles and manage records from one place.</p>
          </div>

          <Link to="/vehicle/new">
            <button className="rounded-2xl bg-blue-950 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-900">
              Register Vehicle
            </button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20 text-lg font-medium text-gray-500 animate-pulse">
            Loading...
          </div>
        ) : (
          <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              label="Total Vehicles"
              value={total}
              note="All vehicles currently tracked"
              accent="bg-slate-100 text-slate-800"
              icon={<FleetIcon />}
            />
            <StatsCard
              label="New Vehicles"
              value={newVehicles}
              note="Recently added or brand-new units"
              accent="bg-emerald-100 text-emerald-800"
              icon={<SparkIcon />}
            />
            <StatsCard
              label="Used Vehicles"
              value={usedVehicles}
              note="Vehicles actively in use"
              accent="bg-amber-100 text-amber-800"
              icon={<KeyIcon />}
            />
            <StatsCard
              label="Rebuilt Vehicles"
              value={rebuilt}
              note="Restored or rebuilt records"
              accent="bg-blue-100 text-blue-900"
              icon={<ShieldIcon />}
            />
          </div>
        )}

        <div className="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-800">All Vehicles</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                  <th className="border-b px-6 py-4">#</th>
                  <th className="border-b px-6 py-4">Manufacture</th>
                  <th className="border-b px-6 py-4">Model</th>
                  <th className="border-b px-6 py-4">Year</th>
                  <th className="border-b px-6 py-4">Type</th>
                  <th className="border-b px-6 py-4">Status</th>
                  <th className="border-b px-6 py-4">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {isLoading ? (
                  <tr>
                    <td colSpan="7" className="py-10 text-center text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : data?.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-10 text-center italic text-gray-500">
                      No vehicles found.
                    </td>
                  </tr>
                ) : (
                  data.map((vehicle, index) => (
                    <tr key={vehicle.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">{index + 1}</td>
                      <td className="px-6 py-4 font-semibold">{vehicle.manufacture}</td>
                      <td className="px-6 py-4">{vehicle.model}</td>
                      <td className="px-6 py-4">{vehicle.year}</td>
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-950">
                          {vehicle.vehicleType}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-2 py-1 text-xs ${
                            vehicle.status === "NEW"
                              ? "bg-emerald-100 text-emerald-800"
                              : vehicle.status === "USED"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-slate-100 text-slate-800"
                          }`}
                        >
                          {vehicle.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Link to={`/vehicle/${vehicle.id}`}>
                            <button className="rounded border px-3 py-1 text-sm hover:bg-gray-100">View</button>
                          </Link>
                          <Link to={`/vehicle/${vehicle.id}/edit`}>
                            <button className="rounded border px-3 py-1 text-sm hover:bg-gray-100">Edit</button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
