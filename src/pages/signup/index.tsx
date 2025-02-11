import {  useState } from "react";
import { IUserSignUp } from "@/commons/interfaces.ts";
import AuthService from "@/service/auth-service";
import { ButtonWithProgress } from "@/components/button-with-progress";
import { Link, useNavigate } from "react-router-dom";

export function UserSignupPage() {
    const [form, setForm] = useState<IUserSignUp>({
        email: '',
        displayName: '',
        password: '',
        ssn: '',
        birthDate: new Date(),
        gender: '',
        phone: '',
    });
    const [errors, setErrors] = useState({
        email: '',
        displayName: '',
        password: '',
        ssn: '',
        birthDate: '',
        gender: '',
        phone: '',
    });
    const [pendingApiCall, setPendingApiCall] = useState(false);
    const [apiError, setApiError] = useState(false);
    const [apiSuccess, setApiSuccess] = useState(false);
    const navigate = useNavigate();

    const onChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setForm((previousForm) => ({
            ...previousForm,
            [name]: value,
        }));

        setErrors((previousForm) => ({
            ...previousForm,
            [name]: undefined,
        }));
    };

    const onClickSignup = async () => {
        setPendingApiCall(true);
        setApiError(false);
        const response = await AuthService.signup(form);

        if (response.status === 200 || response.status === 201) {
            setApiSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } else {
            if (response.data.validationErrors) {
                setErrors(response.data.validationErrors);
            }
            setApiError(true);
            setPendingApiCall(false);
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
                                src="img/colorful-ceramic-2.jpg"
                                alt="Register image"
                                className="w-100 vh-100"
                                style={{ objectFit: 'cover', objectPosition: 'left' }}
                            />
                        </div>

                        {/* Right form section */}
                        <div className="col-sm-6 text-black">
                            <div className="d-flex align-items-center h-custom-2 px-5 ms-xl-4 mt-5 pt-5 pt-xl-0 mt-xl-5">
                                <form style={{ width: '23rem' }}>
                                    <h3 className="fw-normal mb-3 pb-3" style={{ letterSpacing: '1px' }}>Register for free</h3>

                                    <div className=" mb-4">
                                        <label className="form-label" htmlFor="displayName">Full name</label>
                                        <input
                                            type="text"
                                            name="displayName"
                                            id="displayName"
                                            className={errors.displayName ? "form-control is-invalid" : "form-control"}
                                            onChange={onChange}
                                            value={form.displayName}
                                        />
                                        {errors.displayName && (<div className="invalid-feedback">{errors.displayName}</div>)}
                                    </div>

                                    <div className=" mb-4">
                                        <label className="form-label" htmlFor="email">E-Mail</label>
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            className={errors.email ? "form-control is-invalid" : "form-control"}
                                            onChange={onChange}
                                            value={form.email}
                                        />
                                        {errors.email && (<div className="invalid-feedback">{errors.email}</div>)}
                                    </div>
                                    <div className="row mb-4">
                                        <div className="col-sm-6">
                                            <label className="form-label" htmlFor="birthDate">Birth date</label>
                                            <input
                                                type="date"
                                                name="birthDate"
                                                id="birthDate"
                                                className={errors.birthDate ? "form-control is-invalid" : "form-control"}
                                                onChange={onChange}
                                                value={form.birthDate.toString().substring(0, 10)}
                                            />
                                            {errors.birthDate && (<div className="invalid-feedback">{errors.birthDate}</div>)}
                                        </div>

                                        <div className="col-sm-6">
                                            <label className="form-label" htmlFor="gender">Gender</label>
                                            <select
                                                name="gender"
                                                id="gender"
                                                className={errors.gender ? "form-select is-invalid" : "form-select"}
                                                onChange={onChange}
                                                value={form.gender}
                                            >
                                                <option value="">Select Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                            {errors.gender && (<div className="invalid-feedback">{errors.gender}</div>)}
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-sm-6 mb-4">
                                            <label className="form-label" htmlFor="ssn">SSN</label>
                                            <input
                                                type="text"
                                                name="ssn"
                                                id="ssn"
                                                className={errors.ssn ? "form-control is-invalid" : "form-control"}
                                                onChange={onChange}
                                                value={form.ssn}
                                            />
                                            {errors.ssn && (<div className="invalid-feedback">{errors.ssn}</div>)}
                                        </div>

                                        <div className="col-sm-6 mb-4">
                                            <label className="form-label" htmlFor="phone">Cellphone</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                id="phone"
                                                className={errors.phone ? "form-control is-invalid" : "form-control"}
                                                onChange={onChange}
                                                value={form.phone}
                                            />
                                            {errors.phone && (<div className="invalid-feedback">{errors.phone}</div>)}
                                        </div>
                                    </div>

                                    <div className=" mb-4">
                                        <label className="form-label" htmlFor="password">Password</label>
                                        <input
                                            type="password"
                                            name="password"
                                            id="password"
                                            className={errors.password ? "form-control is-invalid" : "form-control"}
                                            onChange={onChange}
                                            value={form.password}
                                        />
                                        {errors.password && (<div className="invalid-feedback">{errors.password}</div>)}
                                    </div>

                                    {apiError && <div className="alert alert-danger">Falha ao autenticar-se!</div>}
                                    {apiSuccess && <div className="alert alert-success">Cadastro realizado com sucesso!</div>}

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
                                        Já possui cadastro? <Link className="link-primary" to="/login">Login</Link>
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
