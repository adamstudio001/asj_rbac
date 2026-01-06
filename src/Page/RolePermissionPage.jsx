import React, { useEffect, useMemo, useState } from "react";
import { useSearch } from "../Providers/SearchProvider";
import Navbar from "@src/Components/Navbar";
import CustomSelect from "@/Components/CustomSelect";
import { Button } from "@/Components/ui/Button";
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
import EllipsisTooltip from "@/Components/EllipsisTooltip";
import { v4 as uuidv4 } from "uuid";
import CustomInput from "@/Components/CustomInput";
import { cn } from "@/lib/utils";
import { TableActionMenuImage } from "@/Components/TableActionMenuV2";
import change_role from "@/assets/change_role.svg";
import add_team from "@/assets/add_team.svg";
import { Checkbox } from "@/Components/ui/Checkbox";
import { useAuth } from "@/Providers/AuthProvider";
import axios from "axios";
import { Textarea } from "@/Components/ui/Textarea";

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
  const [isModalPermissionOpen, setIsModalPermissionOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [isLoad, setIsLoad] = useState(false);
  const { addToast } = useToast();
  const [jobs, setJobs] = useState([]);
  const [branches, setBranches] = useState([]);
  const [sortConfig, setSortConfig] = useState({});
  const [selectedIds, setSelectedIds] = useState([]);
  const { token, isAdminAccess, isCompanyAccess, isExpired, refreshSession } =
    useAuth();

  const datas = [
    {
      id: 1,
      employId: "#29112025001",
      user: "Desy Puji Astuti",
      role: "Super Admin",
      position: "HR/GA",
      permission: [],
    },
    {
      id: 2,
      employId: "#29112025002",
      user: "Hani Ayu Wulandari",
      role: "Admin Legal",
      position: "Tax",
      permission: [],
    },
    {
      id: 3,
      employId: "#29112025003",
      user: "Rahul",
      role: "User",
      position: "Legal",
      permission: [],
    },
    {
      id: 4,
      employId: "#29112025004",
      user: "Dika",
      role: "User",
      position: "OPS",
      permission: [],
    },
  ];

  useEffect(() => {
    setSearch("");
    loadData();
  }, []);

  async function loadData() {
    if (isExpired()) {
      refreshSession();
    }

    if (isAdminAccess() || isCompanyAccess()) {
      setIsLoad(true);
      setTimeout(async () => {
        try {
          const [jobsRes, branchesRes] = await Promise.allSettled([
            axios.get(
              "https://staging-backend.rbac.asj-shipagency.co.id/api/v1/helper/job",
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            ),
            axios.get(
              "https://staging-backend.rbac.asj-shipagency.co.id/api/v1/helper/branch-location",
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            ),
          ]);

          const jobs =
            jobsRes.status === "fulfilled"
              ? jobsRes.value.data?.data || []
              : [];
          const branches =
            branchesRes.status === "fulfilled"
              ? branchesRes.value.data?.data || []
              : [];

          setJobs(jobs);
          setBranches(branches);
        } catch (err) {
          console.error(err);
          addToast("error", "ada masalah pada aplikasi");
        } finally {
          setIsLoad(false);
        }
      }, 1500);
    }
  }

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
    let result = datas.filter((user) =>
      user.role.toLowerCase().includes(search.toLowerCase())
    );

    const activeSorts = Object.entries(sortConfig).filter(
      ([_, dir]) => dir !== null
    );

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

  const SortableTh = ({ column, className, left, children }) => {
    return (
      <th
        className={cn(
          "px-4 py-3 font-inter font-medium text-[14px] text-black select-none",
          className
        )}
      >
        <div className="flex items-center gap-2">
          {/* SLOT KIRI (checkbox / icon / dll) */}
          {left && <div onClick={(e) => e.stopPropagation()}>{left}</div>}

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

  function renderTable() {
    if (isLoad) {
      return (
        <table className="w-full table-auto border-collapse">
          <thead className="bg-[#F3F3F3]">
            <tr className="border border-gray-200">
              <th className="px-4 py-3 w-10"></th>
              <th className="px-4 py-3 font-inter font-medium text-[14px] text-black text-left min-w-0 w-[200px]">
                List User
              </th>
              <th className="px-4 py-3 font-inter font-medium text-[14px] text-black text-left">
                Employe ID
              </th>
              <th className="px-4 py-3 font-inter font-medium text-[14px] text-black text-left">
                Role
              </th>
              <th className="px-4 py-3 font-inter font-medium text-[14px] text-black text-left">
                Position
              </th>
              <th className="px-4 py-3 font-inter font-medium text-[14px] text-black text-left">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {Array(3)
              .fill(null)
              .map((_, i) => (
                <tr key={i}>
                  <td className="border px-4 py-2">
                    <div className="skeleton h-4 w-full"></div>
                  </td>
                  <td className="border px-4 py-2">
                    <div className="skeleton h-4 w-full"></div>
                  </td>
                  <td className="border px-4 py-2">
                    <div className="skeleton h-4 w-full"></div>
                  </td>
                  <td className="border px-4 py-2">
                    <div className="skeleton h-4 w-full"></div>
                  </td>
                  <td className="border px-4 py-2">
                    <div className="skeleton h-4 w-full"></div>
                  </td>
                  <td className="border px-4 py-2">
                    <div className="skeleton h-4 w-full"></div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      );
    }

    return (
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
            <th className="px-4 py-3 font-inter font-medium text-[14px] text-black">
              Employe ID
            </th>
            <th className="px-4 py-3 font-inter font-medium text-[14px] text-black">
              Role
            </th>
            <th className="px-4 py-3 font-inter font-medium text-[14px] text-black">
              Position
            </th>
            <th className="px-4 py-3 font-inter font-medium text-[14px] text-black">
              Action
            </th>
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
                  }}
                />
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
                  {/* <button
                    className="mx-2 flex gap-2 items-center w-[-webkit-fill-available] rounded px-2 py-2 text-sm text-sm text-[#424242] hover:bg-[#F4F4F4] hover:text-[#242424]"
                    onClick={() => {}}
                  >
                    <img src={view_profile} alt="view profile" />
                    View Profile
                  </button> */}
                  <button
                    className="mx-2 flex gap-2 items-center w-[-webkit-fill-available] rounded px-2 py-2 text-sm text-sm text-[#424242] hover:bg-[#F4F4F4] hover:text-[#242424]"
                    onClick={() => {}}
                  >
                    <img src={add_team} alt="view profile" />
                    Add to team
                  </button>
                  <button
                    className="mx-2 flex gap-2 items-center w-[-webkit-fill-available] rounded px-2 py-2 text-sm text-sm text-[#424242] hover:bg-[#F4F4F4] hover:text-[#242424]"
                    onClick={() => {
                      console.log(data)
                      setSelectedRole(data);
                      setIsModalPermissionOpen(true);
                    }}
                  >
                    <img src={change_role} alt="view profile" />
                    Change Permission
                  </button>
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
    );
  }

  return (
    <>
      <Navbar
        renderActionModal={() => {}}
      />

      <main className="flex-1 items-center p-6 overflow-auto scroll-custom">
        <div className="w-full rounded-lg">
          {" "}
          {/* overflow-x-scroll scroll-custom  */}
          {renderTable()}
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

      <ModalPermission
        open={isModalPermissionOpen}
        onOpenChange={setIsModalPermissionOpen}
        data={selectedRole}
      />

      <ModalRole
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        data={selectedRole}
        mode={selectedRole ? "edit" : "add"}
      />
    </>
  );
};

export default RolePermissionPage;

export function ModalPermission({ open, onOpenChange, data }) {
  const { token, isAdminAccess, isCompanyAccess, isExpired, refreshSession } =
    useAuth();

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
  const accessGroups = [
    {
      title: "General",
      items: ["View user", "View log history", "View IP address"],
    },
    {
      title: "Role Access",
      items: [
        "Add new role",
        "Change role",
        "Delete role",
        "Change permission",
        "Add to team",
        "View history",
      ],
    },
    {
      title: "User",
      items: [
        "Add new user",
        "View user",
        "Edit user",
        "Delete user",
        "Reset password user",
      ],
    },
    {
      title: "File Management",
      columns: [
        [
          "Upload file",
          "Download file",
          "Remove file/folder",
          "Create folder",
          "Delete folder",
          "Get Info file/folder",
          "View HR/GA folder",
          "View legal folder",
          "View FDA folder",
          "View commercial folder",
          "View tax folder",
          "View finance folder",
          "View operation folder",
          "Download secret file",
          "Manage division folder",
          "Unlock/lock folder/file",
        ],
      ],
    },
  ];

  const getAllPermissions = (accessGroups) => {
    return accessGroups.flatMap(group => {
      if (group.items) return group.items;
      if (group.columns) return group.columns.flat();
      return [];
    });
  };

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
          <DialogModalTitle className="px-6 pt-4 font-inter font-bold text-[22px] text-[#1B2E48]">
            Change Permission
          </DialogModalTitle>
        </DialogModalHeader>

        {/* BODY */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full min-h-0 overflow-y-auto overflow-x-hidden scroll-custom"
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

              <div>
                <h2 className="font-inter font-bold text-[20px] text-[#1B2E48]">
                  Select Access
                </h2>

                {/* ACCESS LIST – FLEX */}
                <Controller
                  name="permission"
                  control={control}
                  render={({ field }) => {
                    const allPermissions = getAllPermissions(accessGroups);

                    const isAllChecked =
                      allPermissions.length > 0 &&
                      allPermissions.every(p => field.value.includes(p));

                    return (
                      <>
                        {isAdminAccess() && <>
                          <label className="grid grid-cols-[20px_1fr] gap-x-3 items-start cursor-pointer select-none mb-6 mt-3">
                            <Checkbox
                              checked={isAllChecked}
                              onCheckedChange={(checked) => {
                                field.onChange(checked ? allPermissions : []);
                              }}
                              className="w-5 h-5"
                            />
                            <span className="text-sm font-medium text-[#1B2E48]">
                              Select all access
                            </span>
                          </label>
                        </>}

                        <PermissionGroup
                          accessGroups={accessGroups}
                          field={field} 
                          className={!isAdminAccess()? "mt-3":""}
                        />
                      </>
                    )
                  }}
                />
              </div>
            </div>
          </DialogModalDescription>

          {/* FOOTER */}
          <DialogModalFooter className="px-6 py-6 shrink-0 items-center">
            <Button
              type="submit"
              className="w-full max-w-[20cqi] bg-[#1a2f48] hover:bg-[#1a2f48]/80 text-white"
            >
              Save
            </Button>
          </DialogModalFooter>
        </form>
      </DialogModalContent>
    </DialogModal>
  );
}

function PermissionGroup({ accessGroups, field, className }) {
  const general = accessGroups.find(g => g.title === "General");
  const role = accessGroups.find(g => g.title === "Role Access");
  const user = accessGroups.find(g => g.title === "User");
  const file = accessGroups.find(g => g.title === "File Management");

  return (
    <div className={cn(`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`, className)}>
      {/* KOLOM 1 */}
      <div className="flex flex-col gap-10">
        <PermissionSection group={general} field={field} />
        <PermissionSection group={user} field={field} />
      </div>

      {/* KOLOM 2 */}
      <PermissionSection group={role} field={field} />

      {/* KOLOM 3 */}
      <PermissionSection group={file} field={field} />
    </div>
  );
}

function PermissionSection({ group, field }) {
  if (!group) return null;

  const isFileManagement =
    group.title.toLowerCase() === "file management";

  // Normalisasi data
  const items = group.items ?? group.columns?.flat() ?? [];

  const useTwoColumns = isFileManagement && items.length > 11;

  // Split item untuk File Management
  const columns = useMemo(() => {
    if (!useTwoColumns) return [items];

    const mid = Math.ceil(items.length / 2);
    return [items.slice(0, mid), items.slice(mid)];
  }, [items, useTwoColumns]);

  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-semibold text-[16px] text-[#5B84D6]">
        {group.title}
      </h3>

      {/* ISI */}
      <div
        className={`grid gap-x-8 gap-y-3 ${
          useTwoColumns ? "grid-cols-2" : "grid-cols-1"
        }`}
      >
        {columns.map((col, idx) => (
          <div key={idx} className="flex flex-col gap-3">
            {col.map(item => (
              <PermissionItem
                key={item}
                label={item}
                field={field}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

const PermissionItem = ({ label, field }) => {
  const checked = field.value.includes(label);

  return (
    <label className="grid grid-cols-[20px_1fr] gap-x-3 items-start cursor-pointer select-none">
      <Checkbox
        checked={checked}
        onCheckedChange={(isChecked) => {
          if (isChecked) {
            field.onChange([...field.value, label]);
          } else {
            field.onChange(field.value.filter((v) => v !== label));
          }
        }}
        className="w-5 h-5"
      />
      <span className="text-sm text-[#1B2E48] leading-snug break-words">
        {label}
      </span>
    </label>
  )
}

export function ModalRole({
  data,
  open,
  onOpenChange,
}) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: data?.user ?? "",
      role: "",
    },
  });

  useEffect(() => {
    reset({
      name: data?.user ?? "",
      role: "",
    });
  }, [data, reset]);

  const { addToast } = useToast();
  const listRole = [
    {
      identifier: "super_admin",
      label: "Super Admin",
    },
    {
      identifier: "admin",
      label: "Admin",
    },
    {
      identifier: "user",
      label: "User",
    },
  ];

  const onSubmit = (values) => {
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
          sm:max-w-lg
          overflow-hidden
        "
      >
        {/* HEADER */}
        <DialogModalHeader className="shrink-0">
          <DialogModalTitle className="px-6 pt-4 font-inter font-bold text-[22px] text-[#1B2E48]">
            Change Role
          </DialogModalTitle>
        </DialogModalHeader>

        {/* BODY (SCROLL AREA) */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 min-h-0 overflow-y-auto scroll-custom"
        >
          <DialogModalDescription asChild>
            <div className="px-6 space-y-6">
              <CustomInput
                label="Name"
                name="name"
                register={register}
                errors={errors}
                rules={{
                  required: "Name is required",
                }}
                disabled
              />

              <Controller
                  name="role"
                  control={control}
                  rules={{ required: "Role is required" }}
                  render={({ field }) => (
                    <CustomSelect
                      label="Select Role"
                      records={listRole}
                      // sourceUrl="https://staging-backend.rbac.asj-shipagency.co.id/api/v1/helper/job"
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.role?.message}
                    />
                  )}
                />

              <div className="mt-40"></div>
            </div>
          </DialogModalDescription>

          {/* FOOTER (TETAP DI DALAM FORM TAPI TIDAK SCROLL KELUAR) */}
          <DialogModalFooter className="px-6 py-6 shrink-0 items-center">
            <Button
              type="submit"
              className="w-full max-w-[20cqi] bg-[#1a2f48] hover:bg-[#1a2f48]/80 text-white"
            >
              Save
            </Button>
          </DialogModalFooter>
        </form>
      </DialogModalContent>
    </DialogModal>
  );
}
