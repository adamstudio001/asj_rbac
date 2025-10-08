import React, { useEffect, useState } from "react";
import { formatDistanceToNowStrict, isValid } from "date-fns";
import clsx from "clsx";
import Navbar from "@src/Components/Navbar";
import { useSearch } from "@src/Providers/SearchProvider";

const LogHistoryPage = () => {
  const { search, setSearch } = useSearch();
  const [tick, setTick] = useState(0);

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
    { id: 1, user: "Desy Puji Astuti", browser: "Chrome", os: "Mac OS", duration: "27 mins", lastSee: {start: "2025-01-01 01:00:00", end: "2025-10-07 10:12:00"}, role: "HR/GA" },
    { id: 2, user: "Hani Ayu Wulasari", browser: "Safari", os: "Windows", duration: "11 mins", lastSee: {start: "2025-10-01 01:00:00", end: "2025-10-07 10:12:00" }, role: "HR/GA" },
    { id: 3, user: "Rahul", browser: "Chrome", os: "Windows", duration: "8 mins", lastSee: {start: "2025-10-07 10:00:00", end: "2025-10-07 10:12:00" }, role: "HR/GA" },
    { id: 4, user: "Dika", browser: "Chrome", os: "Windows", duration: "1 mins", lastSee: {start: "2025-10-07 10:12:00", end: null}, role: "HR/GA" },
  ];

  function isValidDateTime(dateString) {
    if(dateString==null){
      return true;
    }

    const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
    if (!regex.test(dateString)) return false;

    const parsed = new Date(dateString);
    return isValid(parsed);
  }

  function formatLastSeen(start, end) {
    if (!isValidDateTime(start) || (end && !isValidDateTime(end))) {
      return "Invalid date format";
    }

    const startDate = new Date(start);
    const endDate = end == null? new Date() : new Date(end);

    const diffSec = Math.floor((endDate - startDate) / 1000);

    const days = Math.floor(diffSec / 86400);
    const hours = Math.floor((diffSec % 86400) / 3600);
    const minutes = Math.floor((diffSec % 3600) / 60);
    const seconds = diffSec % 60;

    if (days === 0 && hours === 0 && minutes === 0) {
      return `${seconds} seconds ago`;
    }
    if (days === 0 && hours === 0) {
      return `${minutes}:${seconds.toString().padStart(2, "0")} minutes ago`;
    }

    return formatDistanceToNowStrict(startDate, { addSuffix: true, now: endDate });
  }

  const filteredLogs = logs.filter(log =>
    log.user.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />

      <main className="flex-1 items-center p-6 overflow-auto">
          <div className="w-full overflow-hidden rounded-lg border border-gray-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#f8f8f8] text-black font-medium">
                  <tr>
                    <th className="px-4 py-3">User</th>
                    <th className="px-4 py-3">Browser</th>
                    <th className="px-4 py-3">Operating System</th>
                    <th className="px-4 py-3">Duration</th>
                    <th className="px-4 py-3">Last Seen</th>
                    <th className="px-4 py-3">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="px-4 py-3">{log.user}</td>
                      <td className="px-4 py-3">{log.browser}</td>
                      <td className="px-4 py-3">{log.os}</td>
                      <td className="px-4 py-3">{log.duration}</td>
                      <td className="px-4 py-3 flex items-center gap-2">
                        <div className={clsx("w-3 h-3 rounded-full", log.lastSee.end==null? "bg-green-400":"bg-red-400")}></div>
                        {formatLastSeen(log.lastSee.start, log.lastSee.end)}
                      </td>
                      <td className="px-4 py-3">{log.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        </main>
    </>
  );
};

export default LogHistoryPage;
