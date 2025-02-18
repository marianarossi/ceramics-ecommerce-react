import { useState, useEffect } from "react";
import { IUser, IUserUpdate } from "@/commons/interfaces.ts";
import UserService from "@/service/user-service.ts";
import { ButtonWithProgress } from "@/components/button-with-progress";

interface UserEditModalProps {
    modalOpen: boolean;
    setModalOpen: (open: boolean) => void;
    onUserSaved: (updatedUser: IUser) => void;
    userToEdit: IUser | null;
}

export function UserEditModal({ modalOpen, setModalOpen, onUserSaved, userToEdit }: UserEditModalProps) {
    const [form, setForm] = useState<IUserUpdate>({
        id: userToEdit?.id,
        displayName: userToEdit?.displayName || "",
        password: "",
        ssn: userToEdit?.ssn || "",
        birthDate: userToEdit?.birthDate ? userToEdit.birthDate.substring(0, 10) : "",
        gender: userToEdit?.gender || "",
        phone: userToEdit?.phone || "",
    });

    const [errors, setErrors] = useState<any>({});
    const [pendingApiCall, setPendingApiCall] = useState(false);
    const [apiError, setApiError] = useState(false);

    useEffect(() => {
        if (userToEdit) {
            setForm({
                id: userToEdit.id,
                displayName: userToEdit.displayName || "",
                password: "", // do not prefill password
                ssn: userToEdit.ssn || "",
                birthDate: userToEdit.birthDate ? userToEdit.birthDate.substring(0, 10) : "",
                gender: userToEdit.gender || "",
                phone: userToEdit.phone || "",
            });
        }
    }, [userToEdit]);

    if (!modalOpen) {
        return null;
    }

    const onChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
        setErrors((prevErrors: any) => ({
            ...prevErrors,
            [name]: "",
        }));
    };

    const onSave = async () => {
        setPendingApiCall(true);
        setApiError(false);

        try {
            const response = await UserService.update(form);

            if (response.status === 200) {
                onUserSaved(response.data);
                setModalOpen(false);
            } else {
                if (response.data.validationErrors) {
                    setErrors(response.data.validationErrors);
                }
                setApiError(true);
            }
        } catch (error) {
            setApiError(true);
            console.log(error);
        } finally {
            setPendingApiCall(false);
        }
    };

    return (
        <div className="modal show d-block" tabIndex={-1}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Edit User</h5>
                        <button type="button" className="btn-close" onClick={() => setModalOpen(false)}></button>
                    </div>
                    <div className="modal-body">
                        {/* Display email as read-only */}
                        <div className="mb-3">
                            <label className="form-label">E-Mail</label>
                            <input
                                type="email"
                                name="email"
                                value={userToEdit?.email || ""}
                                className="form-control"
                                disabled
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Full Name</label>
                            <input
                                type="text"
                                name="displayName"
                                value={form.displayName}
                                onChange={onChange}
                                className={errors.displayName ? "form-control is-invalid" : "form-control"}
                            />
                            {errors.displayName && <div className="invalid-feedback">{errors.displayName}</div>}
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Birth Date</label>
                            <input
                                type="date"
                                name="birthDate"
                                value={form.birthDate}
                                onChange={onChange}
                                className={errors.birthDate ? "form-control is-invalid" : "form-control"}
                            />
                            {errors.birthDate && <div className="invalid-feedback">{errors.birthDate}</div>}
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Gender</label>
                            <select
                                name="gender"
                                value={form.gender}
                                onChange={onChange}
                                className={errors.gender ? "form-select is-invalid" : "form-select"}
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                            {errors.gender && <div className="invalid-feedback">{errors.gender}</div>}
                        </div>

                        <div className="mb-3">
                            <label className="form-label">SSN</label>
                            <input
                                type="text"
                                name="ssn"
                                value={form.ssn}
                                onChange={onChange}
                                className={errors.ssn ? "form-control is-invalid" : "form-control"}
                            />
                            {errors.ssn && <div className="invalid-feedback">{errors.ssn}</div>}
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Cellphone</label>
                            <input
                                type="tel"
                                name="phone"
                                value={form.phone}
                                onChange={onChange}
                                className={errors.phone ? "form-control is-invalid" : "form-control"}
                            />
                            {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={onChange}
                                className={errors.password ? "form-control is-invalid" : "form-control"}
                                placeholder="Enter new password"
                            />
                            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                        </div>

                        {apiError && <div className="alert alert-danger">Failed to update user!</div>}
                    </div>
                    <div className="modal-footer">
                        <ButtonWithProgress
                            disabled={pendingApiCall}
                            pendingApiCall={pendingApiCall}
                            className="btn btn-primary"
                            text="Save"
                            onClick={onSave}
                        />
                        <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}