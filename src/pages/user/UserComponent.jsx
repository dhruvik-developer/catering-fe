/* eslint-disable react/prop-types */
import Loader from "../../Components/common/Loader";
import UsersTable from "../../Components/user/UserTable";
import Button from "../../Components/common/Button";
import PageHeader from "../../Components/common/PageHeader";
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
    <div className="p-4 sm:p-6 bg-white rounded-xl shadow-lg">
      <PageHeader
        icon={<FiUsers size={22} />}
        title="Users"
        subtitle={`${users?.length || 0} user${users?.length !== 1 ? "s" : ""} registered`}
        actions={
          <>
            <Button
              onClick={onUserAdd}
              leftIcon={<FiUserPlus size={15} />}
            >
              Add User
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate("/add-rule", { state: "addrule" })}
              leftIcon={<FiBook size={15} />}
            >
              Add Rule
            </Button>
          </>
        }
        className="mb-6"
      />
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
