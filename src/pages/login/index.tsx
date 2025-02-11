import {ChangeEvent, useState} from "react";
import {IUserLogin} from "@/commons/interfaces.ts";
import AuthService from "@/service/auth-service";
import { ButtonWithProgress } from "@/components/button-with-progress";
import { Link, useNavigate } from "react-router-dom";

export function LoginPage () {
    const [form, setForm] = useState<IUserLogin>({
        email: '',
        password: '',
    });

    const [pendingApiCall, setPendingApiCall] = useState(false);
    const [apiError, setApiError] = useState(false);
    const [apiSuccess, setApiSuccess] = useState(false);
    const navigate = useNavigate();

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setForm( (previousForm) => {
            return {
                ...previousForm,
                [name]: value,
            }
        })
    }

    const onClickLogin = async () => {
        setPendingApiCall(true);
        setApiError(false);

        const response = await AuthService.login(form);
        if (response.status === 200) {
            //setPendingApiCall(false);
            setApiSuccess(true);
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } else {
            setPendingApiCall(false);
            setApiError(true);
            console.log('Falha ao efetuar login!');
        }
    }

    return (
        <main>
            <section className="vh-100">
                <div className="container-fluid">
                    <div className="row">

                        {/* Left image section */}
                        <div className="col-sm-6 px-0 d-none d-sm-block">
                            <img src="public/img/colorful-ceramic-2.jpg"
                                 alt="Login image" className="w-100 vh-100" style={{ objectFit: 'cover', objectPosition: 'left' }} />
                        </div>

                        {/* Right form section */}
                        <div className="col-sm-6 text-black">
                            <div className="d-flex align-items-center h-custom-2 px-5 ms-xl-4 mt-5 pt-5 pt-xl-0 mt-xl-5">
                                <form style={{ width: '23rem' }}>
                                    <h3 className="fw-normal mb-3 pb-3" style={{ letterSpacing: '1px' }}>Log in</h3>

                                    <div className=" mb-4">
                                        <label className="form-label" htmlFor="form2Example18">Email address</label>
                                        <input
                                            type="email"
                                            id="form2Example18"
                                            className="form-control"
                                            name="email"
                                            onChange={onChange}
                                            value={form.email}
                                        />
                                    </div>

                                    <div className=" mb-4">
                                        <label className="form-label" htmlFor="form2Example28">Password</label>
                                        <input
                                            type="password"
                                            id="form2Example28"
                                            className="form-control"
                                            name="password"
                                            onChange={onChange}
                                            value={form.password}
                                        />
                                    </div>

                                    {apiError && <div className="alert alert-danger">Falha ao autenticar-se!</div>}
                                    {apiSuccess && <div className="alert alert-success">Usuário autenticado com sucesso!</div>}

                                    <div className="pt-1 mb-4">
                                        <ButtonWithProgress
                                            disabled={pendingApiCall}
                                            pendingApiCall={pendingApiCall}
                                            className="btn btn-info btn-lg btn-block"
                                            text="Login"
                                            onClick={onClickLogin} />
                                    </div>

                                    <p className="small mb-5 pb-lg-2">
                                        <a className="text-muted" href="#!">Forgot password?</a>
                                    </p>
                                    <p>Don't have an account? <Link to="/signup" className="link-info">Register here</Link></p>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}