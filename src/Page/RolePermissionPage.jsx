import React, { useEffect, useMemo, useState } from "react";
import { useSearch } from "../Providers/SearchProvider";
import Navbar from "@src/Components/Navbar";
// import {TableActionMenu} from "@src/Components/TableActionMenu";
import { Button } from "@/Components/ui/Button";
import { Label } from "@/Components/ui/Label";
import {
  DialogModal,
  DialogModalClose,
  DialogModalContent,
  DialogModalDescription,
  DialogModalFooter,
  DialogModalHeader,
  DialogModalTitle,
  DialogModalTrigger,
} from "@/Components/ui/DialogModal";
import { useForm, Controller } from "react-hook-form";
import { useToast } from "@/Providers/ToastProvider";
import DeleteModal from "@/Components/DeleteModal";
import MultipleSelector from "@/Components/ui/MultipleSelector";
import EllipsisTooltip from "@/Components/EllipsisTooltip";
import { v4 as uuidv4 } from 'uuid';
import CustomInput from "@/Components/CustomInput";
import { cn } from "@/lib/utils";
import { TableActionMenuImage } from "@/Components/TableActionMenuV2";
import change_role from "@/assets/change_role.svg";
import edit_employee from "@/assets/edit_employee.svg";
import add_team from "@/assets/add_team.svg";
import view_profile from "@/assets/view_profile.svg";

const permissions = [
    { value: "read", label: "read" },
    { value: "edit", label: "edit" },
    { value: "delete", label: "delete" },
    { value: "view", label: "view" },
];

const RolePermissionPage = () => {
  return (
    // <ToastProvider>
      <RolePermissionContent />
    // </ToastProvider>
  );
};

const RolePermissionContent = () => {
  const { search, setSearch } = useSearch();
  const [selectedRole, setSelectedRole] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const { addToast } = useToast();
  const [sortConfig, setSortConfig] = useState({});
  const [selectedIds, setSelectedIds] = useState([]);

  const datas = [
    { id: 1, employId: "#29112025001", user: "Desy Puji Astuti", role: "Super Admin", position: "HR/GA", permission: []},
    { id: 2, employId: "#29112025002", user: "Hani Ayu Wulandari", role: "Admin Legal", position: "Tax", permission: []},
    { id: 3, employId: "#29112025003", user: "Rahul", role: "User", position: "Legal", permission: []},
    { id: 4, employId: "#29112025004", user: "Dika", role: "User", position: "OPS", permission: []},
    // { id: 5, employId: "#29112025001", user: "Desy Puji Astuti", role: "Super Admin", position: "HR/GA", permission: []},
    // { id: 6, employId: "#29112025001", user: "Desy Puji Astuti", role: "Super Admin", position: "HR/GA", permission: []},
    // { id: 7, employId: "#29112025001", user: "Desy Puji Astuti", role: "Super Admin", position: "HR/GA", permission: []},
    // { id: 8, employId: "#29112025001", user: "Desy Puji Astuti", role: "Super Admin", position: "HR/GA", permission: []},
    // { id: 9, employId: "#29112025001", user: "Desy Puji Astuti", role: "Super Admin", position: "HR/GA", permission: []},
    // { id: 10, employId: "#29112025001", user: "Desy Puji Astuti", role: "Super Admin", position: "HR/GA", permission: []},
    // { id: 11, employId: "#29112025001", user: "Desy Puji Astuti", role: "Super Admin", position: "HR/GA", permission: []},
    // { id: 12, employId: "#29112025001", user: "Desy Puji Astuti", role: "Super Admin", position: "HR/GA", permission: []},
    // { id: 13, employId: "#29112025001", user: "Desy Puji Astuti", role: "Super Admin", position: "HR/GA", permission: []},
    // { id: 14, employId: "#29112025001", user: "Desy Puji Astuti", role: "Super Admin", position: "HR/GA", permission: []},
    // { id: 15, employId: "#29112025001", user: "Desy Puji Astuti", role: "Super Admin", position: "HR/GA", permission: []},
    // { id: 16, employId: "#29112025001", user: "Desy Puji Astuti", role: "Super Admin", position: "HR/GA", permission: []},
  ];

  useEffect(()=>{
      setSearch("");
  },[]);

  const handleSort = (key) => {
    setSortConfig((prev) => {
      const current = prev[key] ?? null;

      let next;
      if (current === null) next = "asc";
      else if (current === "asc") next = "desc";
      else next = null;

      return {
        ...prev,
        [key]: next,
      };
    });
  };

  const filteredDatas = useMemo(() => {
    let result = datas.filter(user =>
      user.role.toLowerCase().includes(search.toLowerCase())
    );

    const activeSorts = Object.entries(sortConfig)
      .filter(([_, dir]) => dir !== null);

    if (activeSorts.length === 0) {
      return result;
    }

    return [...result].sort((a, b) => {
      for (const [key, direction] of activeSorts) {
        let aVal = a[key];
        let bVal = b[key];

        aVal = aVal?.toString().toLowerCase() ?? "";
        bVal = bVal?.toString().toLowerCase() ?? "";

        if (aVal < bVal) return direction === "asc" ? -1 : 1;
        if (aVal > bVal) return direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [datas, search, sortConfig]);

  const allChecked =
    filteredDatas.length > 0 &&
    filteredDatas.every((row) => selectedIds.includes(row.id));

  const SortableTh = ({
    column,
    className,
    left,
    children,
  }) => {
    return (
      <th
        className={cn(
          "px-4 py-3 font-inter font-medium text-[14px] text-black select-none",
          className
        )}
      >
        <div className="flex items-center gap-2">
          {/* SLOT KIRI (checkbox / icon / dll) */}
          {left && (
            <div onClick={(e) => e.stopPropagation()}>
              {left}
            </div>
          )}

          {/* AREA SORTING */}
          <button
            type="button"
            onClick={() => handleSort(column)}
            className="flex items-center gap-2"
          >
            {children}

            <div className="flex flex-col leading-none gap-[2px]">
              <svg
                width="10"
                height="6"
                viewBox="0 0 10 6"
                className={
                  sortConfig[column] === "asc"
                    ? "fill-[#1e3264]"
                    : "fill-gray-400"
                }
              >
                <path d="M5 0L10 6H0L5 0Z" />
              </svg>

              <svg
                width="10"
                height="6"
                viewBox="0 0 10 6"
                className={`rotate-180 ${
                  sortConfig[column] === "desc"
                    ? "fill-[#1e3264]"
                    : "fill-gray-400"
                }`}
              >
                <path d="M5 0L10 6H0L5 0Z" />
              </svg>
            </div>
          </button>
        </div>
      </th>
    );
  };

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
      
      <main className="flex-1 items-center p-6 overflow-auto scroll-custom">
        <div className="w-full rounded-lg"> {/* overflow-x-scroll scroll-custom  */}
         <table className="w-full text-left text-sm">
            <thead className="bg-[#F3F3F3]">
              <tr className="border border-gray-200">
                <SortableTh
                  column="user"
                  className="w-[250px]"
                  left={
                    <input
                      type="checkbox"
                      checked={allChecked}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedIds(filteredDatas.map((r) => r.id));
                        } else {
                          setSelectedIds([]);
                        }
                      }}
                    />
                  }
                >
                  List User
                </SortableTh>
                <th className="px-4 py-3 font-inter font-medium text-[14px] text-black">Employe ID</th>
                <th className="px-4 py-3 font-inter font-medium text-[14px] text-black">Role</th>
                <th className="px-4 py-3 font-inter font-medium text-[14px] text-black">Position</th>
                <th className="px-4 py-3 font-inter font-medium text-[14px] text-black">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredDatas.map((data) => (
                <tr
                  key={data.id}
                  className="hover:bg-gray-50 transition border-b border-gray-200"
                >
                  <td className="px-4 py-3 font-inter text-[14px] leading-[14px] flex gap-2">
                      <input 
                        type="checkbox" 
                        key={data.id}
                        checked={selectedIds.includes(data.id)}
                        onChange={(e) => {
                          setSelectedIds((prev) =>
                            e.target.checked
                              ? [...prev, data.id]
                              : prev.filter((id) => id !== data.id)
                          );
                        }}/> 
                      <EllipsisTooltip className={"w-[250px]"}>
                        {data.user}
                      </EllipsisTooltip>
                  </td>
                  <td className="px-4 py-3 font-inter text-[14px] leading-[14px]">
                      {data.employId}
                  </td>
                  <td className="px-4 py-3 font-inter text-[14px] leading-[14px]">
                      {data.role}
                  </td>
                  <td className="px-4 py-3 font-inter text-[14px] leading-[14px]">
                      {data.position}
                  </td>
                  <td className="px-4 py-3 font-inter text-[14px] leading-[14px]">
                    <TableActionMenuImage>
                      <button
                        className="mx-2 flex gap-2 items-center w-[-webkit-fill-available] rounded px-2 py-2 text-sm text-sm text-[#424242] hover:bg-[#F4F4F4] hover:text-[#242424]"
                        onClick={() => {
                          setSelectedRole(null);
                          setIsModalOpen(true);
                        }}
                      >
                        <img src={view_profile} alt="view profile" /> 
                        View Profile
                      </button>
                      <button
                        className="mx-2 flex gap-2 items-center w-[-webkit-fill-available] rounded px-2 py-2 text-sm text-sm text-[#424242] hover:bg-[#F4F4F4] hover:text-[#242424]"
                        onClick={() => {}}
                      >
                        <img src={add_team} alt="view profile" /> 
                        Add to team
                      </button>
                      <button
                        className="mx-2 flex gap-2 items-center w-[-webkit-fill-available] rounded px-2 py-2 text-sm text-sm text-[#424242] hover:bg-[#F4F4F4] hover:text-[#242424]"
                        onClick={() => {}}
                      >
                        <img src={edit_employee} alt="view profile" /> 
                        Edit Employee
                      </button>
                      <button
                        className="mx-2 flex gap-2 items-center w-[-webkit-fill-available] rounded px-2 py-2 text-sm text-sm text-[#424242] hover:bg-[#F4F4F4] hover:text-[#242424]"
                        onClick={() => {}}
                      >
                        <img src={change_role} alt="view profile" /> 
                        Change role
                      </button>
                      {/* <button
                        className="flex gap-2 items-center w-full px-3 py-2 text-sm text-sm text-[#424242] hover:bg-[#F4F4F4] hover:text-[#242424]"
                        onClick={() => setIsModalDeleteOpen(true)}
                      >
                        Delete
                      </button> */}
                    </TableActionMenuImage>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <DeleteModal
          titleMessage="Delete Role Permission"
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
    <DialogModal open={open} onOpenChange={onOpenChange}>
      <DialogModalContent className="flex flex-col gap-0 p-0 max-h-[min(640px,80vh)] sm:max-w-md overflow-visible">
        <DialogModalHeader>
          <DialogModalTitle className="px-6 py-4 font-inter font-bold text-[22px] text-[#1B2E48]">
            {mode === "create" ? "Add New Role" : "Edit Role"}
          </DialogModalTitle>

          <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto scroll-custom">
            <DialogModalDescription asChild>
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
            </DialogModalDescription>

            <DialogModalFooter className="px-6 pb-6 items-center">
              <Button
                type="submit"
                className="w-full max-w-[300px] bg-[#1a2f48] hover:bg-[#1a2f48]/80 text-white"
              >
                Save
              </Button>
            </DialogModalFooter>
          </form>
        </DialogModalHeader>
      </DialogModalContent>
    </DialogModal>
  );
}