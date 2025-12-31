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
import { Checkbox } from "@/Components/ui/Checkbox";
import { Labelx } from "@/Components/ui/Labelx";

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
        renderActionModal={()=>{}}
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
                    <Checkbox
                      checked={allChecked}
                      onCheckedChange={(checked) => {
                        if (checked) {
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
                      <Checkbox 
                        key={data.id}
                        checked={selectedIds.includes(data.id)}
                        onCheckedChange={(checked) => {
                          setSelectedIds((prev) =>
                            checked
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
                      {/* <button
                        className="mx-2 flex gap-2 items-center w-[-webkit-fill-available] rounded px-2 py-2 text-sm text-sm text-[#424242] hover:bg-[#F4F4F4] hover:text-[#242424]"
                        onClick={() => {}}
                      >
                        <img src={edit_employee} alt="view profile" /> 
                        Edit Employee
                      </button> */}
                      <button
                        className="mx-2 flex gap-2 items-center w-[-webkit-fill-available] rounded px-2 py-2 text-sm text-sm text-[#424242] hover:bg-[#F4F4F4] hover:text-[#242424]"
                        onClick={() => {
                          setSelectedRole(data);
                          setIsModalOpen(true);
                        }}
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

export function ModalRole({ open, onOpenChange, data = null}) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: data?.user ?? "",
      permission: [], // default permission (kosong atau dari data)
    },
  });

  const { addToast } = useToast();
  const accessList = [
    "Upload file - Filemanagement",
    "New Folder - Filemanagement",
    "Edit User",
    "Remove User",
    "Reset Password",
    "New User",
    "Change Role",
    "Log History",
    "Detail - Log History",
  ];

  useEffect(() => {
    reset({
      name: data?.user ?? "",
      permission: [],
    });
  }, [data, reset]);

  const onSubmit = (values) => {
    if (values.permission.length === 0) {
      // fallback tambahan (safeguard)
      addToast("error", "Permission cannot be empty");
      return;
    }

    console.log(values);
    reset();
    onOpenChange(false);
    addToast("success", "Save successfully");
  };

  return (
    <DialogModal open={open} onOpenChange={onOpenChange}>
  <DialogModalContent
    className="
      flex flex-col
      p-0
      max-h-[min(640px,80vh)]
      sm:max-w-5xl
      overflow-hidden
    "
  >
    {/* HEADER */}
    <DialogModalHeader className="shrink-0">
      <DialogModalTitle className="px-6 py-4 font-inter font-bold text-[22px] text-[#1B2E48]">
          Change Role
        </DialogModalTitle>
      </DialogModalHeader>

      {/* BODY (SCROLL AREA) */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex-1 min-h-0 overflow-y-auto scroll-custom"
      >
        <DialogModalDescription asChild>
          <div className="px-6 space-y-8">
            <CustomInput
              label="Name"
              name="name"
              register={register}
              disabled
              errors={errors}
              rules={{}}
            />

            <h2 className="font-inter font-bold text-[20px] text-[#1B2E48]">
              Select Access
            </h2>

            {/* GRID ACCESS LIST */}
            <Controller
              name="permission"
              control={control}
              render={({ field }) => (
                <div
                  className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    gap-x-6
                    gap-y-4
                  "
                >
                  {accessList.map((item) => {
                    const checked = field.value.includes(item);

                    return (
                      <label
                        key={item}
                        className="
                          grid
                          grid-cols-[20px_1fr]
                          gap-x-3
                          items-start
                          cursor-pointer
                          select-none
                        "
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(isChecked) => {
                            if (isChecked) {
                              field.onChange([...field.value, item]);
                            } else {
                              field.onChange(
                                field.value.filter((v) => v !== item)
                              );
                            }
                          }}
                          className="w-5 h-5 shrink-0"
                        />

                        <span className="text-sm text-[#1B2E48] break-words leading-snug">
                          {item}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            />
          </div>
        </DialogModalDescription>

        {/* FOOTER (TETAP DI DALAM FORM TAPI TIDAK SCROLL KELUAR) */}
        <DialogModalFooter className="px-6 py-6 shrink-0">
          <Button
            type="submit"
            className="w-full bg-[#1a2f48] hover:bg-[#1a2f48]/80 text-white"
          >
            Save
          </Button>
        </DialogModalFooter>
      </form>
    </DialogModalContent>
  </DialogModal>
  );
}