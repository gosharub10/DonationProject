import { useEffect, useState } from "react";

import {
  deleteUser,
  getUsers,
} from "../../services/userService";

const UsersPage = () => {
  const [users, setUsers] = useState<any[]>([]);

  const fetchUsers = async () => {
    const data = await getUsers();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    await deleteUser(id);
    fetchUsers();
  };

  return (
    <div className="container page">
      <h1 className="title">Пользователи</h1>

      <div className="users-grid">
        {users.map((user) => (
          <div className="user-card" key={user.id}>
            <h3>{user.name}</h3>

            <p>{user.email}</p>

            <div className="badge">
              {user.role}
            </div>

            <button
              className="delete-btn"
              onClick={() =>
                handleDelete(user.id)
              }
            >
              Удалить
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersPage;