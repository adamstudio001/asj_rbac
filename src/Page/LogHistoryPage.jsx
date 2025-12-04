import React, { useEffect, useState } from "react";
import Navbar from "@src/Components/Navbar";
import { useSearch } from "@src/Providers/SearchProvider";
import { useAuth } from "@/Providers/AuthProvider";
import { formatLastSeen } from "@/Common/Utils";
import EllipsisTooltip from "@/Components/EllipsisTooltip";
import {
  DialogModal,
  DialogModalContent,
  DialogModalDescription,
  DialogModalHeader,
  DialogModalTitle,
} from "@/Components/ui/DialogModal";
import Pagination from "@/Components/Pagination";
import { useToast } from "@/Providers/ToastProvider";
import axios from "axios";

const LogHistoryPage = () => {
  const { addToast } = useToast();
  const { search, setSearch } = useSearch();
  const { token, isAdminAccess, isCompanyAccess, isUserAccess, isExpired, refreshSession } = useAuth();

  const [_, setTick] = useState(0);
  const [isModalDetailOpen, setIsModalDetailOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [logs, setLogs] = useState([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Base URL sesuai role
  const baseUrl =
    isAdminAccess() || isCompanyAccess()
      ? `https://staging-backend.rbac.asj-shipagency.co.id/api/v1/company/1/log?page=1&order_by[]=full_name&sort_by[]=ASC`
      : `https://staging-backend.rbac.asj-shipagency.co.id/api/v1/app/company/1/log?page=1&order_by[]=full_name&sort_by[]=ASC`;

  const fetchLogs = async () => {
    try {
      if (isExpired()) await refreshSession();

      setLoading(true);
      setError("");

      const response = await axios.get(`${baseUrl}/log?page=${page}&order_by[]=full_name&sort_by[]=ASC`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const res = response.data;
      if (res?.success) {
        setLogs(res.data || []);
        setTotalPages(res?.last_page ?? 1);
      } else{
        addToast("error", res?.error);
      }
    } catch (err) {
      addToast(
        "error",
        err?.response?.data?.error ||
        err?.message ||
        "Terjadi masalah saat mengambil file."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSearch("");
    // fetchLogs();
  }, []);

  useEffect(() => {
    fetchLogs(page);
  }, [page]);

  // Tick untuk update last seen
  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const filteredLogs = logs.filter((log) =>
    (log.full_name || "").toLowerCase().includes(search.toLowerCase())
  );

  const openModal = (item) => {
    setModalData(item);
    setIsModalDetailOpen(true);
  };

  function renderTable() {
    if(loading){
      return <div className="w-full overflow-x-scroll scroll-custom rounded-lg">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#f8f8f8]">
            <tr className="border border-gray-200">
              <th className="px-4 py-3 font-inter font-medium text-[14px]">User</th>
              <th className="px-4 py-3 font-inter font-medium text-[14px]">Browser</th>
              <th className="px-4 py-3 font-inter font-medium text-[14px]">OS</th>
              <th className="px-4 py-3 font-inter font-medium text-[14px]">Last Seen</th>
              <th className="px-4 py-3 font-inter font-medium text-[14px]">Position</th>
              <th className="px-4 py-3 font-inter font-medium text-[14px]">IP</th>
              <th className="px-4 py-3 font-inter font-medium text-[14px]">City</th>
            </tr>
          </thead>

          <tbody>
            {error? 
                    <tr>
                      <td colSpan={7} className="text-center flex-col gap-2">
                        <p>{error}</p>
                        <button
                            className="
                              px-3 py-1
                              rounded
                              border-0
                              hover:border hover:border-gray-400
                              active:border active:border-gray-500
                              focus:outline-none focus:ring-2 focus:ring-gray-400
                              transition-all duration-150
                            "
                            onClick={()=>loadData()}
                          >
                            Klik muat ulang
                          </button>
                      </td>
                    </tr> : 
                    filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50 transition border-b border-gray-200">
                      <td className="px-4 py-3">
                        <div className="skeleton h-4 w-full"></div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="skeleton h-4 w-full"></div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="skeleton h-4 w-full"></div>
                      </td>
                      <td className="px-4 py-3">
                      <div className="skeleton h-4 w-full"></div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="skeleton h-4 w-full"></div>
                      </td>
                      <td className="px-4 py-3 text-[#007BFF]">
                        <div className="skeleton h-4 w-full"></div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="skeleton h-4 w-full"></div>
                      </td>
                    </tr>
                    ))
              }
          </tbody>
        </table>
      </div>;
    }
    return (
      <div className="w-full overflow-x-scroll scroll-custom rounded-lg">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#f8f8f8]">
            <tr className="border border-gray-200">
              <th className="px-4 py-3 font-inter font-medium text-[14px]">User</th>
              <th className="px-4 py-3 font-inter font-medium text-[14px]">Browser</th>
              <th className="px-4 py-3 font-inter font-medium text-[14px]">OS</th>
              <th className="px-4 py-3 font-inter font-medium text-[14px]">Last Seen</th>
              <th className="px-4 py-3 font-inter font-medium text-[14px]">Position</th>
              <th className="px-4 py-3 font-inter font-medium text-[14px]">IP</th>
              <th className="px-4 py-3 font-inter font-medium text-[14px]">City</th>
            </tr>
          </thead>

          <tbody>
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50 transition border-b border-gray-200">
                <td className="px-4 py-3">
                  <EllipsisTooltip className={"w-[200px]"}>{log.full_name}</EllipsisTooltip>
                </td>

                <td className="px-4 py-3">{log.browser_name || "-"}</td>
                <td className="px-4 py-3">{log.os_name || "-"}</td>

                <td className="px-4 py-3">
                  {log.latest_log_datetime
                    ? formatLastSeen(log.latest_log_datetime, null)
                    : "-"}
                </td>

                <td className="px-4 py-3">{log.job_identifier || "-"}</td>

                <td className="px-4 py-3 text-[#007BFF]">
                  <button onClick={() => openModal(log)}>
                    {log.ip_address || "-"}
                  </button>
                </td>

                <td className="px-4 py-3">{log.city || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  function renderPaging(){
        if(loading){
          return  <div className="flex items-center justify-center">
            <div className="skeleton h-4 w-32 mt-8"></div>
          </div>;
        } else if(error){
          return <></>;
        }
    
        return <Pagination
            className="mt-8"
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
  }

  return (
    <>
      <Navbar />

      <main className="flex-1 items-center p-6 overflow-auto">
        {renderTable()}
        {renderPaging()}
      </main>

      {(!loading && !error) && <ModalInfoIp
        open={isModalDetailOpen}
        onOpenChange={setIsModalDetailOpen}
        data={modalData}
      />}
    </>
  );
};

export default LogHistoryPage;

export function ModalInfoIp({ open, onOpenChange, data }) {
  if (!open) return null;

  return (
    <DialogModal open={open} onOpenChange={onOpenChange}>
      <DialogModalContent className="flex flex-col gap-0 p-0 sm:max-h-[min(640px,80vh)] sm:max-w-2xl">
        <DialogModalHeader>
          <DialogModalTitle className="px-6 py-4 font-inter font-bold text-[26px] text-[#1B2E48]">
            API Base URL Detail
          </DialogModalTitle>

          <div className="overflow-y-auto">
            <DialogModalDescription asChild>
              <div className="px-6 py-4">
                <table className="w-full border-separate border-spacing-y-4">
                  <tbody>
                    <tr>
                      <td className="py-2 px-4 font-semibold text-[#1B2E48] text-[16px] whitespace-nowrap w-[40%] align-top">
                        IP Address:
                      </td>
                      <td className="py-2 px-4 text-[16px] text-black">
                        {data?.ip_address || "-"}
                      </td>
                    </tr>

                    <tr>
                      <td className="py-2 px-4 font-semibold text-[#1B2E48] text-[16px] whitespace-nowrap align-top">
                        Country / State / City:
                      </td>
                      <td className="py-2 px-4 text-[16px] text-black break-all">
                        {data?.country || "-"}, {data?.state || "-"}, {data?.city || "-"}
                      </td>
                    </tr>

                    <tr>
                      <td className="py-2 px-4 font-semibold text-[#1B2E48] text-[16px] whitespace-nowrap align-top">
                        Time Zone & Local Time:
                      </td>
                      <td className="py-2 px-4 text-[16px] text-black">
                        {data?.latest_log_datetime
                        ? formatLastSeen(data?.latest_log_datetime, null)
                        : "-"}
                      </td>
                    </tr>

                    <tr>
                      <td className="py-2 px-4 font-semibold text-[#1B2E48] text-[16px] whitespace-nowrap align-top">
                        ASN Number & ASN Name:
                      </td>
                      <td className="py-2 px-4 text-[16px] text-black leading-relaxed">
                        {data?.asn_number || "-"} / {data?.asn_organization || "-"}
                      </td>
                    </tr>

                    <tr>
                      <td className="py-2 px-4 font-semibold text-[#1B2E48] text-[16px] whitespace-nowrap align-top">
                        ISP:
                      </td>
                      <td className="py-2 px-4 text-[16px] text-black leading-relaxed">
                        {data?.isp || "-"}
                      </td>
                    </tr>

                    <tr>
                      <td className="py-2 px-4 font-semibold text-[#1B2E48] text-[16px] whitespace-nowrap align-top">
                        Postal / ZIP Code:
                      </td>
                      <td className="py-2 px-4 text-[16px] text-black leading-relaxed">
                        {data?.postal_code || "-"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </DialogModalDescription>
          </div>
        </DialogModalHeader>
      </DialogModalContent>
    </DialogModal>
  );
}