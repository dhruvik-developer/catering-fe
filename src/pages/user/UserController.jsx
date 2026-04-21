import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserComponent from "./UserComponent";
import toast from "react-hot-toast";
import { getUsers } from "../../api/FetchUsers";
import DeleteConfirmation from "../../Components/common/DeleteConfirmation";

function UserController() {
  const navigate = useNavigate();
  const hasFetched = useRef(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      if (response.data.data) {
        setUsers(response.data.data);
      } else {
        toast.error("Failed to fetch users");
      }
    } catch (error) {
      toast.error("Error fetching users");
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasFetched.current) {
      fetchUsers();
      hasFetched.current = true;
    }
  }, []);

  // Handle Add Users
  const handleAddUsers = () => {
    navigate("/add-user", { state: { mode: "addUser" } });
  };

  // Handle Edit Users
  const handleEditUsers = (id) => {
    navigate(`/edit-user/${id}`, { state: { mode: "editUser" } });
  };

  // Handle Delete Users
  const handleDeleteUsers = (id) => {
    DeleteConfirmation({
      id,
      apiEndpoint: "/users",
      name: "user",
      successMessage: "User deleted successfully!",
      onSuccess: fetchUsers,
    });
  };

  return (
    <UserComponent
      navigate={navigate}
      loading={loading}
      users={users}
      onUserAdd={handleAddUsers}
      onUserEdit={handleEditUsers}
      onUserDelete={handleDeleteUsers}
    />
  );
}

export default UserController;
