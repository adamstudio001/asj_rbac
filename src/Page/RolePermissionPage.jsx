import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useSearch } from "../Providers/SearchProvider";
import Navbar from "@src/Components/Navbar";
import {TableActionMenu} from "@src/Components/TableActionMenu";
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
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { ToastProvider, useToast } from "@/Providers/ToastProvider";
import DeleteModal from "@/Components/DeleteModal";

const RolePermissionPage = () => {
  return (
    <ToastProvider>
      <RolePermissionContent />
    </ToastProvider>
  );
};

const RolePermissionContent = () => {
  const { search, setSearch } = useSearch();
  const [selectedRole, setSelectedRole] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const { addToast } = useToast();

  const roles = [
    { id: 1, role: "HR/GA", permission: ["create"]},
    { id: 2, role: "Finance", permission: []},
    { id: 3, role: "Operation", permission: []},
    { id: 4, role: "Developer", permission: []},
  ];

  useEffect(()=>{
      setSearch("");
  },[]);

  const filteredRoles = roles.filter(user =>
    user.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar
        renderActionModal={()=>
          <button
            onClick={() => {
              setSelectedRole(null);
              setIsModalOpen(true);
            }}
            className="bg-[#1e3264] text-white px-4 py-2 rounded-md font-medium hover:bg-[#15234a] transition"
          >
            + New Role
          </button>
        }
      />
      
      <main className="flex-1 items-center p-6 overflow-auto">
        <div className="w-full overflow-x-scroll rounded-lg">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F3F3F3]">
              <tr className="border border-gray-200">
                <th className="px-4 py-3 w-10"></th>
                <th className="px-4 py-3 font-inter font-medium text-[14px] text-black">Role</th>
                <th className="px-4 py-3 font-inter font-medium text-[14px] text-black">Permission</th>
              </tr>
            </thead>
            <tbody>
              {filteredRoles.map((role) => (
                <tr
                  key={role.id}
                  className="hover:bg-gray-50 transition border-b border-gray-200"
                >
                  <td className="px-4 py-3">
                    <TableActionMenu>
                      <button
                        className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => alert("Read")}
                      >
                        {/* <FaLock className="mr-2 text-gray-500" /> */}
                        Read
                      </button>
                       <button
                        className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => alert("View")}
                      >
                        {/* <Eye className="mr-2 text-red-500" /> */}
                        View
                      </button>
                      <button
                        className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => alert("Edit")}
                      >
                        {/* <FaUserEdit className="mr-2 text-gray-500" /> */}
                        Edit
                      </button>
                      <button
                        className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-50"
                        onClick={() => setIsModalDeleteOpen(true)}
                      >
                        {/* <FaTrash className="mr-2 text-red-500" /> */}
                        Delete
                      </button>
                    </TableActionMenu>
                  </td>
                  <td className="px-4 py-3 font-inter text-[14px] leading-[14px]">{role.role}</td>
                  <td className="px-4 py-3 font-inter text-[14px] leading-[14px]">{
                      role.permission.map(p => <span className="px-2 py-1 bg-green-400 rounded rounded-xl">{p}</span>)  
                  }</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <DeleteModal
          isOpen={isModalDeleteOpen}
          onClose={() => setIsModalDeleteOpen(false)}
          onConfirm={() => {
            setIsModalDeleteOpen(false);
            addToast("success", "Deleted successfully");
          }}
      />

      <ModalRole
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        data={selectedRole}
        mode={selectedRole ? "edit" : "create"}
      />
    </>
  );
};

export default RolePermissionPage;

export function ModalRole({ open, onOpenChange, data = null, mode = "create" }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      role: data?.role ?? "",
    },
  });

  const { addToast } = useToast();

  useEffect(() => {
    reset({
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
            {mode === "create" ? "Add New Role" : "Edit Role"}
          </DialogTitle>

          <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto">
            <DialogDescription asChild>
              <div className="px-6 py-4 space-y-8">
                {/* General Information */}
                <div>
                  <div className="space-y-6">
                    <div className="flex flex-wrap gap-4">
                      <div className="flex-1 ">
                        <Label>Role</Label>
                        <Input
                          type="text"
                          {...register("role", {
                            required: "Role is required",
                            minLength: { value: 2, message: "Too short" },
                          })}
                        />
                        {errors.role && (
                          <p className="text-sm text-red-500">
                            {errors.role.message}
                          </p>
                        )}
                      </div>
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