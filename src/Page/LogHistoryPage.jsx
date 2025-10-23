import React, { useEffect, useState } from "react";
import Navbar from "@src/Components/Navbar";
import { useSearch } from "@src/Providers/SearchProvider";
import { formatLastSeen } from "@/Common/Utils";
import EllipsisTooltip from "@/Components/EllipsisTooltip";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialogModal";

const LogHistoryPage = () => {
  const { search, setSearch } = useSearch();
  const [tick, setTick] = useState(0);
  const [isModalDetailOpen, setIsModalDetailOpen] = useState(false);

  useEffect(()=>{
    setSearch("");
  },[]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const logs = [
    { id: 1, user: "Desy Puji Astuti", browser: "Chrome", os: "Mac OS", duration: "27 mins", lastSee: {start: "2025-01-01 01:00:00", end: "2025-10-07 10:12:00"}, role: "HR/GA", ip: "8.8.8.8", city: "Bogor" },
    { id: 2, user: "Hani Ayu Wulasari", browser: "Safari", os: "Windows", duration: "11 mins", lastSee: {start: "2025-10-01 01:00:00", end: "2025-10-07 10:12:00" }, role: "HR/GA", ip: "8.8.8.8", city: "Bogor" },
    { id: 3, user: "Rahul", browser: "Chrome", os: "Windows", duration: "8 mins", lastSee: {start: "2025-10-07 10:00:00", end: "2025-10-07 10:12:00" }, role: "HR/GA", ip: "8.8.8.8", city: "Bogor" },
    { id: 4, user: "Dika", browser: "Chrome", os: "Windows", duration: "1 mins", lastSee: {start: "2025-10-07 10:12:00", end: null}, role: "HR/GA", ip: "8.8.8.8", city: "Bogor" },
  ];

  const filteredLogs = logs.filter(log =>
    log.user.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />

      <main className="flex-1 items-center p-6 overflow-auto">
          <div className="w-full overflow-x-scroll scroll-custom rounded-lg">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#f8f8f8]">
                  <tr className="border border-gray-200">
                    <th className="px-4 py-3 font-inter font-medium text-[14px] text-black min-w-0 w-[250px]">User</th>
                    <th className="px-4 py-3 font-inter font-medium text-[14px] text-black">Browser</th>
                    <th className="px-4 py-3 font-inter font-medium text-[14px] text-black">Operating System</th>
                    <th className="px-4 py-3 font-inter font-medium text-[14px] text-black">Duration</th>
                    <th className="px-4 py-3 font-inter font-medium text-[14px] text-black">Last Seen (?)</th>
                    <th className="px-4 py-3 font-inter font-medium text-[14px] text-black">Role</th>
                    <th className="px-4 py-3 font-inter font-medium text-[14px] text-black">IP Address</th>
                    <th className="px-4 py-3 font-inter font-medium text-[14px] text-black">City</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="hover:bg-gray-50 transition border-b border-gray-200"
                    >
                      <td className="px-4 py-3 font-inter text-[14px] leading-[14px]">
                        <EllipsisTooltip className={"w-[250px]"}>{log.user}</EllipsisTooltip>
                      </td>
                      <td className="px-4 py-3 font-inter text-[14px] leading-[14px]">{log.browser}</td>
                      <td className="px-4 py-3 font-inter text-[14px] leading-[14px]">{log.os}</td>
                      <td className="px-4 py-3 font-inter text-[14px] leading-[14px]">{log.duration}</td>
                      <td className="px-4 py-3 font-inter text-[14px] leading-[14px]">
                        <span className={`inline-block align-middle w-3 h-3 rounded-full mr-2 ${log.lastSee.end == null ? 'bg-[#62de00]' : 'bg-[#ff0405]'}`} />
                        <p className="inline align-middle m-0">
                          {formatLastSeen(log.lastSee.start, log.lastSee.end)}
                        </p>
                      </td>
                      <td className="px-4 py-3 font-inter text-[14px] leading-[14px]">{log.role}</td>
                      <td className="px-4 py-3 font-inter text-[14px] text-[#007BFF]">
                        <button onClick={()=>setIsModalDetailOpen(!isModalDetailOpen)}>{log.ip}</button>
                      </td>
                      <td className="px-4 py-3 font-inter text-[14px] leading-[14px]">{log.city}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        </main>

        <ModalInfoIp
              open={isModalDetailOpen}
              onOpenChange={setIsModalDetailOpen}
            />
    </>
  );
};

export default LogHistoryPage;

export function ModalInfoIp({ open, onOpenChange, data }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col gap-0 p-0 sm:max-h-[min(640px,80vh)] sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="px-6 py-4 font-inter font-bold text-[26px] text-[#1B2E48]">
            IP Address Detail
          </DialogTitle>

          <div className="overflow-y-auto">
            <DialogDescription asChild>
              <div className="px-6 py-4">
                <table className="w-full border-separate border-spacing-y-4">
                  <tbody>
                    <tr>
                      <td className="py-2 px-4 font-semibold text-[#1B2E48] text-[16px] whitespace-nowrap align-top w-[40%]">
                        IP Address:
                      </td>
                      <td className="py-2 px-4 text-[16px] text-black">
                        {data?.ip || "123.45.67.89"}
                      </td>
                    </tr>

                    <tr>
                      <td className="py-2 px-4 font-semibold text-[#1B2E48] text-[16px] whitespace-nowrap align-top">
                        Country / State / City:
                      </td>
                      <td className="py-2 px-4 text-[16px] text-black">
                        {data?.location || "Indonesia, Jawa Barat, Kota Bogor"}
                      </td>
                    </tr>

                    <tr>
                      <td className="py-2 px-4 font-semibold text-[#1B2E48] text-[16px] whitespace-nowrap align-top">
                        Latitude / Longitude (Estimation):
                      </td>
                      <td className="py-2 px-4 text-[16px] text-black">
                        {data?.latlong || "-6.3850, 106.8200"}
                      </td>
                    </tr>

                    <tr>
                      <td className="py-2 px-4 font-semibold text-[#1B2E48] text-[16px] whitespace-nowrap align-top">
                        Time Zone & Local Time:
                      </td>
                      <td className="py-2 px-4 text-[16px] text-black leading-relaxed">
                        {data?.timezone || "Asia/Jakarta (UTC+7)"} <br />
                        {data?.localtime || "2025-10-17 14:30 WIB"}
                      </td>
                    </tr>

                    <tr>
                      <td className="py-2 px-4 font-semibold text-[#1B2E48] text-[16px] whitespace-nowrap align-top">
                        ASN Number & ASN Name:
                      </td>
                      <td className="py-2 px-4 text-[16px] text-black">
                        {data?.asn || "ASNA1121, Nama ASN"}
                      </td>
                    </tr>

                    <tr>
                      <td className="py-2 px-4 font-semibold text-[#1B2E48] text-[16px] whitespace-nowrap align-top">
                        ISP / Organization:
                      </td>
                      <td className="py-2 px-4 text-[16px] text-black">
                        {data?.isp || "PT. Telkom Indonesia"}
                      </td>
                    </tr>

                    <tr>
                      <td className="py-2 px-4 font-semibold text-[#1B2E48] text-[16px] whitespace-nowrap align-top">
                        Postal / ZIP Code:
                      </td>
                      <td className="py-2 px-4 text-[16px] text-black">
                        {data?.zip || "164451"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </DialogDescription>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}