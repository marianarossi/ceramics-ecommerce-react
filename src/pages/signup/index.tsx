import { useState } from "react";
import { IUserSignUp } from "@/commons/interfaces.ts";
import AuthService from "@/service/auth-service";
import { ButtonWithProgress } from "@/components/button-with-progress";
import { Link, useNavigate } from "react-router-dom";

export function UserSignupPage() {
    const [form, setForm] = useState<IUserSignUp & { confirmPassword?: string }>({
        email: "",
        displayName: "",
        password: "",
        confirmPassword: "",
        ssn: "",
        birthDate: new Date(),
        gender: "",
        phone: "",
    });

    const [errors, setErrors] = useState({
        email: "",
        displayName: "",
        password: "",
        confirmPassword: "",
        ssn: "",
        birthDate: "",
        gender: "",
        phone: "",
    });

    const [pendingApiCall, setPendingApiCall] = useState(false);
    const [apiError, setApiError] = useState(false);
    const [apiSuccess, setApiSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const validateBirthDate = (birthDate: string) => {
        const date = new Date(birthDate);
        const now = new Date();
        const minDate = new Date("1900-01-01");
        return date <= now && date >= minDate;
    };

    const onChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = event.target;
        setForm((previousForm) => ({
            ...previousForm,
            [name]: value,
        }));

        setErrors((previousErrors) => ({
            ...previousErrors,
            [name]: "",
        }));
    };

    const onClickSignup = async () => {
        const currentErrors: Record<string, string> = {};

        if (!validateEmail(form.email)) {
            currentErrors.email = "Please enter a valid email address.";
        }
        if (!form.displayName.trim()) {
            currentErrors.displayName = "Full name is required.";
        }
        if (!form.password) {
            currentErrors.password = "Password is required.";
        }
        if (form.password !== form.confirmPassword) {
            currentErrors.confirmPassword = "Passwords do not match.";
        }
        const birthDateString =
            form.birthDate instanceof Date
                ? form.birthDate.toISOString().substring(0, 10)
                : form.birthDate;
        if (!validateBirthDate(birthDateString)) {
            currentErrors.birthDate = "Please enter a valid birth date.";
        }


        if (Object.keys(currentErrors).length > 0) {
            setErrors((prev) => ({ ...prev, ...currentErrors }));
            return;
        }

        setPendingApiCall(true);
        setApiError(false);

        try {
            const { confirmPassword, ...payload } = form;
            const response = await AuthService.signup(payload);

            if (response.status === 200 || response.status === 201) {
                setApiSuccess(true);
                setPendingApiCall(false);
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            } else {
                // If API returns errors (e.g. email already exists)
                if (response.data.validationErrors) {
                    setErrors((prev) => ({
                        ...prev,
                        ...response.data.validationErrors,
                    }));
                } else if (
                    response.data.message &&
                    response.data.message.includes("Email already exists")
                ) {
                    setErrors((prev) => ({
                        ...prev,
                        email: "This email is already in use. Please choose another one.",
                    }));
                } else {
                    setErrors((prev) => ({
                        ...prev,
                        email: "An unexpected error occurred.",
                    }));
                }
                setApiError(true);
                setPendingApiCall(false);
            }
        } catch (error: any) {
            setPendingApiCall(false);
            if (error.response) {
                const { data } = error.response;
                if (data.validationErrors) {
                    setErrors((prev) => ({
                        ...prev,
                        ...data.validationErrors,
                    }));
                } else if (
                    data.message &&
                    data.message.includes("Email already exists")
                ) {
                    setErrors((prev) => ({
                        ...prev,
                        email: "This email is already in use. Please choose another one.",
                    }));
                } else {
                    setErrors((prev) => ({
                        ...prev,
                        email: "An unexpected error occurred.",
                    }));
                }
            }
            setApiError(true);
        }
    };

    return (
        <main>
            <section className="vh-100">
                <div className="container-fluid">
                    <div className="row">
                        {/* Left image section */}
                        <div className="col-sm-6 px-0 d-none d-sm-block">
                            <img
                                src="/img/crackedceramic.jpg"
                                alt="Register image"
                                className="w-100 vh-100"
                                style={{ objectFit: "cover", objectPosition: "left" }}
                            />
                        </div>

                        {/* Right form section */}
                        <div className="col-sm-6 text-black">
                            <div className="d-flex align-items-center h-custom-2 px-5 ms-xl-4 mt-5 pt-5 pt-xl-0 mt-xl-5">
                                <form
                                    style={{ width: "23rem" }}
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        onClickSignup();
                                    }}
                                >
                                    <h3
                                        className="fw-normal mb-3 pb-3"
                                        style={{ letterSpacing: "1px" }}
                                    >
                                        Register for free
                                    </h3>

                                    <div className="mb-4">
                                        <label className="form-label" htmlFor="displayName">
                                            Full name
                                        </label>
                                        <input
                                            type="text"
                                            name="displayName"
                                            id="displayName"
                                            className={
                                                errors.displayName
                                                    ? "form-control is-invalid"
                                                    : "form-control"
                                            }
                                            onChange={onChange}
                                            value={form.displayName}
                                        />
                                        {errors.displayName && (
                                            <div className="invalid-feedback">
                                                {errors.displayName}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label" htmlFor="email">
                                            E-Mail
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            className={
                                                errors.email ? "form-control is-invalid" : "form-control"
                                            }
                                            onChange={onChange}
                                            value={form.email}
                                        />
                                        {errors.email && (
                                            <div className="invalid-feedback">{errors.email}</div>
                                        )}
                                    </div>

                                    <div className="row mb-4">
                                        <div className="col-sm-6">
                                            <label className="form-label" htmlFor="birthDate">
                                                Birth date
                                            </label>
                                            <input
                                                type="date"
                                                name="birthDate"
                                                id="birthDate"
                                                className={
                                                    errors.birthDate
                                                        ? "form-control is-invalid"
                                                        : "form-control"
                                                }
                                                onChange={onChange}
                                                value={
                                                    form.birthDate instanceof Date
                                                        ? form.birthDate.toISOString().substring(0, 10)
                                                        : form.birthDate
                                                }
                                            />
                                            {errors.birthDate && (
                                                <div className="invalid-feedback">
                                                    {errors.birthDate}
                                                </div>
                                            )}
                                        </div>

                                        <div className="col-sm-6">
                                            <label className="form-label" htmlFor="gender">
                                                Gender
                                            </label>
                                            <select
                                                name="gender"
                                                id="gender"
                                                className={
                                                    errors.gender ? "form-select is-invalid" : "form-select"
                                                }
                                                onChange={onChange}
                                                value={form.gender}
                                            >
                                                <option value="">Select Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                            {errors.gender && (
                                                <div className="invalid-feedback">{errors.gender}</div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-sm-6 mb-4">
                                            <label className="form-label" htmlFor="ssn">
                                                SSN
                                            </label>
                                            <input
                                                type="text"
                                                name="ssn"
                                                id="ssn"
                                                className={
                                                    errors.ssn ? "form-control is-invalid" : "form-control"
                                                }
                                                onChange={onChange}
                                                value={form.ssn}
                                            />
                                            {errors.ssn && (
                                                <div className="invalid-feedback">{errors.ssn}</div>
                                            )}
                                        </div>

                                        <div className="col-sm-6 mb-4">
                                            <label className="form-label" htmlFor="phone">
                                                Cellphone
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                id="phone"
                                                className={
                                                    errors.phone ? "form-control is-invalid" : "form-control"
                                                }
                                                onChange={onChange}
                                                value={form.phone}
                                            />
                                            {errors.phone && (
                                                <div className="invalid-feedback">{errors.phone}</div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mb-4 position-relative">
                                        <label className="form-label" htmlFor="password">
                                            Password
                                        </label>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            id="password"
                                            className={
                                                errors.password
                                                    ? "form-control is-invalid"
                                                    : "form-control"
                                            }
                                            onChange={onChange}
                                            value={form.password}
                                        />
                                        <span
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            style={{
                                                position: "absolute",
                                                right: "10px",
                                                top: "55%",
                                                cursor: "pointer",
                                            }}
                                        >
                                            <img
                                                src={showPassword ? "/icon/eye-off.svg" : "/icon/eye.svg"}
                                                alt={showPassword ? "Hide password" : "Show password"}
                                                style={{ width: "20px", height: "20px" }}
                                            />
                                        </span>
                                        {errors.password && (
                                            <div className="invalid-feedback">{errors.password}</div>
                                        )}
                                    </div>

                                    <div className="mb-4 position-relative">
                                        <label className="form-label" htmlFor="confirmPassword">
                                            Confirm Password
                                        </label>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            id="confirmPassword"
                                            className={
                                                errors.confirmPassword
                                                    ? "form-control is-invalid"
                                                    : "form-control"
                                            }
                                            onChange={onChange}
                                            value={form.confirmPassword}
                                        />
                                        {errors.confirmPassword && (
                                            <div className="invalid-feedback">
                                                {errors.confirmPassword}
                                            </div>
                                        )}
                                    </div>

                                    {apiError && (
                                        <div className="alert alert-danger">
                                            Falha ao autenticar-se!
                                        </div>
                                    )}
                                    {apiSuccess && (
                                        <div className="alert alert-success">
                                            Cadastro realizado com sucesso!
                                        </div>
                                    )}

                                    <div className="pt-1 mb-4">
                                        <ButtonWithProgress
                                            disabled={pendingApiCall}
                                            pendingApiCall={pendingApiCall}
                                            className="btn btn-info btn-lg btn-block"
                                            text="Register"
                                            onClick={onClickSignup}
                                        />
                                    </div>

                                    <div className="text-center">
                                        Já possui cadastro?{" "}
                                        <Link className="link-primary" to="/login">
                                            Login
                                        </Link>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}