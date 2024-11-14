import React, { useContext } from 'react';
import { UserContext } from '../../UserContext';

function Aside({ setActiveComponent, activeComponent }) {
  const { userInfo } = useContext(UserContext);

  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4">
      <a type='button' className="brand-link" style={{ textAlign: 'center' }}>
        <span className="brand-text font-weight-light text-white">FLSHM</span>
      </a>

      <div className="sidebar">
        <div className="user-panel mt-3 pb-3 mb-3 d-flex">
          <div className="image">
            <img src="https://cdn-icons-png.flaticon.com/512/9187/9187604.png" className="img-circle elevation-2" alt="User Image" />
          </div>
          <div className="info">
          {userInfo ? (
              <a type='button' className="d-block text-white">
                {userInfo.nom} {userInfo.prénom}
              </a>
            ) : (
              <a type='button' className="d-block text-white">
                Loading...
              </a>
            )}
          </div>
        </div>

        <nav className="mt-2">
          <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
            <li className="nav-item menu-open">
              <a
                type='button'
                className={`nav-link ${activeComponent === "Dashboard" ? "active" : ""}`}
                onClick={() => setActiveComponent("Dashboard")}
              >
                <i className="nav-icon fas fa-tachometer-alt"></i>
                <p>
                  Pages de démarrage
                  <i className="right fas fa-angle-left"></i>
                </p>
              </a>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <a
                    type='button'
                    className={`nav-link ${activeComponent === "Statistiques" ? "active" : ""}`}
                    onClick={() => setActiveComponent("Statistiques")}
                  >
                    <i className="far fa-circle nav-icon"></i>
                    <p>Statistiques</p>
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    type='button'
                    className={`nav-link ${activeComponent === "Users" ? "active" : ""}`}
                    onClick={() => setActiveComponent("Users")}
                  >
                    <i className="far fa-circle nav-icon"></i>
                    <p>Utilisateurs</p>
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    type='button'
                    className={`nav-link ${activeComponent === "Articles" ? "active" : ""}`}
                    onClick={() => setActiveComponent("Articles")}
                  >
                    <i className="far fa-circle nav-icon"></i>
                    <p>Articles</p>
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    type='button'
                    className={`nav-link ${activeComponent === "Equipes" ? "active" : ""}`}
                    onClick={() => setActiveComponent("Equipes")}
                  >
                    <i className="far fa-circle nav-icon"></i>
                    <p>Equipes</p>
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    type='button'
                    className={`nav-link ${activeComponent === "Laboratoires" ? "active" : ""}`}
                    onClick={() => setActiveComponent("Laboratoires")}
                  >
                    <i className="far fa-circle nav-icon"></i>
                    <p>Laboratoires</p>
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    type='button'
                    className={`nav-link ${activeComponent === "Doctorants" ? "active" : ""}`}
                    onClick={() => setActiveComponent("Doctorants")}
                  >
                    <i className="far fa-circle nav-icon"></i>
                    <p>Doctorants</p>
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    type='button'
                    className={`nav-link ${activeComponent === "Livres" ? "active" : ""}`}
                    onClick={() => setActiveComponent("Livres")}
                  >
                    <i className="far fa-circle nav-icon"></i>
                    <p>Livres</p>
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}

export default Aside;
