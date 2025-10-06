import React, { useState } from 'react';
import { NavLink, useLocation } from "react-router-dom";
import { IoNotificationsOutline } from "react-icons/io5";
import { LiaHomeSolid } from "react-icons/lia";
// import { IoIosArrowDown } from "react-icons/io";
import Logo from "@assets/logo.png";

import { FaRegUser } from "react-icons/fa6";
import { BsPersonLock } from "react-icons/bs";
import { GoGear } from "react-icons/go";
import clsx from 'clsx';

const SidebarItem = ({ icon: Icon, label, size=20, isActive = false, to="#" }) => {
  const active = "text-[#497fff] bg-[#e5eaf7]";
  const noactive = "text-[#656565]";
  const padding = "px-[1.2rem] py-[.8rem]";

  return (
    <li className={clsx(
          `text-base rounded-lg hover:${active} `,
          isActive
            ? active
            : noactive,
             padding
    )}>
      <NavLink
        to={to}
        className={"flex items-center gap-[0.7rem]"}
      >
        <Icon size={18} />
        <span>{label}</span>
      </NavLink>
    </li>
  );
};

// const SidebarSection = ({ title, items }) => {
//   const [isOpen, setIsOpen] = useState(true);

//   return (
//     <div className="mt-6">
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="flex items-center w-full text-[#656565] text-[12px] uppercase pl-[1.2rem] pr-[.6rem] focus:outline-none"
//       >
//         <h2 className="text-gray-500 mr-2 text-left">{title}</h2>
//         <IoIosArrowDown
//           size={14}
//           className={`transform transition-transform duration-200 ${isOpen ? 'rotate-0' : '-rotate-90'}`}
//         />
//       </button>
//       <ul className={`space-y-2 mt-2 overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[500px]' : 'max-h-0'}`}>
//         {items}
//       </ul>
//     </div>
//   );
// };

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <aside className="w-64 h-screen overflow-auto bg-gray-100">
      <nav className="h-full flex flex-col justify-between">
        <div className='p-2'>
            <div className="w-full flex justify-center">
                <img src={Logo} alt="logo" className='w-[120px] aspect-square'/>
            </div>
            <ul className="mt-4">
                <SidebarItem icon={LiaHomeSolid} label="File Management" to={"/filemanager"} isActive={["/filemanager"].some((p) => currentPath.startsWith(p))}/>
                <SidebarItem icon={FaRegUser} label="Users" size={16} to={"/users"} isActive={["/users"].some((p) => currentPath.startsWith(p))}/>
                <SidebarItem icon={BsPersonLock} label="Role & Permissions" isActive={["/role_permission"].some((p) => currentPath.startsWith(p))}/>
                <SidebarItem icon={IoNotificationsOutline} label="Log History" isActive={["/log"].some((p) => currentPath.startsWith(p))}/>
                <SidebarItem icon={GoGear} label="Settings" />
            </ul>
        </div>

        <button onClick={()=>alert("fungsi logout")} className="p-8 border-t border-grey hover:bg-gray-300">Logout</button>

        {/* <div>
          <ul className="space-y-1">
            <SidebarItem icon={LiaHomeSolid} label="Home" />
            <SidebarItem icon={IoGrid} label="Workspace" isActive />
            <SidebarItem icon={IoIosSearch} label="Search" />
            <SidebarItem icon={IoNotificationsOutline} label="Notifications" />
          </ul>
        </div>

        <SidebarSection
          title="Workspaces"
          items={
            <>
              <SidebarItem icon={SlPicture} label="Collage" />
              <SidebarItem icon={AiOutlineFile} label="Work" />
              <SidebarItem icon={AiOutlineFile} label="Family" />
              <SidebarItem icon={IoMusicalNotesOutline} label="Others" />
            </>
          }
        />

        <SidebarSection
          title="Categories"
          items={
            <>
              <SidebarItem icon={SlPicture} label="Photos" />
              <SidebarItem icon={AiOutlineFile} label="Video" />
              <SidebarItem icon={AiOutlineFile} label="Documents" />
              <SidebarItem icon={IoMusicalNotesOutline} label="Audio" />
              <SidebarItem icon={FaUsers} label="Share with me" />
            </>
          }
        /> */}

      </nav>
    </aside>
  );
};

export default Sidebar;
