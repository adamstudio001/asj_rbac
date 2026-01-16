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
import change_permission from "@/assets/permissions.svg";
import { Checkbox } from "@/Components/ui/Checkbox";
import { useAuth } from "@/Providers/AuthProvider";
import axios from "axios";
import CustomTextArea from "@/Components/CustomTextArea";
import { IoMdAdd } from "react-icons/io";
import { buildHeaders } from "@/Common/Utils";

const RolePermissionPage = () => {
  return (
    // <ToastProvider>
    <RolePermissionContent />
    // </ToastProvider>
  );
};

const RolePermissionContent = () => {
  const { search, setSearch } = useSearch();
  const [selectedData, setSelectedData] = useState(null);
  const [isModalPermissionOpen, setIsModalPermissionOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalNewOpen, setIsModalNewOpen] = useState(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [isLoad, setIsLoad] = useState(false);
  const { addToast } = useToast();

  const [datas, setDatas] = useState([]);
  const [listRole, setListRole] = useState([]);
  const [listPermission, setListPermissions] = useState([]);

  const [sortConfig, setSortConfig] = useState({});
  const [selectedIds, setSelectedIds] = useState([]);
  const {
    token,
    hasPermission,
    isAdminAccess,
    isCompanyAccess,
    isUserAccess,
    isExpired,
    refreshSession,
  } = useAuth();

  // const datas = [
  //   {
  //     id: 1,
  //     employId: "#29112025001",
  //     user: "Desy Puji Astuti",
  //     role: "Super Admin",
  //     position: "HR/GA",
  //     permission: [],
  //   },
  //   {
  //     id: 2,
  //     employId: "#29112025002",
  //     user: "Hani Ayu Wulandari",
  //     role: "Admin Legal",
  //     position: "Tax",
  //     permission: [],
  //   },
  //   {
  //     id: 3,
  //     employId: "#29112025003",
  //     user: "Rahul",
  //     role: "User",
  //     position: "Legal",
  //     permission: [],
  //   },
  //   {
  //     id: 4,
  //     employId: "#29112025004",
  //     user: "Dika",
  //     role: "User",
  //     position: "OPS",
  //     permission: [],
  //   },
  // ];

  useEffect(() => {
    setSearch("");
    loadData();
  }, []);

  const isAdmin = isAdminAccess() || isCompanyAccess();

  async function loadData() {
    if (isExpired()) {
      await refreshSession();
    }

    if (isAdmin) {
      setIsLoad(true);
      setTimeout(async () => {
        try {
          const [roleOriRes, roleRes, userRes, permissionRes] =
            await Promise.allSettled([
              axios.get(
                "https://staging-backend.rbac.asj-shipagency.co.id/api/v1/company/1/role",
                {
                  headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
                }
              ),
              axios.get(
                "https://staging-backend.rbac.asj-shipagency.co.id/api/v1/company/1/role/role-with-user",
                {
                  headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
                }
              ),
              axios.get(
                `https://staging-backend.rbac.asj-shipagency.co.id/api/v1/company/1/user`, //?page=${page}
                {
                  headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
                }
              ),
              axios.get(
                "https://staging-backend.rbac.asj-shipagency.co.id/api/v1/helper/permission",
                {
                  headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
                }
              ),
            ]);

          const roleOris =
            roleOriRes.status === "fulfilled"
              ? roleOriRes.value.data?.data || []
              : [];

          const roles =
            roleRes.status === "fulfilled"
              ? roleRes.value.data?.data || []
              : [];

          const users =
            userRes.status === "fulfilled"
              ? userRes.value.data?.data || []
              : [];

          const permissions =
            permissionRes.status === "fulfilled"
              ? permissionRes.value.data?.data || []
              : [];

          setDatas(userRoleAdapter(users, roles));
          setListRole(roleAdapter(roleOris));
          setListPermissions(permissions);
        } catch (err) {
          console.error(err);
          addToast("error", "ada masalah pada aplikasi");
        } finally {
          setIsLoad(false);
        }
      }, 1500);
    }
  }

  function buildUserRoleMap(apiRolesResponse = []) {
    const map = new Map();

    apiRolesResponse.forEach((role) => {
      role.employment?.forEach((emp) => {
        if (!emp.user_id) return;

        const existing = map.get(emp.user_id) ?? [];

        map.set(emp.user_id, [
          ...existing,
          {
            id: role.id,
            name: role.name,
            permission_list: role.permission_list ?? [],
          },
        ]);
      });
    });

    return map;
  }

  function userRoleAdapter(apiUsersResponse = [], apiRolesResponse = []) {
    if (!Array.isArray(apiUsersResponse)) return [];

    const roleMap = buildUserRoleMap(apiRolesResponse);

    return apiUsersResponse.map((user) => {
      const employment = user.employment?.[0] ?? null;
      const roles = roleMap.get(user.id) ?? [];

      return {
        id: user.id,
        full_name: user.full_name,
        employee_id: employment?.employee_id ?? "",
        role: roles.map((r) => ({
          identifier: r.id,
          label: r.name,
        })),
        permissions: [...new Set(roles.flatMap((r) => r.permission_list))],
        position: employment?.job_identifier ?? "",
      };
    });
  }

  function roleAdapter(apiResponse = []) {
    if (!Array.isArray(apiResponse)) return [];

    return apiResponse.flatMap((role) => {
      const roleName = role.name;
      const roleId = role.id;

      return { identifier: roleId, label: roleName };
    });
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
    let result = datas.filter((data) =>
      data.full_name.toLowerCase().includes(search.toLowerCase())
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

  // const allChecked =
  //   filteredDatas.length > 0 &&
  //   filteredDatas.every((row) => selectedIds.includes(row.id));

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

  const hasGrantedButtonNewRole = isAdmin || hasPermission("ADD_NEW_ROLE");

  const hasGrantedShowButtonAction =
    hasPermission("CHANGE_PERMISSIONS") ||
    hasPermission("CHANGE_ROLE") ||
    isAdmin;

  const hasGrantedButtonPermission =
    hasPermission("CHANGE_PERMISSIONS") || isAdmin;

  const hasGrantedButtonRole = hasPermission("CHANGE_ROLE") || isAdmin;

  function renderTable() {
    if (isLoad) {
      return (
        <table className="w-full table-auto border-collapse">
          <thead className="bg-[#F3F3F3]">
            <tr className="border border-gray-200">
              {/* <th className="px-4 py-3 w-10"></th> */}
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
                  {/* <td className="border px-4 py-2">
                    <div className="skeleton h-4 w-full"></div>
                  </td> */}
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
              left={<></>}
              // <Checkbox
              //   checked={allChecked}
              //   onCheckedChange={(checked) => {
              //     if (checked) {
              //       setSelectedIds(filteredDatas.map((r) => r.id));
              //     } else {
              //       setSelectedIds([]);
              //     }
              //   }}
              // />
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
                {/* <Checkbox
                  key={data.id}
                  checked={selectedIds.includes(data.id)}
                  onCheckedChange={(checked) => {
                    setSelectedIds((prev) =>
                      checked
                        ? [...prev, data.id]
                        : prev.filter((id) => id !== data.id)
                    );
                  }}
                /> */}
                <EllipsisTooltip className={"w-[250px]"}>
                  {data.full_name}
                </EllipsisTooltip>
              </td>
              <td className="px-4 py-3 font-inter text-[14px] leading-[14px]">
                {data.employee_id}
              </td>
              <td className="px-4 py-3 font-inter text-[14px] leading-[14px]">
                {Array.isArray(data.role) && data.role.length > 0
                  ? data.role.map((r) => r.label).join(", ")
                  : "-"}
              </td>
              <td className="px-4 py-3 font-inter text-[14px] leading-[14px]">
                {data.position}
              </td>
              <td className="px-4 py-3 font-inter text-[14px] leading-[14px]">
                {hasGrantedShowButtonAction && (
                  <TableActionMenuImage>
                    {/* <button
                      className="mx-2 flex gap-2 items-center w-[-webkit-fill-available] rounded px-2 py-2 text-sm text-sm text-[#424242] hover:bg-[#F4F4F4] hover:text-[#242424]"
                      onClick={() => {
                        setSelectedData(data);
                        setIsModalNewOpen(true);
                      }}
                    >
                      <img src={add_team} alt="view profile" />
                      Edit
                    </button> */}
                    {hasGrantedButtonPermission && (
                      <button
                        className="mx-2 flex gap-2 items-center w-[-webkit-fill-available] rounded px-2 py-2 text-sm text-sm text-[#424242] hover:bg-[#F4F4F4] hover:text-[#242424]"
                        onClick={() => {
                          setSelectedData(data);
                          setIsModalPermissionOpen(true);
                        }}
                      >
                        <img src={change_permission} alt="permission" />
                        Change Permission
                      </button>
                    )}
                    {hasGrantedButtonRole && (
                      <button
                        className="mx-2 flex gap-2 items-center w-[-webkit-fill-available] rounded px-2 py-2 text-sm text-sm text-[#424242] hover:bg-[#F4F4F4] hover:text-[#242424]"
                        onClick={() => {
                          if (
                            Array.isArray(data.role) &&
                            data.role.length > 1
                          ) {
                            addToast(
                              "error",
                              "tidak dapat ubah role karena sudah terdaftar role lebih dari 1"
                            );
                            return;
                          }

                          setSelectedData(data);
                          setIsModalOpen(true);
                        }}
                      >
                        <img src={change_role} alt="role" />
                        Change role
                      </button>
                    )}
                    {/* <button
                          className="flex gap-2 items-center w-full px-3 py-2 text-sm text-sm text-[#424242] hover:bg-[#F4F4F4] hover:text-[#242424]"
                          onClick={() => setIsModalDeleteOpen(true)}
                        >
                          Delete
                        </button> */}
                  </TableActionMenuImage>
                )}
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
        renderActionModal={() =>
          hasGrantedButtonNewRole ? (
            <button
              onClick={() => {
                setIsModalNewOpen(true);
                setSelectedData(null);
              }}
              className={`max-w-[24rem] flex max-sm:flex-1 items-center gap-3 bg-[#1B2E48] text-white font-inter font-medium text-[14px] px-4 py-2 rounded-md hover:bg-[#1b2e48d9] transition`}
            >
              <IoMdAdd /> Add Role
            </button>
          ) : (
            <></>
          )
        }
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
        data={selectedData}
        listPermission={listPermission}
        extraAction={() => loadData()}
      />

      <ModalRole
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        data={selectedData}
        listRole={listRole}
        extraAction={() => loadData()}
      />

      <ModalForm
        open={isModalNewOpen}
        data={selectedData}
        mode={selectedData ? "update" : "create"}
        onOpenChange={setIsModalNewOpen}
        extraAction={() => loadData()}
      />
    </>
  );
};

export default RolePermissionPage;

export function ModalPermission({
  open,
  onOpenChange,
  data,
  listPermission = [],
  extraAction = () => {},
}) {
  const {
    token,
    hasPermission,
    isExpired,
    refreshSession,
    isAdminAccess,
    isCompanyAccess,
  } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

  const accessGroups = listPermission;
  const getAllPermissions = (groups) => groups.flatMap((g) => g.permissions);
  const mapPermissionByIdentifier = (
    allPermissions,
    selectedIdentifiers = []
  ) => allPermissions.filter((p) => selectedIdentifiers.includes(p.identifier));

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: data?.full_name ?? "",
      permission: [],
    },
  });

  useEffect(() => {
    if (!data || !listPermission.length) return;

    const allPermissions = getAllPermissions(listPermission);

    const selectedPermissions = mapPermissionByIdentifier(
      allPermissions,
      data.permissions ?? []
    );

    reset({
      name: data?.full_name ?? "",
      permission: selectedPermissions,
    });
  }, [data, listPermission, reset]);

  const onSubmit = async (values) => {
    console.log("submit", values);
    if (
      data?.role === undefined ||
      data?.role === null ||
      (Array.isArray(data.role) && data.role.length == 0)
    ) {
      addToast("error", "anda belum memberikan role pada user ini");
      return;
    }
    if (!values.permission.length) {
      addToast("error", "Permission cannot be empty");
      return;
    }
    if (Array.isArray(data.role) && data.role.length > 1) {
      addToast(
        "error",
        "tidak dapat ubah role karena sudah terdaftar role lebih dari 1"
      );
      return;
    }

    if (isExpired()) {
      await refreshSession();
    }

    setLoading(true);

    try {
      console.log(values);
      const formData = {
        permission_identifier:
          values.permission.flatMap((p) => p.identifier) ?? [],
      };

      const info = JSON.parse(sessionStorage.getItem("info") || "{}");
      const headers = buildHeaders(info, token);

      const url = `https://staging-backend.rbac.asj-shipagency.co.id/api/v1/company/1/role/${data?.role?.[0]?.identifier}/permission`;
      const method = "put";

      const res = await axios({
        method,
        url,
        data: formData,
        headers,
      });

      const body = res.data;
      console.log(body);

      if (body.error) {
        addToast("error", body.error);
      } else if (body.success) {
        addToast("success", body.success);
        onOpenChange(false);
        extraAction();
      }
    } catch (err) {
      console.error(err);
      addToast("error", "ada masalah pada aplikasi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogModal open={open} onOpenChange={onOpenChange}>
      <DialogModalContent className="flex flex-col p-0 max-h-[80vh] sm:max-w-5xl overflow-hidden">
        <DialogModalHeader>
          <DialogModalTitle className="px-6 pt-4 text-[22px] font-bold">
            Change Permission
          </DialogModalTitle>
        </DialogModalHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto scroll-custom"
        >
          <DialogModalDescription asChild>
            <div className="px-6 space-y-8">
              <CustomInput
                label="Name"
                name="name"
                register={register}
                disabled
                errors={errors}
              />

              <div>
                <h2 className="font-inter font-bold text-[20px] text-[#1B2E48]">
                  Select Access
                </h2>
                <Controller
                  name="permission"
                  control={control}
                  render={({ field }) => {
                    const allPermissions = getAllPermissions(accessGroups);

                    const isAllChecked =
                      allPermissions.length &&
                      allPermissions.every((p) =>
                        field.value.some((v) => v.identifier === p.identifier)
                      );

                    return (
                      <>
                        {isCompanyAccess() && (
                          <label className="grid grid-cols-[20px_1fr] gap-x-3 mb-6 mt-3 cursor-pointer">
                            <Checkbox
                              checked={isAllChecked}
                              onCheckedChange={(checked) =>
                                field.onChange(checked ? allPermissions : [])
                              }
                            />
                            <span>Select all access</span>
                          </label>
                        )}

                        <PermissionGroup
                          accessGroups={accessGroups}
                          field={field}
                          className={!isCompanyAccess() ? "mt-3" : ""}
                        />
                      </>
                    );
                  }}
                />
              </div>
            </div>
          </DialogModalDescription>

          <DialogModalFooter className="px-6 py-6 shrink-0 items-center">
            <Button
              type="submit"
              disabled={loading}
              className="w-full max-w-[40cqi] bg-[#1a2f48] hover:bg-[#1a2f48]/80 text-white"
            >
              {loading ? "Loading..." : "Save"}
            </Button>
          </DialogModalFooter>
        </form>
      </DialogModalContent>
    </DialogModal>
  );
}

function PermissionGroup({ accessGroups, field, className }) {
  const find = (name) => accessGroups.find((g) => g.group_name === name);

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 ${className}`}
    >
      <div className="flex flex-col gap-10">
        <PermissionSection group={find("General")} field={field} />
        <PermissionSection group={find("User")} field={field} />
      </div>

      <PermissionSection group={find("Role Access")} field={field} />
      <PermissionSection group={find("File Management")} field={field} />
    </div>
  );
}

function PermissionSection({ group, field }) {
  if (!group) return null;

  const isFile = group.group_name.toLowerCase() === "file management";
  const items = group.permissions ?? [];
  const useTwoColumns = isFile && items.length > 11;

  const columns = useMemo(() => {
    if (!useTwoColumns) return [items];
    const mid = Math.ceil(items.length / 2);
    return [items.slice(0, mid), items.slice(mid)];
  }, [items, useTwoColumns]);

  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-semibold text-[#5B84D6]">{group.group_name}</h3>

      <div
        className={`grid gap-3 ${
          useTwoColumns ? "grid-cols-2" : "grid-cols-1"
        }`}
      >
        {columns.map((col, idx) => (
          <div key={idx} className="flex flex-col gap-3">
            {col.map((p) => (
              <PermissionItem key={p.identifier} permission={p} field={field} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function PermissionItem({ permission, field }) {
  const checked = field.value.some(
    (p) => p.identifier === permission.identifier
  );

  return (
    <label className="grid grid-cols-[20px_1fr] gap-x-3 cursor-pointer">
      <Checkbox
        checked={checked}
        onCheckedChange={(v) => {
          if (v) {
            field.onChange([
              ...field.value,
              {
                identifier: permission.identifier,
                label: permission.label,
              },
            ]);
          } else {
            field.onChange(
              field.value.filter((p) => p.identifier !== permission.identifier)
            );
          }
        }}
      />
      <span className="text-sm">{permission.label}</span>
    </label>
  );
}

export function ModalRole({
  data,
  listRole = [],
  open,
  onOpenChange,
  extraAction = () => {},
}) {
  const [loading, setLoading] = useState(false);
  const { token, hasPermission, isExpired, refreshSession } = useAuth();
  console.log(data, listRole);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: data?.full_name ?? "",
      role: data?.role?.[0] ?? null,
    },
  });

  useEffect(() => {
    reset({
      name: data?.full_name ?? "",
      role: data?.role?.[0] ?? null,
    });
  }, [data, reset]);

  const { addToast } = useToast();

  const onSubmit = async (values) => {
    console.log(values);
    if (isExpired()) {
      await refreshSession();
    }

    setLoading(true);

    if (!data?.id) {
      addToast("error", "anda belum pilih usernya");
      return;
    }

    try {
      console.log(values);
      const formData = {
        user_id: values?.role?.identifier && data?.id ? [data.id] : [],
      };

      const info = JSON.parse(sessionStorage.getItem("info") || "{}");
      const headers = buildHeaders(info, token);

      const url = `https://staging-backend.rbac.asj-shipagency.co.id/api/v1/company/1/role/${values?.role?.identifier}/user`;
      const method = "put";

      const res = await axios({
        method,
        url,
        data: formData,
        headers,
      });

      const body = res.data;
      console.log(body);

      if (body.error) {
        addToast("error", body.error);
      } else if (body.success) {
        addToast("success", body.success);
        onOpenChange(false);
        extraAction();
      }
    } catch (err) {
      console.error(err);
      addToast("error", "ada masalah pada aplikasi");
    } finally {
      setLoading(false);
    }

    // reset();
    // onOpenChange(false);
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
                rules={{}}
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
              disabled={loading}
              on
              className="w-full max-w-[40cqi] bg-[#1a2f48] hover:bg-[#1a2f48]/80 text-white"
            >
              {loading ? "Sending..." : "Save"}
            </Button>
          </DialogModalFooter>
        </form>
      </DialogModalContent>
    </DialogModal>
  );
}

export function ModalForm({
  data,
  open,
  onOpenChange,
  mode = "create",
  extraAction = function () {},
}) {
  const { token, hasPermission, isExpired, refreshSession } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: data?.full_name ?? "",
      role: data?.role ?? "",
      role_description: data?.role_description ?? "",
    },
  });

  useEffect(() => {
    reset({
      name: data?.full_name ?? "",
      role: data?.role ?? "",
      role_description: data?.role_description ?? "",
    });
  }, [reset]);

  const { addToast } = useToast();

  const onSubmit = async (values) => {
    console.log(values);

    if (isExpired()) {
      await refreshSession();
    }

    setLoading(true);

    try {
      console.log(values);
      const formData = {
        name: values.role,
        description: values.role_description,
      };

      const info = JSON.parse(sessionStorage.getItem("info") || "{}");
      const headers = buildHeaders(info, token);

      const baseUrl =
        "https://staging-backend.rbac.asj-shipagency.co.id/api/v1/company/1/role";

      const url =
        mode === "create" ? baseUrl : `${baseUrl}/${data?.id_role ?? 0}`;

      const method = mode === "create" ? "post" : "put";

      const res = await axios({
        method,
        url,
        data: formData,
        headers,
      });

      const body = res.data;
      console.log(body);

      if (body.error) {
        addToast("error", body.error);
      } else if (body.success) {
        addToast("success", body.success);
        onOpenChange(false);
        extraAction();
      }
    } catch (err) {
      console.error(err);
      addToast("error", "ada masalah pada aplikasi");
    } finally {
      setLoading(false);
    }

    // reset();
    // onOpenChange(false);
    // addToast("success", "Save successfully");
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
            {mode == "create" ? "Add New" : "Edit"} Role
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
                rules={{}}
                disabled
              />

              <CustomInput
                label="Role"
                name="role"
                register={register}
                errors={errors}
                rules={{
                  required: "Role is required",
                }}
              />

              <CustomTextArea
                label="Role Description"
                name="role_description"
                register={register}
                errors={errors}
                rules={{
                  required: "Role description is required",
                }}
              />

              <div className="mt-8"></div>
            </div>
          </DialogModalDescription>

          {/* FOOTER (TETAP DI DALAM FORM TAPI TIDAK SCROLL KELUAR) */}
          <DialogModalFooter className="px-6 py-6 shrink-0 items-center">
            <Button
              type="submit"
              disabled={loading}
              className="w-full max-w-[40cqi] bg-[#1a2f48] hover:bg-[#1a2f48]/80 text-white"
            >
              {loading ? "Sending..." : "Save"}
            </Button>
          </DialogModalFooter>
        </form>
      </DialogModalContent>
    </DialogModal>
  );
}
