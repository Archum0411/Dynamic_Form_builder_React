import { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../Services/api";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface Form {
    id: number;
    name: string;
}

interface Field {
    id: number;
    label: string;
    fieldKey: string;
    fieldType: string;
    required: boolean;
}

export default function FormSubmit() {

    const navigate = useNavigate();

    const [forms, setForms] = useState<Form[]>([]);
    const [fields, setFields] = useState<Field[]>([]);
    const [formData, setFormData] = useState<any>({});
    const [formId, setFormId] = useState<number | null>(null);
    const [showModal, setShowModal] = useState(false);

    const loadForms = async () => {
        try {
            const res = await axios.get(`${API}/forms/getAllForms`);
            setForms(res.data);
        } catch {
            toast.error("Failed to load forms");
        }
    };

    const fetchFields = async (id: number) => {
        try {
            const res = await axios.get(`${API}/fields/${id}`);
            setFields(res.data);
            setFormId(id);
            setFormData({});
            setShowModal(true);

        } catch {
            toast.error("Failed to load fields");
        }
    };

    useEffect(() => {
        loadForms();
    }, []);

    const validate = () => {
        for (let field of fields) {
            const value = formData[field.fieldKey];

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

    const onChangeField = (key: string, value: any) => {
        setFormData((prev: any) => ({
            ...prev,
            [key]: value
        }));
    };

    const submit = async () => {
        if (!validate()) return;
        try {
            await axios.post(`${API}/form-data/${formId}`, formData);
            toast.success("Form submitted successfully");
            setShowModal(false);
            setTimeout(() => {
                navigate("/users"); // redirect page
            }, 1000);

        } catch {
            toast.error("Submission failed");
        }
    };



    return (

        <div className="container mt-5">

            <ToastContainer />

            <h3 className="mb-4">Forms List</h3>

            <div className="row">

                {forms.map((f) => (

                    <div key={f.id} className="col-md-4 mb-3">

                        <div
                            className="card shadow-sm h-100"
                            style={{ cursor: "pointer" }}
                            onClick={() => fetchFields(f.id)}
                        >

                            <div className="card-body text-center">

                                <h5 className="card-title" style={{ color: "blue" }}>{f.name}</h5>

                            </div>

                        </div>

                    </div>

                ))}

            </div>



            {showModal && (

                <div className="modal fade show d-block">

                    <div className="modal-dialog">

                        <div className="modal-content">

                            <div className="modal-header">

                                <h5 className="modal-title">Fill Form</h5>

                                <button
                                    className="btn-close"
                                    onClick={() => setShowModal(false)}
                                ></button>

                            </div>

                            <div className="modal-body">

                                {fields.map((f) => (

                                    <div key={f.id} className="mb-3">

                                        <label className="form-label">

                                            {f.label}

                                            {f.required && (
                                                <span className="text-danger ms-1">*</span>
                                            )}

                                        </label>


                                        {f.fieldType === "text" && (

                                            <input
                                                className="form-control"
                                                onChange={(e) =>
                                                    onChangeField(f.fieldKey, e.target.value)
                                                }
                                            />

                                        )}


                                        {f.fieldType === "number" && (

                                            <input
                                                type="number"
                                                className="form-control"
                                                onChange={(e) =>
                                                    onChangeField(f.fieldKey, e.target.value)
                                                }
                                            />

                                        )}


                                        {f.fieldType === "date" && (

                                            <input
                                                type="date"
                                                className="form-control"
                                                onChange={(e) =>
                                                    onChangeField(f.fieldKey, e.target.value)
                                                }
                                            />

                                        )}

                                        {f.fieldType === "email" && (

                                            <input
                                                type="email"
                                                className="form-control"
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
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>

                                <button
                                    className="btn btn-success"
                                    onClick={submit}
                                >
                                    Submit
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

}