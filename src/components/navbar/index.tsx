import { Link, useNavigate } from "react-router-dom";
import AuthService from "@/service/auth-service";
import { useState } from "react";
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import { MDBDropdown, MDBDropdownItem, MDBDropdownToggle, MDBDropdownMenu } from 'mdb-react-ui-kit';

export default function NavBar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const onClickLogout = () => {
    AuthService.logout();
    navigate("/login");
  };

  return (
    <nav className="navbar p-fixed navbar-expand-lg" style={{ backgroundColor: '#F4F5EC' }}>
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
              <li className="nav-item">
                <Link className="nav-link" to="/user">Outdoor Vases</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/login">Indoor Decoration</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/signup">Clay</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/cart">Art Material</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/cart">Plant Hangers</Link>
              </li>
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
                <Link className="nav-link" to="/cart">Cart</Link>
              </li>
              {/* Dropdown para Usuário */}
              <li className="nav-item">
                <MDBDropdown>
                  <MDBDropdownToggle tag="a" className="nav-link" role="button" aria-expanded={isOpen} style={{ display: 'flex', alignItems: 'center' }}>
                      <img src="/icon/users.svg" alt="user icon" style={{ width: '20px', marginRight: '5px' }} />
                  </MDBDropdownToggle>
                  <MDBDropdownMenu>
                    <MDBDropdownItem>
                      <Link to="/login" className="dropdown-item">Log in</Link>
                    </MDBDropdownItem>
                    <MDBDropdownItem>
                      <Link to="/signup" className="dropdown-item">Register for free</Link>
                    </MDBDropdownItem>
                    <MDBDropdownItem>
                      <Link to="/user" className="dropdown-item">User Page</Link>
                    </MDBDropdownItem>
                    <MDBDropdownItem>
                      <button className="dropdown-item" onClick={onClickLogout}>Logout</button>
                    </MDBDropdownItem>
                  </MDBDropdownMenu>
                </MDBDropdown>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
