/* eslint-disable react/prop-types */
import Loader from "../../Components/common/Loader";
import UsersTable from "../../Components/user/UserTable";
import { FiUsers, FiUserPlus, FiBook } from "react-icons/fi";

function UserComponent({
  navigate,
  loading,
  users,
  onUserAdd,
  onUserEdit,
  onUserDelete,
}) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#f4effc]">
            <FiUsers className="text-[#845cbd]" size={22} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Users</h2>
            <p className="text-sm text-gray-400">
              {users?.length || 0} user{users?.length !== 1 ? "s" : ""}{" "}
              registered
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onUserAdd}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#845cbd] hover:bg-[#7350a8] text-white text-sm font-medium rounded-lg cursor-pointer transition-colors duration-200"
          >
            <FiUserPlus size={15} />
            Add User
          </button>
          <button
            onClick={() => navigate("/add-rule", { state: "addrule" })}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-[#f4effc] text-[#845cbd] text-sm font-medium rounded-lg border border-[#845cbd] cursor-pointer transition-colors duration-200"
          >
            <FiBook size={15} />
            Add Rule
          </button>
        </div>
      </div>
      {loading ? (
        <Loader message="Loading users..." />
      ) : (
        <UsersTable
          users={users}
          onUserEdit={onUserEdit}
          onUserDelete={onUserDelete}
        />
      )}
    </div>
  );
}

export default UserComponent;
