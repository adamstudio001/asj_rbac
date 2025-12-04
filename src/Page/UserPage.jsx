import React, { useEffect, useState } from "react";
import Navbar from "@src/Components/Navbar";
import { useSearch } from "@src/Providers/SearchProvider";
import { TableActionMenu } from "@src/Components/TableActionMenu";
import DeleteModal from "@src/Components/DeleteModal";
import Pagination from "@src/Components/Pagination";
import { useToast } from "@src/Providers/ToastProvider";
import reset from "@assets/reset.svg";
import trash from "@assets/trash.svg";
import user_edit from "@assets/user_edit.svg";

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
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  // const users = [
  //   {
  //     id: 1,
  //     firstName: "Desy",
  //     lastName: "Puji Astuti",
  //     email: "admin@gmail.com",
  //     whatsapp: "087870590000",
  //     branch: "Jakarta",
  //     lastLogin: {start: "2025-01-01 01:00:00", end: "2025-10-07 10:12:00"},
  //     jobPosition: "HR/GA",
  //   },
  //   {
  //     id: 2,
  //     firstName: "Hani",
  //     lastName: "Ayu Wulansari",
  //     email: "admin@gmail.com",
  //     whatsapp: "087870590000",
  //     branch: "Jakarta",
  //     lastLogin: {start: "2025-01-01 01:00:00", end: "2025-10-07 10:12:00"},
  //     jobPosition: "Finance",
  //   },
  //   {
  //     id: 3,
  //     firstName: "Rahul",
  //     lastName: "",
  //     email: "admin@gmail.com",
  //     whatsapp: "087870590000",
  //     branch: "Jakarta",
  //     lastLogin: {start: "2025-01-01 01:00:00", end: "2025-10-07 10:12:00"},
  //     jobPosition: "Operation",
  //   },
  //   {
  //     id: 4,
  //     firstName: "Dika",
  //     lastName: "",
  //     email: "admin@gmail.com",
  //     whatsapp: "087870590000",
  //     branch: "Jakarta",
  //     lastLogin: {start: "2025-10-13 15:00:00", end: null},
  //     jobPosition: "Operation",
  //   },
  // ];

  const { token, isAdminAccess, isCompanyAccess, isExpired, refreshSession } = useAuth();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [branches, setBranches] = useState([]);

  async function loadData() {
    if(isExpired()){
      refreshSession()
    }

    if(isAdminAccess() || isCompanyAccess()){
      setIsLoad(true);
      setTimeout(async ()=>{
        try {
          const [usersRes, jobsRes, branchesRes] = await Promise.allSettled([
            axios.get(`https://staging-backend.rbac.asj-shipagency.co.id/api/v1/company/1/user?page=${page}`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get("https://staging-backend.rbac.asj-shipagency.co.id/api/v1/helper/job", {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get("https://staging-backend.rbac.asj-shipagency.co.id/api/v1/helper/branch-location", {
              headers: { Authorization: `Bearer ${token}` },
            }),
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
      }, 1500)
    }
  }

  function getJobPosition(value){
    if(isEmpty(value)){
      return "";
    }

    return jobs.find(job => job?.identifier == value);
  }

  // function getBranch(value){
  //   if(isEmpty(value)){
  //     return "";
  //   }

  //   return branches.find(branch => branch?.identifier == value);
  // }

  function deleteCloseHandler(){
    if(isAdminAccess() || isCompanyAccess()){
      setIsModalDeleteOpen(false);
      setSelectedUser(null)
    }
  }

  async function deleteHandler(){
    if(isExpired()){
      refreshSession();
    }

    if(isAdminAccess() || isCompanyAccess()){
      setLoading(true);
      // setErrorMessage("");
      try {
        const info = JSON.parse(sessionStorage.getItem("info") || "{}");
        const headers = buildHeaders(info, token);

        const res = await axios.delete(`https://staging-backend.rbac.asj-shipagency.co.id/api/v1/company/1/user/${selectedUser?.id ?? 0}`, {
          headers: headers
        }); 
        const body = res.data;
        console.log(body)

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
  };

  useEffect(() => {
    console.log(sessionStorage.getItem("info"));
    setSearch("");
    loadData();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.full_name.toLowerCase().includes(search.toLowerCase())
  );

  function renderTable(){
    if(isLoad){
      return  <table className="w-full table-auto border-collapse">
                <thead>
                  <tr>
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
                    <th className="px-4 py-3 font-inter font-medium text-[14px] text-black text-left">
                      Last Seen
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Array(3).fill(null).map((_, i) => (
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
                    </tr>
                  ))}
                </tbody>
              </table>;
    }
    
    return <table className="w-full text-left text-sm">
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
                  <th className="px-4 py-3 font-inter font-medium text-[14px] text-black text-left">
                    Last Seen
                  </th>
              </tr>
            </thead>
            <tbody> 
              {error? 
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
                            onClick={()=>loadData()}
                          >
                            Klik muat ulang
                          </button>
                      </td>
                    </tr> : 
                    filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-gray-50 transition border-b border-gray-200"
                      >
                        <td className="px-4 py-3">
                          <TableActionMenu>
                            {/* Edit User */}
                            <button
                              className="flex gap-2 items-center w-full px-3 py-2 text-sm text-sm text-[#424242] hover:bg-[#F4F4F4] hover:text-[#242424]"
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
                              className="flex gap-2 items-center w-full px-3 py-2 text-sm text-sm text-[#424242] hover:bg-[#F4F4F4] hover:text-[#242424]"
                              onClick={() =>
                                alert(`Reset password for ${user.full_name}`)
                              }
                            >
                              <img src={reset} alt="download" className="w-4 h-4"/>
                              Reset Password
                            </button>

                            {/* Delete User */}
                            <button
                              className="flex gap-2 items-center w-full px-3 py-2 text-sm text-sm text-[#424242] hover:bg-[#F4F4F4] hover:text-[#242424]"
                              onClick={() => {
                                setIsModalDeleteOpen(true);
                                setSelectedUser(user);
                              }}
                            >
                              <img src={trash} alt="download" className="w-4 h-4"/>
                              Delete User
                            </button>
                          </TableActionMenu>
                        </td>

                        <td className="px-4 py-3 font-inter text-[14px] leading-[14px] text-gray-800">
                          <EllipsisTooltip className={"w-[200px]"}>{user.full_name}</EllipsisTooltip>
                        </td>
                        <td className="px-4 py-3 font-inter text-[14px] leading-[14px] text-gray-800">
                          {user.address}
                        </td>
                        <td className="px-4 py-3 font-inter text-[14px] leading-[14px] text-gray-800">
                          {user.employment.map(e => getJobPosition(e.job_identifier)?.label ?? "")}
                        </td>
                        <td className="px-4 py-3 font-inter text-[14px] leading-[14px] text-gray-800">
                          {formatLastSeen(user?.lastLogin?.start, user?.lastLogin?.end)}
                        </td>
                      </tr>
                    ))
              }
            </tbody>
          </table>
  }

  function renderPaging(){
      if(isLoad){
        return  <div className="flex items-center justify-center">
          <div className="skeleton h-4 w-32 mt-8"></div>
        </div>;
      } else if(error){
        return <></>;
      }
  
      return <Pagination
          className="mt-8"
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
  }

  return (
    <>
      <Navbar
        renderActionModal={()=>
          (
            isAdminAccess() || isCompanyAccess()? 
            <button
              disabled={isLoad}
              onClick={() => {
                setSelectedUser(null);
                setIsModalOpen(true);
              }}
              className="bg-[#1e3264] text-white px-4 py-2 rounded-md font-medium hover:bg-[#15234a] disabled:pointer-events-none disabled:opacity-50 transition"
            >
              + New User
            </button> : 
            <></>
          )
        }
      />

      <main className="flex-1 items-center p-6 overflow-auto">
        <div className="w-full overflow-x-scroll scroll-custom rounded-lg">
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
        extraAction={()=>loadData()}
      />
    </>
  );
};

export default UserPage;

export function ModalUser({ open, onOpenChange, data = null, mode = "create", jobs = [], branches = [], extraAction = function(){} }) {
  const [loading, setLoading] = useState(false);
  
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
    },
  });

  const { addToast } = useToast();
  const { token, isExpired, refreshSession } = useAuth();
  
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
    });
  }, [data, reset]);

  function getJobPosition(value){
    if(isEmpty(value)){
      return "";
    }

    return jobs.find(job => job?.identifier == value);
  }

  function getBranch(value){
    if(isEmpty(value)){
      return "";
    }

    return branches.find(branch => branch?.identifier == value);
  }

  const onSubmit = async (values) => {
    if (isExpired()) {
      refreshSession();
    }

    setLoading(true);

    try {
      console.log(values);
      const formData = {
        first_name: values.firstName,
        last_name: values.lastName,
        password: values.password,
        whatsapp_number: values.whatsapp,
        email: values.email,
        address: values.address,
        job_identifier: values.jobPosition?.identifier ?? "",
        branch_location_identifier: values.branch?.identifier ?? ""
      };

      const info = JSON.parse(sessionStorage.getItem("info") || "{}");
      const headers = buildHeaders(info, token);

      const baseUrl =
        "https://staging-backend.rbac.asj-shipagency.co.id/api/v1/company/1/user";

      const url =
        mode === "create" ? baseUrl : `${baseUrl}/${data?.id ?? 0}`;

      const method = mode === "create" ? "post" : "put";

      const res = await axios({
        method,
        url,
        data: formData,
        headers
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
      <DialogModalContent className="flex flex-col gap-0 p-0 sm:max-h-full sm:max-w-5xl"> {/*max-h-[min(640px,80vh)]*/}
        <DialogModalHeader>
          <DialogModalTitle className="px-6 py-4 font-inter font-bold text-[22px] text-[#1B2E48]">
            {mode === "create" ? "Add New User" : "Edit User"}
          </DialogModalTitle>

          <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto scroll-custom">
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
                    </div>

                    {/* --- Row 2 --- */}
                    <div className="flex flex-wrap gap-4">
                      <WhatsappInput register={register} errors={errors} />

                      <CustomInput
                        label="Password"
                        name="password"
                        type="password"
                        disabled={mode!=="create"}
                        register={register}
                        errors={errors}
                        rules={mode=="create"? 
                          {
                            required: "Password is required",
                            minLength: { value: 6, message: "Min 6 chars" },
                          } : 
                          {}
                        }
                      />

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
                        rules={{ required: "Job position is required" }}
                        render={({ field }) => (
                          <CustomSelect
                            label="Job Position"
                            records={jobs}
                            // sourceUrl="https://staging-backend.rbac.asj-shipagency.co.id/api/v1/helper/job"
                            value={field.value}
                            disabled={mode!=="create"}
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
                            disabled={mode!=="create"}
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
                className="w-full max-w-[300px] bg-[#1a2f48] hover:bg-[#1a2f48]/80 text-white"
              >
                {loading? "Sending...":"Save"}
              </Button>
            </DialogModalFooter>
          </form>
        </DialogModalHeader>
      </DialogModalContent>
    </DialogModal>
  );
}