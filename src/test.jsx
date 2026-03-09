// import React, { useState } from "react"
// import Select from "react-select"

// import {
//   Dialog,
//   DialogTrigger,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
//   DialogPortal
// } from "./Components/ui/Dialog"

// export default function Test() {

//   return (
//     <div className="p-10">
//       <ReviewerModal />
//     </div>
//   )

// }

// function ReviewerModal() {

//   const [reviewer, setReviewer] = useState(null)

//   const reviewers = [
//     { value: "0424096001", label: "0424096001 - DIDIK NOTOSUDJONO" },
//     { value: "0423106505", label: "0423106505 - DOLLY PRIATNA" },
//     { value: "0004096908", label: "0004096908 - Indarini Dwi Pursitasari" },
//     { value: "0012075802", label: "0012075802 - ANNA PERMANASARI" },
//     { value: "0019066501", label: "0019066501 - ERI SARIMANAH" },
//     { value: "0404117202", label: "0404117202 - SATA YOSHIDA SRIE RAHAYU" },
//     { value: "0403086301", label: "0403086301 - BINA LOHITA SARI" },
//     { value: "0406046201", label: "0406046201 - ANI IRYANI" },
//     { value: "0304097004", label: "0304097004 - DWI RINI SOVIA FIRDAUS" },
//     { value: "0424058209", label: "0424058209 - FERI FERDINAN ALAMSYAH" },
//     { value: "0429076901", label: "0429076901 - ELLY SUKMANASA" },
//     { value: "0424118503", label: "0424118503 - NOVI FAJAR UTAMI" },
//     { value: "0427067401", label: "0427067401 - ADE HERI MULYATI" },
//     { value: "0409017301", label: "0409017301 - TJUT AWALIYAH ZURAIYAH" },
//     { value: "0402108506", label: "0402108506 - RONI JAYAWINANGUN" }
//   ]

//   const handleAssign = () => {

//     if (!reviewer) {
//       alert("Pilih reviewer terlebih dahulu")
//       return
//     }

//     console.log("Selected Reviewer:", reviewer.value)

//   }

//   return (

//     <Dialog modal={false}>

//       <DialogTrigger asChild>
//         <button className="px-4 py-2 bg-blue-600 text-white rounded-md">
//           Tambah Reviewer
//         </button>
//       </DialogTrigger>

//       <DialogPortal>

//         {/* Overlay manual */}
//         <div className="fixed inset-0 bg-black/50 z-40" />

//         <DialogContent
//           className="sm:max-w-xl z-50"
//           onInteractOutside={(e) => e.preventDefault()}
//         >

//           <DialogHeader>
//             <DialogTitle>
//               Tambah Reviewer Kemajuan
//             </DialogTitle>
//           </DialogHeader>

//           <div className="space-y-4">

//             <div>

//               <label className="block text-sm font-medium mb-2">
//                 NIDN
//               </label>

//               <Select
//                 options={reviewers}
//                 value={reviewer}
//                 onChange={(value) => {
//                   console.log(value)
//                   setReviewer(value)
//                 }}
//                 placeholder="-- Pilih Reviewer --"

//                 menuPortalTarget={document.body}
//                 menuPosition="fixed"

//                 styles={{
//                   control: (base) => ({
//                     ...base,
//                     borderRadius: "0.5rem",
//                     minHeight: "42px",
//                     borderColor: "#e5e7eb",
//                     boxShadow: "none"
//                   }),

//                   menuPortal: (base) => ({
//                     ...base,
//                     zIndex: 9999
//                   }),

//                   menu: (base) => ({
//                     ...base,
//                     zIndex: 9999
//                   })
//                 }}
//               />

//             </div>

//           </div>

//           <DialogFooter>

//             <button
//               onClick={handleAssign}
//               className="px-4 py-2 bg-blue-600 text-white rounded-md"
//             >
//               Tugaskan
//             </button>

//           </DialogFooter>

//         </DialogContent>

//       </DialogPortal>

//     </Dialog>

//   )

// }

// import React, { useState } from "react"

// import {
//   DialogModal,
//   DialogModalTrigger,
//   DialogModalContent
// } from "./Components/ui/DialogModal"

// import CustomSelect from "./Components/CustomSelect"

// export default function Test() {

//   const [reviewer, setReviewer] = useState(null)

//   const reviewers = [
//     { identifier: "0424096001", label: "0424096001 - DIDIK NOTOSUDJONO" },
//     { identifier: "0423106505", label: "0423106505 - DOLLY PRIATNA" },
//     { identifier: "0004096908", label: "0004096908 - Indarini Dwi Pursitasari" },
//     { identifier: "0012075802", label: "0012075802 - ANNA PERMANASARI" },
//     { identifier: "0019066501", label: "0019066501 - ERI SARIMANAH" },
//     { identifier: "0404117202", label: "0404117202 - SATA YOSHIDA SRIE RAHAYU" },
//     { identifier: "0403086301", label: "0403086301 - BINA LOHITA SARI" },
//     { identifier: "0406046201", label: "0406046201 - ANI IRYANI" },
//     { identifier: "0304097004", label: "0304097004 - DWI RINI SOVIA FIRDAUS" },
//     { identifier: "0424058209", label: "0424058209 - FERI FERDINAN ALAMSYAH" }
//   ]

//   const handleAssign = () => {

//     if (!reviewer) {
//       alert("Pilih reviewer terlebih dahulu")
//       return
//     }

//     console.log("Selected Reviewer:", reviewer.identifier)

//   }

//   return (
//     <div className="p-10">

//       <DialogModal>
    
//         <DialogModalTrigger asChild>
//           <button className="px-4 py-2 bg-blue-600 text-white rounded-md">
//             Tambah Reviewer
//           </button>
//         </DialogModalTrigger>

//         <DialogModalContent>
            
//           <h2 className="text-lg font-bold mb-4">
//             Tambah Reviewer Kemajuan
//           </h2>

//           <CustomSelect
//             label="NIDN"
//             records={reviewers}
//             value={reviewer}
//             onChange={(v) => {
//               console.log(v)
//               setReviewer(v)
//             }}
//             placeholder="-- Pilih Reviewer --"
//           />

//           <div className="mt-6">
//             <button
//               onClick={handleAssign}
//               className="px-4 py-2 bg-blue-600 text-white rounded-md"
//             >
//               Tugaskan
//             </button>
//           </div>

//         </DialogModalContent>

//       </DialogModal>

//     </div>
//   )
// }

import React, { useState } from "react"
import { Button } from "./Components/ui/Button"
import { ModalCollaborator } from "./Page/FileManagementPage"

export default function Test() {

  const [open, setOpen] = useState(false)

  const data = {
    targets: []
  }

  const folderKeys = ["folder-1"]

  return (
    <div className="p-10">

      <Button
        onClick={() => setOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-md"
      >
        Add Collaborator
      </Button>

      <ModalCollaborator
        open={open}
        onOpenChange={setOpen}
        folderKeys={folderKeys}
        data={data}
        extraAction={() => {
          console.log("extra action")
        }}
      />

    </div>
  )
}