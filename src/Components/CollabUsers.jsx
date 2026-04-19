import React, { useState } from "react";

export default function CollabUsers({ users = [] }) {
  const visible = users.slice(0, 3);
  const remain = users.length - 3;

  const [hoverText, setHoverText] = useState("");

  const colors = [
    "bg-red-500","bg-orange-500","bg-amber-500","bg-yellow-500","bg-lime-500",
    "bg-green-500","bg-emerald-500","bg-teal-500","bg-cyan-500","bg-sky-500",
    "bg-blue-500","bg-indigo-500","bg-violet-500","bg-purple-500","bg-fuchsia-500",
    "bg-pink-500","bg-rose-500","bg-red-600","bg-orange-600","bg-amber-600",
    "bg-yellow-600","bg-lime-600","bg-green-600","bg-emerald-600","bg-teal-600",
    "bg-cyan-600","bg-sky-600","bg-blue-600","bg-indigo-600","bg-violet-600",
    "bg-purple-600","bg-fuchsia-600","bg-pink-600","bg-rose-600","bg-red-700",
    "bg-orange-700","bg-amber-700","bg-green-700","bg-emerald-700","bg-teal-700",
    "bg-cyan-700","bg-sky-700","bg-blue-700","bg-indigo-700","bg-violet-700",
    "bg-purple-700","bg-fuchsia-700","bg-pink-700","bg-rose-700","bg-slate-700",
  ];

  // FIX: pakai id + index + name supaya user dengan nama sama tetap beda warna
  const getColor = (user, index) => {
    const name = user?.employment?.user?.full_name || "User";
    const uid =
      user?.employment?.user?.id ||
      user?.employment_id ||
      user?.owner_user_id ||
      0;

    const seed = `${name}-${uid}-${index}`;

    const hash = seed
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);

    return colors[hash % colors.length];
  };

  return (
    <div className="relative flex items-center">
      {visible.map((u, index) => {
        const name = u?.employment?.user?.full_name || "User";

        return (
          <div
            key={`${u?.employment?.user?.id}-${index}`}
            onMouseEnter={() => setHoverText(name)}
            onMouseLeave={() => setHoverText("")}
            className={`-ml-2 first:ml-0 h-7 w-7 rounded-full text-white text-xs flex items-center justify-center border-2 border-white cursor-pointer shadow-sm ${getColor(
              u,
              index
            )}`}
          >
            {name.charAt(0).toUpperCase()}
          </div>
        );
      })}

      {remain > 0 && (
        <div
          onMouseEnter={() =>
            setHoverText(
              users
                .slice(3)
                .map((x) => x?.employment?.user?.full_name || "User")
                .join(", ")
            )
          }
          onMouseLeave={() => setHoverText("")}
          className="-ml-2 h-7 px-2 rounded-full bg-gray-200 text-xs flex items-center justify-center border-2 border-white cursor-pointer"
        >
          +{remain}
        </div>
      )}

      {hoverText && (
        <div className="absolute left-0 top-10 z-50 whitespace-nowrap rounded-md bg-black px-3 py-2 text-xs text-white shadow-xl">
          {hoverText}
        </div>
      )}
    </div>
  );
}