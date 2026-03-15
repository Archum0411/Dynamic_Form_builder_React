import { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../Services/api";
import { ToastContainer, toast } from "react-toastify";

interface Form {
  id: number;
  name: string;
}

interface Field {
  id: number;
  formId: number;
  label: string;
  fieldType: string;
  required: boolean;
  fieldKey: string;
  formName?: string;
}

interface FieldRow {
  label: string;
  fieldType: string;
  required: boolean;
}

export default function FormBuilder() {

  const [forms, setForms] = useState<Form[]>([]);
  const [formId, setFormId] = useState<number>(0);
  const [fields, setFields] = useState<Field[]>([]);
  const [fieldRows, setFieldRows] = useState<FieldRow[]>([
    { label: "", fieldType: "text", required: false }
  ]);

  // const [label, setLabel] = useState("");
  // const [type, setType] = useState("text");
  // const [required, setRequired] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const loadForms = async () => {
    try {
      const res = await axios.get(`${API}/forms/getAllForms`);
      setForms(res.data);
    } catch {
      toast.error("Failed to load forms");
    }
  };

  const loadFields = async () => {
    try {
      const res = await axios.get(`${API}/fields/getAllFormsFields`);
      setFields(res.data);
    } catch {
      toast.error("Failed to load fields");
    }
  };

  useEffect(() => {
    loadForms();
    loadFields();
  }, []);


  const openAddModal = () => {
    // setLabel("");
    // setType("text");
    // setRequired(false);
    setEditId(null);
    setShowModal(true);
  };



  const openEditModal = (field: Field) => {
    // setLabel(field.label);
    // setType(field.fieldType);
    // setRequired(field.required);
    setEditId(field.id);
    setShowModal(true);
  };

  const saveField = async () => {
    try {
      const payload = fieldRows.map((row) => ({
        formId,
        label: row.label,
        fieldKey: row.label.toLowerCase(),
        fieldType: row.fieldType,
        required: row.required,
      }));
      if (editId) {
        await axios.put(`${API}/fields/${editId}`, payload);
        toast.success("Field updated");
      } else {
        await axios.post(`${API}/fields/create`, payload);
        toast.success("Fields created");
      }

      setFieldRows([
        { label: "", fieldType: "text", required: false }
      ]);
      setShowModal(false);
      loadFields();
    } catch {
      toast.error("Operation failed");
    }

  };

  const removeField = async (id: number) => {
    try {
      await axios.delete(`${API}/fields/${id}`);
      toast.success("Field deleted");
      loadFields();
    } catch {
      toast.error("Delete failed");
    }
  };

  const addRow = () => {
    setFieldRows([
      ...fieldRows,
      { label: "", fieldType: "text", required: false }
    ]);
  };

  const removeRow = (index: number) => {
    const updated = [...fieldRows];
    updated.splice(index, 1);
    setFieldRows(updated);
  };

  const handleChange = (
    index: number,
    key: keyof FieldRow,
    value: any
  ) => {

    const updated = [...fieldRows];
    updated[index] = {
      ...updated[index],
      [key]: value
    };
    setFieldRows(updated);
  };

  return (
    <div className="container mt-5">
      <ToastContainer />
      <div className="d-flex justify-content-between mb-3">
        <h5>Fields</h5>
        <button
          className="btn btn-primary"
          onClick={openAddModal}
        >
          + Add Field
        </button>
      </div>

      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Form Name</th>
            <th>Label</th>
            <th>Type</th>
            <th>Required</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {fields.map((f, index) => (
            <tr key={f.id}>
              <td>{index + 1}</td>
              <td>{f.formName}</td>
              <td>{f.label}</td>
              <td>{f.fieldType}</td>
              <td>{f.required ? "Yes" : "No"}</td>
              <td>
                {/* <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => openEditModal(f)}
                >
                  Edit
                </button> */}
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => removeField(f.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal fade show d-block">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Create Field
                </h5>
                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="card p-3">
                  <h5 className="mb-4">Form Builder</h5>
                  <div className="card shadow-sm mb-4">
                    <div className="card-body">
                      <label className="form-label">Select Form</label>
                      <select
                        className="form-select"
                        onChange={(e) => setFormId(Number(e.target.value))}
                      >
                        <option>Select Form</option>
                        {forms.map((f) => (
                          <option key={f.id} value={f.id}>{f.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <h5 className="mb-3">Create Fields</h5>
                  <table className="table table-bordered">
                    <thead className="table-light">
                      <tr>
                        <th>Label</th>
                        <th>Type</th>
                        <th>Required</th>
                        <th className="text-center" style={{ width: "120px" }}>
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {fieldRows.map((row, index) => (
                        <tr key={index}>
                          <td>
                            <input
                              className="form-control"
                              value={row.label}
                              onChange={(e) => handleChange(index, "label", e.target.value)}
                              placeholder="Label"
                            />
                          </td>

                          <td>
                            <select
                              className="form-select"
                              value={row.fieldType}
                              onChange={(e) => handleChange(index, "fieldType", e.target.value)}
                            >
                              <option value="text">Text</option>
                              <option value="number">Number</option>
                              <option value="date">Date</option>
                              <option value="email">Email</option>
                              <option value="password">password</option>
                            </select>
                          </td>

                          <td className="text-center">
                            <input
                              type="checkbox"
                              checked={row.required}
                              onChange={(e) => handleChange(index, "required", e.target.checked)}
                            />
                          </td>

                          <td>

                            <button
                              className="btn btn-success btn-sm me-2"
                              onClick={addRow}
                            >
                              +
                            </button>

                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => removeRow(index)}
                            >
                              🗑
                            </button>

                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-success"
                  onClick={saveField}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/*  Edit Field Modal */}

      {/* { editModal && (

        <div className="modal fade show d-block">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">  Edit Field</h5>
                <button
                  className="btn-close" 
                  onClick={() => setEditModal(false)
                }></button>
              </div>
              <div className="modal-body">
                <div className="card p-3">
                  <h5 className="mb-4">Edit Field</h5>
                  <div className="mb-3">
                    <label className="form-label">Label</label>
                    <input
                      className="form-control"
                      value={label}
                      onChange={(e) => setLabel(e.target.value)}
                      placeholder="Label"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Type</label>
                    <select
                      className="form-select"
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                    >
                      <option value="text">Text</option>
                      <option value="number">Number</option>
                      <option value="date">Date</option>
                    </select>
                  </div>
                  <div className="mb-3 form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={required}
                      onChange={(e) => setRequired(e.target.checked)}
                    />
                    <label className="form-check-label">Required</label>
                  </div>
                </div>
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
                  onClick={saveField}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>  
        )
      } */}
      
    </div>
  );
}