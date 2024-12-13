import React, { useState } from 'react';
import '../../css/login.css';
import cover from '../../assets/cover.jpg';
import axios from 'axios';

export default function HomeView() {
  // États pour les champs et les erreurs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [authError, setAuthError] = useState('');

  // Validation de l'email
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Validation du mot de passe
  const validatePassword = (password) => {
    return password.length >= 6;
  };

  // Gestionnaire de soumission du formulaire
  const handleSubmit = async (event) => {
    event.preventDefault();

    let isValid = true;

    // Validation de l'email
    if (!validateEmail(email)) {
      setEmailError('Adresse email invalide');
      isValid = false;
    } else {
      setEmailError('');
    }

    // Validation du mot de passe
    if (!validatePassword(password)) {
      setPasswordError('Le mot de passe doit comporter au moins 6 caractères');
      isValid = false;
    } else {
      setPasswordError('');
    }

    if (isValid) {
      try {
        // Appel API pour la connexion
        const response = await axios.post(`/auth/login`, {
          email,
          password,
        });

        const { access_token, expires_in, role } = response.data;
        const tokenExpiry = new Date(new Date().getTime() + expires_in * 60 * 1000).toISOString();

        // Stockage des informations dans localStorage
        localStorage.setItem('accessToken', access_token);
        localStorage.setItem('tokenExpiry', tokenExpiry);
        const encodedRole = btoa(role); // Encodage Base64 du rôle
        localStorage.setItem('role', encodedRole);

        // Redirection en fonction du rôle
        switch (role) {
          case 0:
            window.location.href = '/admin';
            break;
          case 1:
            window.location.href = '/employe';
            break;
          default:
            console.error('Rôle non géré :', role);
            break;
        }
      } catch (error) {
        console.error('Erreur :', error);
        setAuthError('Email ou mot de passe incorrect');
      }
    }
  };

  return (
    <section className="ftco-section">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-12 col-lg-10">
            <div className="wrap d-md-flex">
              <div
                className="img img-cover"
                style={{ backgroundImage: `url(${cover})` }}
              ></div>
              <div className="login-wrap p-4 p-md-5">
                <div className="d-flex">
                  <div className="w-100">
                    <h3 className="mb-4">Se connecter</h3>
                  </div>
                </div>
                <form onSubmit={handleSubmit} className="signin-form">
                  <div className="form-group mb-3">
                    <label className="label" htmlFor="email">
                      Email
                    </label>
                    <input
                      style={{ textAlign: 'left' }}
                      type="email"
                      className="form-control"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    {emailError && (
                      <div className="text-danger">{emailError}</div>
                    )}
                  </div>
                  <div className="form-group mb-3">
                    <label className="label" htmlFor="password">
                      Mot de passe
                    </label>
                    <input
                      style={{ textAlign: 'left' }}
                      type="password"
                      className="form-control"
                      placeholder="Mot de passe"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    {passwordError && (
                      <div className="text-danger">{passwordError}</div>
                    )}
                  </div>
                  <div className="form-group">
                    <button
                      type="submit"
                      className="form-control btn btn-primary rounded submit px-3 m-0"
                    >
                      Se connecter
                    </button>
                  </div>
                  {authError && (
                    <div className="form-group">
                      <div className="text-danger">{authError}</div>
                    </div>
                  )}
                  <div className="form-group d-md-flex">
                    <div className="text-left">
                      <label className="checkbox-primary mb-0 fw-bold">
                        Plateforme INVENTAIRES - FLSHM Mohammedia
                      </label>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
