import React, { useEffect, useState } from "react";
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
} from "@/components/ui/dialogModal";
import { useForm, Controller } from "react-hook-form";
import { ToastProvider, useToast } from "@/Providers/ToastProvider";
import DeleteModal from "@/Components/DeleteModal";
import MultipleSelector from "@/Components/ui/multiselect";
import EllipsisTooltip from "@/Components/EllipsisTooltip";
import { v4 as uuidv4 } from 'uuid';
import CustomInput from "@/Components/CustomInput";

const permissions = [
    { value: "read", label: "read" },
    { value: "edit", label: "edit" },
    { value: "delete", label: "delete" },
    { value: "view", label: "view" },
];

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
    { id: 1, role: "HR/GA", permission: [permissions[0]]},
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
        <div className="w-full overflow-x-scroll scroll-custom rounded-lg">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F3F3F3]">
              <tr className="border border-gray-200">
                <th className="px-4 py-3 w-10"></th>
                <th className="px-4 py-3 font-inter font-medium text-[14px] text-black min-w-0 w-[250px]">Role</th>
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
                        className="flex gap-2 items-center w-full px-3 py-2 text-sm text-sm text-[#424242] hover:bg-[#F4F4F4] hover:text-[#242424]"
                        onClick={() => {
                          setSelectedRole(role);
                          setIsModalOpen(true);
                        }}
                      >
                        {/* <FaUserEdit className="mr-2 text-gray-500" /> */}
                        Edit
                      </button>
                      <button
                        className="flex gap-2 items-center w-full px-3 py-2 text-sm text-sm text-[#424242] hover:bg-[#F4F4F4] hover:text-[#242424]"
                        onClick={() => setIsModalDeleteOpen(true)}
                      >
                        {/* <FaTrash className="mr-2 text-red-500" /> */}
                        Delete
                      </button>
                    </TableActionMenu>
                  </td>
                  <td className="px-4 py-3 font-inter text-[14px] leading-[14px]">
                      <EllipsisTooltip className={"w-[250px]"}>{role.role}</EllipsisTooltip>
                  </td>
                  <td className="px-4 py-3 font-inter text-[14px] leading-[14px]">{
                      role.permission.map(p => <span key={uuidv4()} className="px-2 py-1 bg-green-400 rounded rounded-xl">{p.label}</span>)  
                  }</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <DeleteModal
          message={"Are you sure want to delete this role?"}
          isOpen={isModalDeleteOpen}
          onClose={() => setIsModalDeleteOpen(false)}
          onConfirm={() => {
            setIsModalDeleteOpen(false);
            addToast("error", "Deleted failed");
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
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      role: data?.role ?? "",
      permission: data?.permission ?? [], // default permission (kosong atau dari data)
    },
  });

  const { addToast } = useToast();

  useEffect(() => {
    reset({
      role: data?.role ?? "",
      permission: data?.permission ?? [],
    });
  }, [data, reset]);

  const onSubmit = (values) => {
    if (values.permission.length === 0) {
      // fallback tambahan (safeguard)
      addToast("error", "Permission cannot be empty");
      return;
    }

    console.log(mode === "create" ? "Creating:" : "Editing:", values);
    reset();
    onOpenChange(false);
    addToast("success", "Save successfully");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col gap-0 p-0 max-h-[min(640px,80vh)] sm:max-w-md overflow-visible">
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
                        <CustomInput
                          label="Role"
                          name="role"
                          type="role"
                          register={register}
                          errors={errors}
                          rules={{
                            required: "Role is required",
                            minLength: { value: 2, message: "Too short" },
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Permission Field */}
                  <div className="space-y-6 mt-3">
                    <div className="flex flex-wrap gap-4">
                      <div className="flex-1 ">
                        <Label>Permissions</Label>

                        <Controller
                          name="permission"
                          control={control}
                          rules={{
                            required: "At least one permission is required",
                            validate: (value) =>
                              value.length > 0 || "At least one permission is required",
                          }}
                          render={({ field }) => (
                            <MultipleSelector
                              {...field}
                              portal={true}
                              appendTo={document.body}
                              className="border-[1.2px] border-black bg-transparent px-3 py-3"
                              commandProps={{
                                label: "Select Permission",
                              }}
                              defaultOptions={permissions}
                              placeholder="Select Permission"
                              hideClearAllButton
                              hidePlaceholderWhenSelected
                              emptyIndicator={
                                <p className="text-center text-sm">
                                  No results found
                                </p>
                              }
                            />
                          )}
                        />

                        {errors.permission && (
                          <p className="text-sm text-red-500">
                            {errors.permission.message}
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