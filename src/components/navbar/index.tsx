import { Link, useNavigate } from "react-router-dom";
import AuthService from "@/service/auth-service";
import { useState } from "react";
import 'mdb-react-ui-kit/dist/css/mdb.min.css';

export default function NavBar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const onClickLogout = () => {
    AuthService.logout();
    navigate("/login");
  };

  return (
    <nav className="navbar p-fixed navbar-expand-lg">
      <div className="container-fluid">
        {/* Botão de colapso para mobile */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-controls="navbarSupportedContent"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
        >
  <img src='/icon/menu.svg' alt="Menu Icon" className="menu-icon" />
        </button>

        <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`} id="navbarSupportedContent">
          {/* Logo */}
          <Link className="navbar-brand mt-2 mt-lg-0" to="/">
            <img src={'img/logo.png'} alt="Logo" loading="lazy" className="img-fluid logo" />
          </Link>
          {/* Links de produtos */}
          <div id="product-links">
            <ul className="navbar-nav ms-lg-auto mb-2 mb-lg-0">
              {["Outdoor Vases", "Indoor Decoration", "Clay", "Art Material", "Plant Hangers"].map((item, index) => (
                <li className="nav-item" key={index}>
                  <a className="nav-link" href="/#product-cards">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Elementos da direita */}
          <div className="ms-auto d-flex flex-column flex-lg-row">
            {/* Barra de pesquisa */}
            <form className="d-flex input-group w-auto">
              <input type="search" className="form-control rounded" placeholder="Search" aria-label="Search" />
            </form>

            {/* Links adicionais */}
            <ul className="navbar-nav ms-lg-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/#aboutus">About us</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/login">Log in</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/signup">Register for free</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/cart">Cart</Link>
              </li>
              <li className="nav-item">
                <button className="nav-link" onClick={onClickLogout}>Logout</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
