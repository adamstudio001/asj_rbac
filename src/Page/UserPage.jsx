import React, { useEffect, useRef, useState } from "react";
import Navbar from "@src/Components/Navbar";
import { useSearch } from "@src/Providers/SearchProvider";
import { TableActionMenu } from "@src/Components/TableActionMenu";
import DeleteModal from "@src/Components/DeleteModal";
import Pagination from "@src/Components/Pagination";
import { useToast } from "@src/Providers/ToastProvider";
import reset from "@assets/reset.svg";
import trash from "@assets/trash.svg";
import eye from "@assets/eye.svg";
import eyehide from "@assets/eye_hide.svg";
import user_edit from "@assets/user_edit.svg";
import view_user from "@/assets/view_profile.svg";
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
import { buildHeaders, formatLastSeen, isEmpty } from "@/Common/Utils";
import EllipsisTooltip from "@/Components/EllipsisTooltip";
import WhatsappInput from "@/Components/WhatsappInput";
import CustomInput from "@/Components/CustomInput";
import CustomSelect from "@/Components/CustomSelect";
import { useAuth } from "@/Providers/AuthProvider";
import axios from "axios";
import CustomTextArea from "@/Components/CustomTextArea";
import { cn } from "@/lib/utils";
import { createPortal } from "react-dom";
import { Label } from "@/Components/ui/Label";
import { Input } from "@/Components/ui/Input";

const UserPage = () => {
  return (
    // <ToastProvider>
    <UserPageContent />
    // </ToastProvider>
  );
};

const UserPageContent = () => {
  const { search, setSearch } = useSearch();
  const { addToast } = useToast();

  const [isLoad, setIsLoad] = useState(false);
  const [error, setError] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);
  const [page, setPage] = useState(1);

  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalViewOpen, setIsModalViewOpen] = useState(false);
  const [isModalResetOpen, setIsModalResetOpen] = useState(false);

  const [totalPages, setTotalPages] = useState(1);

  const {
    token,
    hasPermission,
    isAdminAccess,
    isCompanyAccess,
    isExpired,
    refreshSession,
  } = useAuth();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [branches, setBranches] = useState([]);
  const isAdmin = isAdminAccess() || isCompanyAccess();

  async function loadData() {
    if (isExpired()) {
      await refreshSession();
    }

    if (isAdmin) {
      setIsLoad(true);
      setTimeout(async () => {
        try {
          const [usersRes, jobsRes, branchesRes] = await Promise.allSettled([
            axios.get(
              `https://staging-backend.rbac.asj-shipagency.co.id/api/v1/company/1/user?page=${page}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            ),
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

          const users =
            usersRes.status === "fulfilled"
              ? usersRes.value.data || null
              : null;

          const jobs =
            jobsRes.status === "fulfilled"
              ? jobsRes.value.data?.data || []
              : [];
          const branches =
            branchesRes.status === "fulfilled"
              ? branchesRes.value.data?.data || []
              : [];

          setUsers(users?.data ?? []);
          setTotalPages(users?.last_page ?? 1);
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

  function getJobPosition(value) {
    if (isEmpty(value)) {
      return "";
    }

    return jobs.find((job) => job?.identifier == value);
  }

  // function getBranch(value){
  //   if(isEmpty(value)){
  //     return "";
  //   }

  //   return branches.find(branch => branch?.identifier == value);
  // }

  function deleteCloseHandler() {
    if (isAdmin) {
      setIsModalDeleteOpen(false);
      setSelectedUser(null);
    }
  }

  async function deleteHandler() {
    if (isExpired()) {
      refreshSession();
    }

    if (isAdmin) {
      setLoading(true);
      // setErrorMessage("");
      try {
        const info = JSON.parse(sessionStorage.getItem("info") || "{}");
        const headers = buildHeaders(info, token);

        const res = await axios.delete(
          `https://staging-backend.rbac.asj-shipagency.co.id/api/v1/company/1/user/${
            selectedUser?.id ?? 0
          }`,
          {
            headers: headers,
          }
        );
        const body = res.data;
        console.log(body);

        if (body.error) {
          addToast("error", body.error);
        } else if (body.success) {
          addToast("success", body.success);
          setIsModalDeleteOpen(false);
          await loadData();
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
    }
  }

  useEffect(() => {
    console.log(sessionStorage.getItem("info"));
    setSearch("");
    loadData();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.full_name.toLowerCase().includes(search.toLowerCase())
  );

  const hasGrantedShowButtonAction =
    hasPermission("VIEW_USER") ||
    hasPermission("EDIT_USER") ||
    hasPermission("RESET_PASSWORD_USER") ||
    hasPermission("DELETE_USER") ||
    isAdmin;

  const hasGrantedButtonViewUser = hasPermission("VIEW_USER") || isAdmin;

  const hasGrantedButtonEditUser = hasPermission("EDIT_USER") || isAdmin;

  const hasGrantedButtonResetUser = hasPermission("RESET_PASSWORD_USER") || isAdmin;

  const hasGrantedButtonDeleteUser = hasPermission("DELETE_USER") || isAdmin;

  const hasGrantedButtonNewUser = hasPermission("ADD_NEW_USER") || isAdmin;

  function renderTable() {
    if (isLoad) {
      return (
        <table className="w-full table-auto border-collapse">
          <thead className="bg-[#F3F3F3]">
            <tr className="border border-gray-200">
              <th className="px-4 py-3 w-10"></th>
              <th className="px-4 py-3 font-inter font-medium text-[14px] text-black text-left min-w-0 w-[200px]">
                Name
              </th>
              <th className="px-4 py-3 font-inter font-medium text-[14px] text-black text-left">
                Address
              </th>
              <th className="px-4 py-3 font-inter font-medium text-[14px] text-black text-left">
                Position
              </th>
              {/* <th className="px-4 py-3 font-inter font-medium text-[14px] text-black text-left">
                        Last Seen
                      </th> */}
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
                  {/* <td className="border px-4 py-2">
                        <div className="skeleton h-4 w-full"></div>
                      </td> */}
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
            <th className="px-4 py-3 w-10"></th>
            <th className="px-4 py-3 font-inter font-medium text-[14px] text-black text-left min-w-0 w-[200px]">
              Name
            </th>
            <th className="px-4 py-3 font-inter font-medium text-[14px] text-black text-left">
              Address
            </th>
            <th className="px-4 py-3 font-inter font-medium text-[14px] text-black text-left">
              Position
            </th>
            {/* <th className="px-4 py-3 font-inter font-medium text-[14px] text-black text-left">
                    Last Seen
                  </th> */}
          </tr>
        </thead>
        <tbody>
          {error ? (
            <tr>
              <td colSpan={5} className="text-center flex-col gap-2">
                <p>{error}</p>
                <button
                  className="
                              px-3 py-1
                              rounded
                              border-0
                              hover:border hover:border-gray-400
                              active:border active:border-gray-500
                              focus:outline-none focus:ring-2 focus:ring-gray-400
                              transition-all duration-150
                            "
                  onClick={() => loadData()}
                >
                  Klik muat ulang
                </button>
              </td>
            </tr>
          ) : (
            filteredUsers.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-gray-50 transition border-b border-gray-200"
              >
                <td className="px-4 py-3">
                  {hasGrantedShowButtonAction && (
                    <TableActionMenu>
                      {hasGrantedButtonViewUser && (
                        <button
                          className="mx-2 flex gap-2 items-center w-[-webkit-fill-available] rounded px-2 py-2 text-sm text-sm text-[#424242] hover:bg-[#F4F4F4] hover:text-[#242424]"
                          onClick={() => {
                            setSelectedUser(user);
                            setIsModalViewOpen(true);
                          }}
                        >
                          <img src={view_user} alt="view user" />
                          View User
                        </button>
                      )}

                      {/* Edit User */}
                      {hasGrantedButtonEditUser && (
                        <button
                          className="flex gap-2 items-center w-[-webkit-fill-available] rounded mx-2 px-2 py-2 text-sm text-sm text-[#424242] hover:bg-[#F4F4F4] hover:text-[#242424]"
                          onClick={() => {
                            setSelectedUser(user);
                            setIsModalOpen(true);
                          }}
                        >
                          <img
                            src={user_edit}
                            alt="edit user"
                            className="w-4 h-4 hover:text-white"
                          />
                          Edit User
                        </button>
                      )}

                      {/* Reset Password */}
                      {hasGrantedButtonResetUser && (
                        <button
                          className="flex gap-2 items-center w-[-webkit-fill-available] rounded mx-2 px-2 py-2 text-sm text-sm text-[#424242] hover:bg-[#F4F4F4] hover:text-[#242424]"
                          onClick={() => {
                            setSelectedUser(user);
                            setIsModalResetOpen(true);
                          }}
                        >
                          <img
                            src={reset}
                            alt="reset password"
                            className="w-4 h-4"
                          />
                          Reset Password
                        </button>
                      )}

                      {/* Delete User */}
                      {hasGrantedButtonDeleteUser && (
                        <button
                          className="flex gap-2 items-center w-[-webkit-fill-available] rounded mx-2 px-2 py-2 text-sm text-sm text-[#424242] hover:bg-[#F4F4F4] hover:text-[#242424]"
                          onClick={() => {
                            setIsModalDeleteOpen(true);
                            setSelectedUser(user);
                          }}
                        >
                          <img
                            src={trash}
                            alt="delete user"
                            className="w-4 h-4"
                          />
                          Delete User
                        </button>
                      )}
                    </TableActionMenu>
                  )}
                </td>

                <td className="px-4 py-3 font-inter text-[14px] leading-[14px] text-gray-800">
                  <EllipsisTooltip className={"w-[200px]"}>
                    {user.full_name}
                  </EllipsisTooltip>
                </td>
                <td className="px-4 py-3 font-inter text-[14px] leading-[14px] text-gray-800">
                  {user.address}
                </td>
                <td className="px-4 py-3 font-inter text-[14px] leading-[14px] text-gray-800">
                  {user.employment.map(
                    (e) => getJobPosition(e.job_identifier)?.label ?? ""
                  )}
                </td>
                {/* <td className="px-4 py-3 font-inter text-[14px] leading-[14px] text-gray-800">
                          {formatLastSeen(user?.lastLogin?.start, user?.lastLogin?.end)}
                        </td> */}
              </tr>
            ))
          )}
        </tbody>
      </table>
    );
  }

  function renderPaging() {
    if (isLoad) {
      return (
        <div className="flex items-center justify-center">
          <div className="skeleton h-4 w-32 mt-8"></div>
        </div>
      );
    } else if (error) {
      return <></>;
    }

    return (
      <Pagination
        className="mt-8"
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    );
  }

  return (
    <>
      <Navbar
        renderActionModal={() =>
          hasGrantedButtonNewUser ? ( //(isAdminAccess() || isCompanyAccess())
            <button
              disabled={isLoad}
              onClick={() => {
                setSelectedUser(null);
                setIsModalOpen(true);
              }}
              className="bg-[#1e3264] text-white px-4 py-2 rounded-md font-medium hover:bg-[#15234a] disabled:pointer-events-none disabled:opacity-50 transition"
            >
              + New User
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

        {renderPaging()}
      </main>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        titleMessage="Delete User"
        message={"Are you sure want to delete this user?"}
        isOpen={isModalDeleteOpen}
        onClose={() => deleteCloseHandler()}
        onConfirm={() => deleteHandler()}
        isLoading={loading}
      />

      {/* Add / Edit Modal */}
      <ModalUser
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        data={selectedUser}
        mode={selectedUser ? "edit" : "create"}
        jobs={jobs}
        branches={branches}
        extraAction={() => loadData()}
      />

      <ModalResetPassword
        open={isModalResetOpen}
        onOpenChange={setIsModalResetOpen}
        data={selectedUser}
        extraAction={() => loadData()}
      />

      <ModalViewUser
        open={isModalViewOpen}
        onOpenChange={setIsModalViewOpen}
        data={selectedUser}
      />
    </>
  );
};

export default UserPage;

export function ModalViewUser({ open, onOpenChange, data = null }) {
  function renderValue(data, type) {
    if (type == "division") {
      const employe = data?.employment ?? [];
      if (employe.length == 1) {
        return employe?.[0]?.job_identifier ?? "";
      } else if (employe.length > 1) {
        return employe?.job_identifier.join(", ");
      }
      return "";
    } else if (type == "branch") {
      const employe = data?.employment ?? [];
      if (employe.length == 1) {
        return employe?.[0]?.branch_location_identifier ?? "";
      } else if (employe.length > 1) {
        return employe?.branch_location_identifier.join(", ");
      }
      return "";
    } else if (type == "role") {
      if (data?.has_admin_access_status) {
        return "Super Admin";
      } else if (data?.has_company_access_status) {
        return "Admin";
      } else if (data?.has_user_access_status) {
        return "User";
      }

      return "";
    }

    return "";
  }

  return (
    <DialogModal open={open} onOpenChange={onOpenChange}>
      <DialogModalContent className="flex flex-col gap-0 p-0 sm:max-h-full sm:max-w-lg">
        {" "}
        {/*max-h-[min(640px,80vh)]*/}
        <DialogModalHeader>
          <DialogModalTitle className="px-6 py-4 font-inter font-bold text-[22px] text-[#1B2E48]">
            View User
          </DialogModalTitle>

          <DialogModalDescription asChild>
            <div className="px-6 pb-8 space-y-8">
              <div>
                <h5 className="font-inter font-bold text-lg text-[#1B2E48] pb-4">
                  Personal Information
                </h5>

                <div className="space-y-6">
                  <div className="flex flex-col gap-6">
                    <div className="inline-flex">
                      <b className="min-w-[15cqi] font-bold text-black">
                        First Name:
                      </b>
                      <p className="text-black text-sm font-normal">
                        {data?.first_name ?? ""}
                      </p>
                    </div>
                    <div className="inline-flex">
                      <b className="min-w-[15cqi] font-bold text-black">
                        Last Name:
                      </b>
                      <p className="text-black text-sm font-normal">
                        {data?.last_name ?? ""}
                      </p>
                    </div>
                    <div className="inline-flex">
                      <b className="min-w-[15cqi] font-bold text-black">
                        Whatsapp No:
                      </b>
                      <p className="text-black text-sm font-normal">
                        {data?.whatsapp_number ?? ""}
                      </p>
                    </div>
                    <div className="inline-flex">
                      <b className="min-w-[15cqi] font-bold text-black">
                        Password:
                      </b>
                      <p className="text-black text-sm font-normal">
                        ****************
                      </p>
                    </div>
                    <div className="inline-flex">
                      <b className="min-w-[15cqi] font-bold text-black">
                        Address:
                      </b>
                      <p className="text-black text-sm font-normal">
                        {data?.address ?? ""}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="font-inter font-bold text-lg text-[#1B2E48] pb-4">
                  Professional Information
                </h5>

                <div className="space-y-6">
                  <div className="flex flex-col gap-6">
                    <div className="inline-flex">
                      <b className="min-w-[15cqi] font-bold text-black">
                        Employee ID:
                      </b>
                      <p className="text-black text-sm font-normal">
                        {data?.employment?.[0]?.employee_id ?? ""}
                      </p>
                    </div>
                    <div className="inline-flex">
                      <b className="min-w-[15cqi] font-bold text-black">
                        Division:
                      </b>
                      <p className="text-black text-sm font-normal">
                        {renderValue(data, "division")}
                      </p>
                    </div>
                    <div className="inline-flex">
                      <b className="min-w-[15cqi] font-bold text-black">
                        Work Location / Branch:
                      </b>
                      <p className="text-black text-sm font-normal">
                        {renderValue(data, "branch")}
                      </p>
                    </div>
                    <div className="inline-flex">
                      <b className="min-w-[15cqi] font-bold text-black">
                        Role:
                      </b>
                      <p className="text-black text-sm font-normal">
                        {renderValue(data, "role")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogModalDescription>
        </DialogModalHeader>
      </DialogModalContent>
    </DialogModal>
  );
}

export function ModalResetPassword({
  open,
  onOpenChange,
  data = null,
  extraAction = () => {},
}) {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(true);
  const [clipboardValue, setClipboardValue] = useState("");

  const { addToast } = useToast();
  const { token, hasPermission, isExpired, refreshSession } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  /* ================= CONTEXT MENU STATE ================= */
  const [contextMenu, setContextMenu] = useState({
    open: false,
    x: 0,
    y: 0,
    field: null, // "newPassword" | "confirmPassword"
  });

  /* ================= RESET FORM ================= */
  useEffect(() => {
    reset({
      firstName: data?.first_name ?? "",
      newPassword: "",
      confirmPassword: "",
    });
  }, [data, reset]);

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  /* ================= CLOSE CONTEXT MENU ================= */
  useEffect(() => {
    const close = () => setContextMenu((c) => ({ ...c, open: false }));

    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  /* ================= SUBMIT ================= */
  const onSubmit = async (values) => {
    if (isExpired()) refreshSession();
    setLoading(true);

    try {
      const res = await axios.put(
        `https://staging-backend.rbac.asj-shipagency.co.id/api/v1/company/1/user/${data.id}/reset-password`,
        {
          password: values.newPassword,
          password_confirmation: values.confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data?.error) {
        addToast("error", res.data.error);
      } else {
        addToast("success", res.data.success || "Password updated");
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
      <DialogModalContent className="p-0 sm:max-w-lg">
        <DialogModalHeader>
          <DialogModalTitle className="px-6 py-4 text-[22px] font-bold">
            Reset Password
          </DialogModalTitle>

          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogModalDescription asChild>
              <div className="px-6 pb-8 space-y-6">
                <CustomInput
                  label="First Name"
                  name="firstName"
                  register={register}
                  disabled
                  errors={errors}
                />

                {/* ================= NEW PASSWORD ================= */}
                <div>
                  <Label>New Password</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      {...register("newPassword", {
                        required: "New Password is required",
                        minLength: { value: 6, message: "Min 6 chars" },
                      })}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setContextMenu({
                          open: true,
                          x: e.clientX,
                          y: e.clientY,
                          field: "newPassword",
                        });
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      <img
                        src={showPassword ? eye : eyehide}
                        className="w-5 h-5"
                      />
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="text-red-500 text-sm">
                      {errors.newPassword.message}
                    </p>
                  )}
                </div>

                {/* ================= CONFIRM PASSWORD ================= */}
                <div>
                  <Label>Confirm Password</Label>
                  <div className="relative">
                    <Input
                      type={showPasswordConfirm ? "text" : "password"}
                      {...register("confirmPassword", {
                        required: "Confirm Password is required",
                        validate: (v) =>
                          v === watch("newPassword") ||
                          "Confirm Password not match",
                      })}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setContextMenu({
                          open: true,
                          x: e.clientX,
                          y: e.clientY,
                          field: "confirmPassword",
                        });
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswordConfirm((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      <img
                        src={showPasswordConfirm ? eye : eyehide}
                        className="w-5 h-5"
                      />
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>
            </DialogModalDescription>

            <DialogModalFooter className="px-6 pb-6">
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1a2f48] text-white"
              >
                {loading ? "Sending..." : "Save"}
              </Button>
            </DialogModalFooter>
          </form>
        </DialogModalHeader>
      </DialogModalContent>

      {/* ================= CONTEXT MENU (PORTAL) ================= */}
      {contextMenu.open &&
        createPortal(
          <div
            style={{
              position: "fixed",
              top: contextMenu.y,
              left: contextMenu.x,
              zIndex: 2147483647,
              pointerEvents: "auto",
            }}
            className="w-32 rounded-md border bg-white shadow-lg"
            onPointerDownCapture={(e) => {
              e.stopPropagation();
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {isEmpty(clipboardValue) ? (
              <button
                className="w-full px-3 py-2 text-left hover:bg-gray-100"
                onClick={() => {
                  // navigator.clipboard.writeText(
                  //   watch(contextMenu.field)
                  // );
                  setClipboardValue(watch("newPassword"));
                  setContextMenu({ ...contextMenu, open: false });
                }}
              >
                Copy
              </button>
            ) : (
              <>
                <button
                  className="w-full px-3 py-2 text-left hover:bg-gray-100"
                  onClick={async () => {
                    // const text = await navigator.clipboard.readText();
                    setValue(contextMenu.field, clipboardValue);
                    setClipboardValue(null);
                    setContextMenu({ ...contextMenu, open: false });
                  }}
                >
                  Paste
                </button>
              </>
            )}
          </div>,
          document.body
        )}
    </DialogModal>
  );
}

export function ModalUser({
  open,
  onOpenChange,
  data = null,
  mode = "create",
  jobs = [],
  branches = [],
  extraAction = function () {},
}) {
  const [loading, setLoading] = useState(false);
  const [showPasswordUser, setShowPasswordUser] = useState(false);
  const passwordRef = useRef(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      whatsapp: "",
      password: "",
      address: "",
      jobPosition: "",
      branch: "",
      // role: "",
      employee_id: "",
    },
  });

  const { addToast } = useToast();
  const { token, hasPermission, isExpired, refreshSession } = useAuth();

  useEffect(() => {
    reset({
      firstName: data?.first_name ?? "",
      lastName: data?.last_name ?? "",
      whatsapp: data?.whatsapp_number ?? "",
      password: data?.password ?? "",
      email: data?.email ?? "",
      address: data?.address ?? "",
      jobPosition: getJobPosition(data?.employment?.[0]?.job_identifier),
      branch: getBranch(data?.employment?.[0]?.branch_location_identifier),
      // role: data?.role ?? "",
      employee_id: data?.employment?.[0]?.employee_id ?? "",
    });
  }, [data, reset]);

  function getJobPosition(value) {
    if (isEmpty(value)) {
      return "";
    }

    return jobs.find((job) => job?.identifier == value);
  }

  function getBranch(value) {
    if (isEmpty(value)) {
      return "";
    }

    return branches.find((branch) => branch?.identifier == value);
  }

  const onSubmit = async (values) => {
    if (isExpired()) {
      refreshSession();
    }

    setLoading(true);

    try {
      console.log(values);
      const formData =
        mode == "create"
          ? {
              first_name: values.firstName,
              last_name: values.lastName,
              password: values.password,
              whatsapp_number: values.whatsapp,
              email: values.email,
              address: values.address,
              job_identifier: values.jobPosition?.identifier ?? "",
              branch_location_identifier: values.branch?.identifier ?? "",
              employee_id: values.employee_id,
            }
          : {
              first_name: values.firstName,
              last_name: values.lastName,
              whatsapp_number: values.whatsapp,
              email: values.email,
              address: values.address,
              job_identifier: values.jobPosition?.identifier ?? "",
              branch_location_identifier: values.branch?.identifier ?? "",
              employee_id: values.employee_id,
            };

      const info = JSON.parse(sessionStorage.getItem("info") || "{}");
      const headers = buildHeaders(info, token);

      const baseUrl =
        "https://staging-backend.rbac.asj-shipagency.co.id/api/v1/company/1/user";

      const url = mode === "create" ? baseUrl : `${baseUrl}/${data?.id ?? 0}`;

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
  };

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  return (
    <DialogModal open={open} onOpenChange={onOpenChange}>
      <DialogModalContent className="flex flex-col gap-0 p-0 sm:max-h-full sm:max-w-5xl">
        {" "}
        {/*max-h-[min(640px,80vh)]*/}
        <DialogModalHeader>
          <DialogModalTitle className="px-6 py-4 font-inter font-bold text-[22px] text-[#1B2E48]">
            {mode === "create" ? "Add New User" : "Edit User"}
          </DialogModalTitle>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="overflow-y-auto scroll-custom"
          >
            <DialogModalDescription asChild>
              <div className="px-6 pb-8 space-y-8">
                {/* General Information */}
                <div>
                  <h5 className="font-inter font-bold text-lg text-[#1B2E48] pb-4">
                    General Information
                  </h5>

                  <div className="space-y-6">
                    {/* --- Row 1 --- */}
                    <div className="flex flex-wrap gap-4">
                      <CustomInput
                        label="First Name"
                        name="firstName"
                        register={register}
                        errors={errors}
                        rules={{
                          required: "First name is required",
                          minLength: { value: 2, message: "Too short" },
                        }}
                      />

                      <CustomInput
                        label="Last Name"
                        name="lastName"
                        register={register}
                        errors={errors}
                        rules={{
                          required: "Last name is required",
                        }}
                      />

                      <CustomInput
                        label="Employee ID"
                        name="employee_id"
                        register={register}
                        errors={errors}
                        rules={{
                          required: "Employee ID is required",
                        }}
                      />
                    </div>

                    {/* --- Row 2 --- */}
                    <div className="flex flex-wrap gap-4">
                      <WhatsappInput register={register} errors={errors} />

                      {/* <CustomInput
                        label="Password"
                        name="password"
                        type="password"
                        disabled={mode !== "create"}
                        register={register}
                        errors={errors}
                        rules={
                          mode == "create"
                            ? {
                                required: "Password is required",
                                minLength: { value: 6, message: "Min 6 chars" },
                              }
                            : {}
                        }
                      /> */}
                      <div className="flex-1 min-w-[250px]">
                        <label
                          data-slot="label"
                          className="text-sm leading-4 font-medium text-foreground select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
                        >
                          Password
                        </label>

                        <div className="flex flex-col">
                          <div className="relative">
                            <input
                              id="password"
                              ref={passwordRef}
                              disabled={mode !== "create"}
                              type={showPasswordUser ? "text" : "password"}
                              className={cn(
                                "flex h-12 w-full rounded-md border border-[#E2E2E2] bg-transparent px-3 pr-10 text-sm text-[#1B2E48] outline-none transition focus-visible:border-black",
                                errors.password &&
                                  "border-red-500 focus:border-red-500"
                              )}
                              {...register(
                                "password",
                                mode == "create"
                                  ? {
                                      required: "Password is required",
                                      minLength: {
                                        value: 6,
                                        message: "Min 6 chars",
                                      },
                                    }
                                  : {}
                              )}
                            />

                            {/* ICON */}
                            <button
                              type="button"
                              onClick={() => setShowPasswordUser((p) => !p)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                              {showPasswordUser ? (
                                <img src={eye} alt="hide" className="w-5 h-5" />
                              ) : (
                                <img
                                  src={eyehide}
                                  alt="hide"
                                  className="w-5 h-5"
                                />
                              )}
                            </button>
                          </div>
                          {errors.password && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.password.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <CustomInput
                        label="email"
                        name="email"
                        register={register}
                        errors={errors}
                        rules={{
                          required: "Email is required",
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Format email tidak valid",
                          },
                        }}
                      />
                    </div>

                    <div className="flex flex-wrap gap-4">
                      <CustomTextArea
                        label="Address"
                        name="address"
                        type="address"
                        register={register}
                        errors={errors}
                        rules={{
                          required: "Address is required",
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div>
                  <h5 className="font-inter font-bold text-lg text-[#1B2E48] pb-4">
                    Professional Information
                  </h5>

                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap gap-4">
                      <Controller
                        name="jobPosition"
                        control={control}
                        rules={{ required: "Division is required" }}
                        render={({ field }) => (
                          <CustomSelect
                            label="Division"
                            records={jobs}
                            // sourceUrl="https://staging-backend.rbac.asj-shipagency.co.id/api/v1/helper/job"
                            value={field.value}
                            disabled={mode !== "create"}
                            onChange={field.onChange}
                            error={errors.jobPosition?.message}
                          />
                        )}
                      />

                      <Controller
                        name="branch"
                        control={control}
                        rules={{ required: "Branch is required" }}
                        render={({ field }) => (
                          <CustomSelect
                            label="Work Location / Branch"
                            records={branches}
                            // sourceUrl="https://staging-backend.rbac.asj-shipagency.co.id/api/v1/helper/branch-location"
                            value={field.value}
                            disabled={mode !== "create"}
                            onChange={field.onChange}
                            error={errors.branch?.message}
                          />
                        )}
                      />
                    </div>

                    {/* <div className="flex flex-wrap gap-4">
                      <Controller
                        name="role"
                        control={control}
                        rules={mode=="create"? 
                          { required: "Role is required" } : 
                          {}
                        }
                        render={({ field }) => (
                          <CustomSelect
                            label="Select Role"
                            records={[
                              {
                                identifier: "admin", 
                                label: "Admin",
                              },
                              {
                                identifier: "user", 
                                label: "User",
                              },
                              {
                                identifier: "developer", 
                                label: "Developer",
                              },
                            ]}
                            value={field.value}
                            disabled={mode!=="create"}
                            onChange={field.onChange}
                            error={errors.role?.message}
                          />
                        )}
                      />
                      <div className="flex-1 min-w-[250px]"></div>
                    </div> */}
                  </div>
                </div>
              </div>
            </DialogModalDescription>

            <DialogModalFooter className="px-6 pb-6 items-center">
              <Button
                type="submit"
                disabled={loading}
                className="w-full max-w-[40cqi] bg-[#1a2f48] hover:bg-[#1a2f48]/80 text-white"
              >
                {loading ? "Sending..." : "Save"}
              </Button>
            </DialogModalFooter>
          </form>
        </DialogModalHeader>
      </DialogModalContent>
    </DialogModal>
  );
}
