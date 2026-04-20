/* eslint-disable react/prop-types */
import { RiUser3Fill } from "react-icons/ri";
import Loader from "../../Components/common/Loader";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import BaseImage from "../../Components/common/BaseImage";

function LoginComponent({
  credentials,
  loading,
  showPassword,
  errors,
  onShowPassword,
  handleInputChange,
  handleSubmit,
}) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {loading ? (
        <Loader message="Signing in..." />
      ) : (
        <div className="bg-white p-10 rounded-lg shadow-lg w-96 min-h-[500px] flex flex-col justify-center">
          <div className="flex justify-center mb-4">
            <BaseImage src="/logo1.png" alt="Logo" className="h-20" />
          </div>
          <h2 className="text-2xl font-semibold text-center mb-6">Sign In</h2>

          <form onSubmit={handleSubmit}>
            {/* username Field */}
            <div className="mb-4">
              <label className="block text-gray-900 font-bold mb-1">
                Username
              </label>
              <div
                className={`flex items-center border rounded-md focus-within:border-[#845cbd] p-3 bg-gray-50 
                                                                        ${errors.username ? "border-red-500 placeholder-red-500" : "border-gray-300"}`}
              >
                <input
                  name="username"
                  type="text"
                  placeholder={
                    errors.username ? errors.username : "Enter your username"
                  }
                  value={credentials.username}
                  onChange={handleInputChange}
                  autoComplete="username"
                  className={`w-full bg-transparent outline-none ${errors.username ? "placeholder-red-500" : ""}`}
                />
                <RiUser3Fill className="text-gray-400" />
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-6">
              <label className="block text-gray-900 font-bold mb-1">
                Password
              </label>
              <div
                className={`flex items-center border rounded-md focus-within:border-[#845cbd] p-3 bg-gray-50 
                                                                        ${errors.password ? "border-red-500 placeholder-red-500" : "border-gray-300"}`}
              >
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={
                    errors.password ? errors.password : "Enter your password"
                  }
                  value={credentials.password}
                  onChange={handleInputChange}
                  autoComplete="current-password"
                  className={`w-full bg-transparent outline-none  ${errors.password ? "placeholder-red-500" : ""}`}
                />
                <button
                  type="button"
                  onClick={onShowPassword}
                  className="focus:outline-none text-xl text-gray-400"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#845cbd] text-white py-3 rounded-md font-semibold hover:bg-[#8a58d1] transition duration-300 outline-none cursor-pointer"
            >
              Sign In
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default LoginComponent;
