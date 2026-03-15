import { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../Services/api";
import { ToastContainer, toast } from "react-toastify";

interface Form {
  id: number;
  name: string;
}

export default function FormList() {

  const [forms, setForms] = useState<Form[]>([]);
  const [name, setName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const loadForms = async () => {
    try {
      const res = await axios.get(`${API}/forms/getAllForms`);
      setForms(res.data);
    } catch (error) {
      toast.error("Failed to load forms");
    }
  };

  useEffect(() => {
    loadForms();
  }, []);

  const addForm = async () => {

    if (!name.trim()) {
      toast.warning("Form name required");
      return;
    }

    try {
      await axios.post(`${API}/forms`, { name });
      toast.success("Form created successfully");
      setName("");
      setShowModal(false);
      loadForms();

    } catch (error) {
      toast.error("Error creating form");
    }
  };

  const updateForm = async (id: number) => {
    try {
      await axios.put(`${API}/forms/update/${id}`, { name: `${name}` });
      toast.success("Form updated");
      loadForms();
    } catch (error) {
      toast.error("Error updating form");
    }
  }

  const removeForm = async (id: number) => {
    try {
      await axios.delete(`${API}/forms/delete/${id}`);
      toast.success("Form deleted");
      loadForms();
    } catch (error) {
      toast.error("Delete failed");
    }

  };

  const editForm = async (id: number) => {
    try {
      const res = await axios.get(`${API}/forms/edit/${id}`);
      setName(res.data.name);
      setEditId(id);
      setEditModal(true);
      toast.success("Form loaded for editing");
      loadForms();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="container mt-5">

      <ToastContainer />

      {/* Create Button */}
      <div className="d-flex justify-content-end mb-3">
        <button
          className="btn btn-primary mb-3"
          onClick={() => setShowModal(true)}
        >
          Create Form Name
        </button>
      </div>


      {/* Form List */}
      <table className="table table-bordered table-hover">
        <thead >
          <tr>
            <th>S.No</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {forms.map((f, index) => (
            <tr key={f.id}>
              <td>{index + 1}</td>
              <td>{f.name}</td>
              <td>
                <button
                  className="btn btn-primary btn-sm me-2"
                  onClick={() => editForm(f.id)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => removeForm(f.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (

        <div className="modal fade show d-block">
          <div className="modal-dialog">

            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">Create Form Name</h5>

                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <div className="modal-body">

                <input
                  className="form-control"
                  placeholder="Form Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

              </div>

              <div className="modal-footer">

                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>

                <button
                  className="btn btn-success"
                  onClick={addForm}
                >
                  Save
                </button>

              </div>

            </div>

          </div>
        </div>

      )}

      {/* Edit Modal */}
      {editModal && (
        <div className="modal fade show d-block">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Form Name</h5>
                <button
                  className="btn-close"
                  onClick={() => setEditModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <input
                  className="form-control"
                  placeholder="Form Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setEditModal(false)}
                >
                  Close
                </button>
                <button
                  className="btn btn-success"
                  onClick={() => {
                    updateForm(forms.find((f) => f.id === editId)?.id ?? 0);
                    setEditModal(false);
                  }}
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