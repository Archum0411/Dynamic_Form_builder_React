import { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../Services/api";
import { ToastContainer, toast } from "react-toastify";

interface User {
  id: number
  formId: number
  data: Record<string, any>
}

interface Field {
  id: number
  label: string
  fieldKey: string
  fieldType: string
  required: boolean
}

export default function Home() {

  const [users, setUsers] = useState<User[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const [userData, setUserData] = useState<Record<string, any>>({});
  const [editId, setEditId] = useState<number | null>(null);
  const [editModal, setEditModal] = useState(false);

  // load users
  const getUser = async () => {
    try {
      const res = await axios.get(`${API}/form-data/userdetails`);
      const parsed = res.data.map((item: any) => ({
        ...item,
        data: JSON.parse(item.data)
      }));
      setUsers(parsed);
    } catch {
      toast.error("Failed to load users");
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  // dynamic table columns
  const columns = Array.from(
    new Set(users.flatMap((u) => Object.keys(u.data)))
  );

  // open edit modal
  const editUser = async (user: User) => {
    try {
      setEditId(user.id);
      setUserData(user.data);
      // load form fields using formId
      const res = await axios.get(`${API}/fields/${user.formId}`);
      setFields(res.data);
      setEditModal(true);
    } catch {
      toast.error("Failed to load form");
    }
  };

  // input change
  const onChangeField = (key: string, value: any) => {
    setUserData((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  // validation
  const validate = () => {
    for (let field of fields) {
      const value = userData[field.fieldKey];
      if (field.required && !value) {
        toast.warning(`${field.label} is required`);
        return false;
      }

      if (field.fieldType === "email") {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(value)) {
          toast.error("Invalid Email");
          return false;
        }
      }
    }
    return true;
  };

  // update user
  const updateUser = async () => {
    if (!validate()) return;
    try {
      await axios.put(`${API}/form-data/update/${editId}`, userData);
      toast.success("User updated");
      setEditModal(false);
      getUser();
    } catch {
      toast.error("Update failed");
    }
  };

  // Delete user
  const deleteUser = async (id: number) => {
    try {
      await axios.delete(`${API}/form-data/delete/${id}`);
      toast.success("User deleted");
      getUser();
    } catch {
      toast.error("Delete failed");
    }
  }
  
  return (
    <div className="container mt-5">
      <ToastContainer />
      <h3 className="mb-4">User List</h3>
      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            {columns.map((col) => (
              <th key={col}>{col}</th>
            ))}
            <th style={{ width: "150px" }}>Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user, index) => (

            <tr key={user.id}>
              <td>{index + 1}</td>

              {columns.map((col) => (
                <td key={col}>
                  {user.data[col] ?? "-"}
                </td>
              ))}

              <td>

                <button
                  className="btn btn-primary btn-sm me-2"
                  onClick={() => editUser(user)}
                >
                  Edit
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteUser(user.id)}
                >
                  Delete
                </button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}

      {editModal && (
        <div className="modal fade show d-block">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit User</h5>
                <button
                  className="btn-close"
                  onClick={() => setEditModal(false)}
                ></button>
              </div>

              <div className="modal-body">
                {fields.map((f) => (
                  <div key={f.id} className="mb-3">
                    <label className="form-label">
                      {f.label}
                      {f.required &&
                        <span className="text-danger ms-1">*</span>
                      }
                    </label>

                    {f.fieldType === "text" && (
                      <input
                        className="form-control"
                        value={userData[f.fieldKey] || ""}
                        onChange={(e) =>
                          onChangeField(f.fieldKey, e.target.value)
                        }
                      />
                    )}

                    {f.fieldType === "number" && (
                      <input
                        type="number"
                        className="form-control"
                        value={userData[f.fieldKey] || ""}
                        onChange={(e) =>
                          onChangeField(f.fieldKey, e.target.value)
                        }
                      />
                    )}

                    {f.fieldType === "date" && (
                      <input
                        type="date"
                        className="form-control"
                        value={userData[f.fieldKey] || ""}
                        onChange={(e) =>
                          onChangeField(f.fieldKey, e.target.value)
                        }
                      />
                    )}

                    {f.fieldType === "email" && (
                      <input
                        type="email"
                        className="form-control"
                        value={userData[f.fieldKey] || ""}
                        onChange={(e) =>
                          onChangeField(f.fieldKey, e.target.value)
                        }
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setEditModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-success"
                  onClick={updateUser}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

}