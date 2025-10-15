import React, { useEffect, useState } from "react";
import { FaUserEdit, FaLock, FaTrash } from "react-icons/fa";
import Navbar from "@src/Components/Navbar";
import { useSearch } from "@src/Providers/SearchProvider";
import { TableActionMenu } from "@src/Components/TableActionMenu";
import DeleteModal from "@src/Components/DeleteModal";
import Pagination from "@src/Components/Pagination";
import { ToastProvider, useToast } from "@src/Providers/ToastProvider";
import reset from "@assets/reset.svg";
import trash from "@assets/trash.svg";
import user_edit from "@assets/user_edit.svg";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { useForm } from "react-hook-form";
import { formatLastSeen } from "@/Common/Utils";
import EllipsisTooltip from "@/Components/EllipsisTooltip";

const UserPage = () => {
  return (
    <ToastProvider>
      <UserPageContent />
    </ToastProvider>
  );
};

const UserPageContent = () => {
  const { search, setSearch } = useSearch();
  const { addToast } = useToast();

  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [tick, setTick] = useState(0);
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const totalPages = 6;

  const users = [
    {
      id: 1,
      firstName: "Desy",
      lastName: "Puji Astuti",
      email: "admin@gmail.com",
      whatsapp: "087870590000",
      branch: "Jakarta",
      lastLogin: {start: "2025-01-01 01:00:00", end: "2025-10-07 10:12:00"},
      jobPosition: "HR/GA",
    },
    {
      id: 2,
      firstName: "Hani",
      lastName: "Ayu Wulansari",
      email: "admin@gmail.com",
      whatsapp: "087870590000",
      branch: "Jakarta",
      lastLogin: {start: "2025-01-01 01:00:00", end: "2025-10-07 10:12:00"},
      jobPosition: "Finance",
    },
    {
      id: 3,
      firstName: "Rahul",
      lastName: "",
      email: "admin@gmail.com",
      whatsapp: "087870590000",
      branch: "Jakarta",
      lastLogin: {start: "2025-01-01 01:00:00", end: "2025-10-07 10:12:00"},
      jobPosition: "Operation",
    },
    {
      id: 4,
      firstName: "Dika",
      lastName: "",
      email: "admin@gmail.com",
      whatsapp: "087870590000",
      branch: "Jakarta",
      lastLogin: {start: "2025-10-13 15:00:00", end: null},
      jobPosition: "Operation",
    },
  ];

  useEffect(() => setSearch(""), []);

  useEffect(() => {
      const interval = setInterval(() => {
        setTick((t) => t + 1);
      }, 500);
  
      return () => clearInterval(interval);
  }, []);

  const filteredUsers = users.filter((user) =>
    user.firstName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar
        renderActionModal={()=>
          <button
            onClick={() => {
              setSelectedUser(null);
              setIsModalOpen(true);
            }}
            className="bg-[#1e3264] text-white px-4 py-2 rounded-md font-medium hover:bg-[#15234a] transition"
          >
            + New User
          </button>
        }
      />

      <main className="flex-1 items-center p-6 overflow-auto">
        <div className="w-full overflow-x-scroll rounded-lg">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F3F3F3]">
              <tr className="border border-gray-200">
                <th className="px-4 py-3 w-10"></th>
                <th className="px-4 py-3 font-inter font-medium text-[14px] text-black text-left min-w-0 w-[200px]">
                  Name
                </th>
                <th className="px-4 py-3 font-inter font-medium text-[14px] text-black text-left">
                  Email
                </th>
                <th className="px-4 py-3 font-inter font-medium text-[14px] text-black text-left">
                  Position
                </th>
                <th className="px-4 py-3 font-inter font-medium text-[14px] text-black text-left">
                  Last Seen
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition border-b border-gray-200"
                >
                  <td className="px-4 py-3">
                    <TableActionMenu>
                      {/* Edit User */}
                      <button
                        className="flex gap-2 items-center w-full px-3 py-2 text-sm text-[#979797] hover:bg-[#1B2E48] hover:text-white"
                        onClick={() => {
                          setSelectedUser(user);
                          setIsModalOpen(true);
                        }}
                      >
                        <img src={user_edit} alt="download" className="w-4 h-4 hover:text-white"/>
                        Edit User
                      </button>

                      {/* Reset Password */}
                      <button
                        className="flex gap-2 items-center w-full px-3 py-2 text-sm text-[#979797] hover:bg-[#1B2E48] hover:text-white"
                        onClick={() =>
                          alert(`Reset password for ${user.firstName}`)
                        }
                      >
                        <img src={reset} alt="download" className="w-4 h-4"/>
                        Reset Password
                      </button>

                      {/* Delete User */}
                      <button
                        className="flex gap-2 items-center w-full px-3 py-2 text-sm text-[#979797] hover:bg-[#1B2E48] hover:text-white"
                        onClick={() => setIsModalDeleteOpen(true)}
                      >
                        <img src={trash} alt="download" className="w-4 h-4"/>
                        Delete User
                      </button>
                    </TableActionMenu>
                  </td>

                  <td className="px-4 py-3 font-inter text-[14px] leading-[14px] text-gray-800">
                    <EllipsisTooltip className={"w-[200px]"}>{`${user.firstName} ${user.lastName || ""}`.trim()}</EllipsisTooltip>
                  </td>
                  <td className="px-4 py-3 font-inter text-[14px] leading-[14px] text-gray-800">
                    {user.email}
                  </td>
                  <td className="px-4 py-3 font-inter text-[14px] leading-[14px] text-gray-800">
                    {user.jobPosition}
                  </td>
                  <td className="px-4 py-3 font-inter text-[14px] leading-[14px] text-gray-800">
                    {formatLastSeen(user.lastLogin.start, user.lastLogin.end)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          className="mt-8"
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </main>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={isModalDeleteOpen}
        onClose={() => setIsModalDeleteOpen(false)}
        onConfirm={() => {
          setIsModalDeleteOpen(false);
          addToast("success", "Deleted successfully");
        }}
      />

      {/* Add / Edit Modal */}
      <ModalUser
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        data={selectedUser}
        mode={selectedUser ? "edit" : "create"}
      />
    </>
  );
};

export default UserPage;

export function ModalUser({ open, onOpenChange, data = null, mode = "create" }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      firstName: data?.firstName ?? "",
      lastName: data?.lastName ?? "",
      whatsapp: data?.whatsapp ?? "",
      password: data?.password ?? "",
      email: data?.email ?? "",
      jobPosition: data?.jobPosition ?? "",
      branch: data?.branch ?? "",
      role: data?.role ?? "",
    },
  });

  const { addToast } = useToast();
  
  useEffect(() => {
    reset({
      firstName: data?.firstName ?? "",
      lastName: data?.lastName ?? "",
      whatsapp: data?.whatsapp ?? "",
      password: data?.password ?? "",
      email: data?.email ?? "",
      jobPosition: data?.jobPosition ?? "",
      branch: data?.branch ?? "",
      role: data?.role ?? "",
    });
  }, [data, reset]);

  const onSubmit = (values) => {
    console.log(mode === "create" ? "Creating:" : "Editing:", values);
    reset();
    onOpenChange(false);
    addToast("success", "Save successfully");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col gap-0 p-0 sm:max-h-[min(640px,80vh)] sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle className="px-6 py-4 font-inter font-bold text-[22px] text-[#1B2E48]">
            {mode === "create" ? "Add New User" : "Edit User"}
          </DialogTitle>

          <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto">
            <DialogDescription asChild>
              <div className="px-6 py-4 space-y-8">
                {/* General Information */}
                <div>
                  <h5 className="font-inter font-bold text-lg text-[#1B2E48] pb-4">
                    General Information
                  </h5>

                  <div className="space-y-6">
                    <div className="flex flex-wrap gap-4">
                      <div className="flex-1 min-w-[250px]">
                        <Label>First Name</Label>
                        <Input
                          type="text"
                          {...register("firstName", {
                            required: "First name is required",
                            minLength: { value: 2, message: "Too short" },
                          })}
                        />
                        {errors.firstName && (
                          <p className="text-sm text-red-500">
                            {errors.firstName.message}
                          </p>
                        )}
                      </div>

                      <div className="flex-1 min-w-[250px]">
                        <Label>Last Name</Label>
                        <Input
                          type="text"
                          {...register("lastName", {
                            required: "Last name is required",
                          })}
                        />
                        {errors.lastName && (
                          <p className="text-sm text-red-500">
                            {errors.lastName.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4">
                      <div className="flex-1 min-w-[250px]">
                        <Label>Whatsapp No</Label>
                        <Input type="text" 
                          {...register("whatsapp", {
                            required: "Whatsapp is required",
                          })}/>
                          {errors.whatsapp && (
                            <p className="text-sm text-red-500">
                              {errors.whatsapp.message}
                            </p>
                          )}
                      </div>

                      <div className="flex-1 min-w-[250px]">
                        <Label>Password</Label>
                        <Input
                          type="password"
                          disabled={mode!="create"}
                          {...register("password", {
                            required: "Password is required",
                            minLength: { value: 6, message: "Min 6 chars" },
                          })}
                        />
                        {errors.password && (
                          <p className="text-sm text-red-500">
                            {errors.password.message}
                          </p>
                        )}
                      </div>

                      <div className="flex-1 min-w-[250px]">
                        <Label>Email</Label>
                        <Input
                          type="text"
                          {...register("email", {
                            required: "Email is required",
                          })}
                        />
                        {errors.email && (
                          <p className="text-sm text-red-500">
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Professional Info */}
                <div>
                  <h5 className="font-inter font-bold text-lg text-[#1B2E48] pb-4">
                    Professional Information
                  </h5>

                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap gap-4">
                      <div className="flex-1 min-w-[250px]">
                        <Label>Job Position</Label>
                        <Input
                          type="text"
                          {...register("jobPosition", {
                            required: "Job position is required",
                          })}
                        />
                        {errors.jobPosition && (
                          <p className="text-sm text-red-500">
                            {errors.jobPosition.message}
                          </p>
                        )}
                      </div>

                      <div className="flex-1 min-w-[250px]">
                        <Label>Branch</Label>
                        <Input
                          type="text"
                          disabled={mode!="create"}
                          {...register("branch", {
                            required: "Branch is required",
                          })}
                        />
                        {errors.branch && (
                          <p className="text-sm text-red-500">
                            {errors.branch.message}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-4">
                      <div className="flex-1 min-w-[250px]">
                        <Label>Role</Label>
                        <Input
                          type="text"
                          disabled={mode!="create"}
                          {...register("role", {
                            required: "Role is required",
                          })}
                        />
                        {errors.role && (
                          <p className="text-sm text-red-500">
                            {errors.role.message}
                          </p>
                        )}
                      </div>
                      <div className="flex-1 min-w-[250px]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </DialogDescription>

            <DialogFooter className="px-6 pb-6 items-center">
              <Button
                type="submit"
                className="w-full max-w-[300px] bg-[#1a2f48] hover:bg-[#1a2f48]/80 text-white"
              >
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}