// import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
//   const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-6xl font-bold text-black">404</h1>
      <p className="mt-4">Page not found</p>
    </div>
  );
}