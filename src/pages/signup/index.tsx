import { ChangeEvent, useState } from "react";
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
        gender: '',
        phone: '',
    });
    const [pendingApiCall, setPendingApiCall] = useState(false);
    const [apiError, setApiError] = useState(false);
    const [apiSuccess, setApiSuccess] = useState(false);
    const navigate = useNavigate();

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setForm((previousForm) => {
            return {
                ...previousForm,
                [name]: value,
            }
        })

        setErrors((previousForm) => {
            return {
                ...previousForm,
                [name]: undefined,
            }
        })
    }

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
    }

    return (
        <main>
            <div className="containerForm">
                <form className="form" onSubmit={(e) => e.preventDefault()}>
                    <h3 className="fw-normal mb-3 pb-3" style={{ letterSpacing: '1px' }}>Register for free</h3>

                    <div className="display-flex flex-column mb-2">
                        <label htmlFor="displayName">Full name</label>
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

                    <div className="display-flex flex-column mb-2">
                        <label htmlFor="email">E-Mail</label>
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

                    <div className="display-flex flex-column mb-2">
                        <label htmlFor="birthDate">Birth date</label>
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

                    <div className="display-flex sm-md-row">
                        <div className="display-flex flex-column w-100 mb-2">
                            <label htmlFor="ssn">SSN</label>
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
                        <div className="display-flex flex-column w-100 mb-2">
                            <label htmlFor="phone">Cellphone</label>
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

                    <div className="display-flex flex-column mb-2">
                        <label htmlFor="password">Password</label>
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

                    <div className="display-flex flex-column mb-2">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            id="confirmPassword"
                            className={errors.confirmPassword ? "form-control is-invalid" : "form-control"}
                            onChange={onChange}
                            value={form.confirmPassword}
                        />
                        {errors.confirmPassword && (<div className="invalid-feedback">{errors.confirmPassword}</div>)}
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
                </form>
                <img className="loginImg mb-4" src="img/colorful-ceramic-pots.jpg" alt="" />
            </div>
            <div className="text-center">
                Já possui cadastro?
                <Link className="link-primary" to="/login">Login</Link>
            </div>
        </main>
    );
}
