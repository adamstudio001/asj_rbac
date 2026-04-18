import React, { useEffect, useState } from "react";
import clsx from "clsx";
import axios from "axios";
import { HardDrive, Database } from "lucide-react";
import { BASEURL } from "@/Common/Constant";

const StorageMeter = () => {
  const [storage, setStorage] = useState(null);
  const [loading, setLoading] = useState(true);

  const getStorage = () => {
    setLoading(true);
    setTimeout(async () => {
      try {
        const response = await axios.get(
          `${BASEURL}/api/v1/system/storage-usage`,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          },
        );

        setStorage(response.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  useEffect(() => {
    getStorage();
  }, []);

  if (loading) {
    return (
      <div className="max-w-lg rounded-2xl border border-slate-200 bg-white p-5 shadow-sm animate-pulse">
        <div className="space-y-3">
          <div className="h-4 w-40 rounded bg-slate-200" />
          <div className="h-4 w-full rounded bg-slate-200" />
          <div className="h-4 w-3/4 rounded bg-slate-200" />
          <div className="h-4 w-full rounded bg-slate-200" />
          <div className="h-4 w-1/2 rounded bg-slate-200" />
        </div>
      </div>
    );
  }

  if (!storage) {
    return (
      <div className="max-w-lg rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-red-500">Failed load storage data</p>
      </div>
    );
  }

  const usage = Number(storage.usage_percent ?? 0);
  const used = Number(storage.used_size_gb ?? 0);
  const total = Number(storage.total_size_gb ?? 0);
  const remaining = Number(storage.remaining_size_gb ?? 0);
  const path = storage.system_storage_path ?? "/";

  const getColor = () => {
    if (usage >= 90) return "bg-red-500";
    if (usage >= 60) return "bg-yellow-500";
    return "bg-emerald-500";
  };

  const getTextColor = () => {
    if (usage >= 90) return "text-red-600";
    if (usage >= 60) return "text-yellow-600";
    return "text-emerald-600";
  };

  return (
    <div className="max-w-lg">
      <div className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-slate-100 p-3">
            <HardDrive size={22} className="text-slate-700" />
          </div>

          <div className="flex-1">
            <h3 className="text-sm font-semibold text-slate-800">
              Storage Capacity
            </h3>
            <p className="text-xs text-slate-500">Disk Path: {path}</p>
          </div>

          <div className={clsx("text-sm font-bold", getTextColor())}>
            {usage.toFixed(1)}%
          </div>
        </div>

        {/* BAROMETER */}
        <div className="mt-5 px-2">
          <div className="relative h-4 w-full overflow-hidden rounded-full bg-slate-200">
            <div className="absolute inset-y-0 left-0 w-[60%] bg-emerald-500" />
            <div className="absolute inset-y-0 left-[60%] w-[30%] bg-yellow-400" />
            <div className="absolute inset-y-0 right-0 w-[10%] bg-red-500" />

            <div
              className="absolute top-1/2 -translate-y-1/2 transition-all duration-500"
              style={{ left: `calc(${usage}% - 8px)` }}
            >
              <div className="h-4 w-4 rounded-full border-2 border-white bg-slate-900 shadow-md" />
            </div>
          </div>

          <div className="mt-2 flex justify-between text-[10px] text-slate-400">
            <span>0%</span>
            <span>60%</span>
            <span>90%</span>
            <span>100%</span>
          </div>
        </div>

        <div className="mt-3 flex justify-between text-xs text-slate-500">
          <span>{used.toFixed(2)} GB Used</span>
          <span>{remaining.toFixed(2)} GB Free</span>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Total</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">
              {total.toFixed(2)} GB
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Used</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">
              {used.toFixed(2)} GB
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Remaining</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">
              {remaining.toFixed(2)} GB
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2 text-xs text-blue-700">
          <Database size={14} />
          {storage.usage_text}
        </div>
      </div>
    </div>
  );
};

export default StorageMeter;
