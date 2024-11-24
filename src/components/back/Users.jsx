import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../../css/users.css';
import { UserContext } from '../../UserContext';

function Users() {
  const { userInfo } = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [serviceInfos, ServiceInfos] = useState([]);
  const [newUserData, setNewUserData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role: '',
    confirmPassword: '',
    service_id: '',
  });
  const [editUserData, setEditUserData] = useState(null);
  const [editPasswordData, setEditPasswordData] = useState({
    id: null,
    newPassword: '',
    confirmNewPassword: ''
  });

  const getRoleLabel = (role) => {
    switch(role) {
      case '0': return { label: "employé", color: "green" };
      case '1': return { label: "Chef de service", color: "orange" };
      case '2': return { label: "Admin", color: "blue" };
      default: return { label: "Unknown", color: "black" };
    }
  };
  const fetchData = async () => {
    try {
      const [userResponse, serviceResponse] = await Promise.all([
        axios.get('/users'),
        axios.get('/services'),
      ]);
  
      setUsers(userResponse.data.data);
      ServiceInfos(serviceResponse.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);
  

  const handleNewUserDataChange = (e) => {
    const { name, value } = e.target;
    setNewUserData({ ...newUserData, [name]: value });
  };

  const handleEditUserDataChange = (e) => {
    const { name, value } = e.target;
    setEditUserData({ ...editUserData, [name]: value });
  };

  const handleEditPasswordDataChange = (e) => {
    const { name, value } = e.target;
    setEditPasswordData({ ...editPasswordData, [name]: value });
  };

  const addUser = async () => {
    const { first_name, last_name, email, password, role, confirmPassword, service_id } = newUserData;
    if (!first_name || !last_name || !email || !password || !role || !confirmPassword || !service_id ) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
text: 'Veuillez remplir tous les champs requis !',

      });
      return;
    }
    if (password !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
text: 'Le mot de passe et la confirmation du mot de passe ne correspondent pas !',

      });
      return;
    }
    try {
      await axios.post('/users', { first_name, last_name, email, password, role, confirmPassword, service_id });
      Swal.fire({
        title: "Succès",
        text: "Un nouvel utilisateur a été ajouté avec succès.",
        icon: "success"
      }).then(() => {
        document.getElementById('closeModalBtn').click();
      });
      fetchData();
      setNewUserData({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        role: 0,
        confirmPassword: '',
        service_id: '',
      });
    } catch (error) {
      console.error('Error adding user:', error);
      setError('Une erreur est survenue lors de l\'ajout de l\'utilisateur.');
    }
  };

  const editUser = async () => {
    try {
      const { id, first_name, last_name, email, password, role, confirmPassword, service_id } = editUserData;
      if (!first_name || !last_name || !email || !role || !service_id ) {
        Swal.fire({
          icon: 'error',
          title: "Erreur",
text: "Veuillez remplir tous les champs obligatoires !",
        });
        return;
      }
      await axios.put(`/users/${id}`, { first_name, last_name, email, password, role, confirmPassword, service_id });
      fetchData();
      Swal.fire({
        title: "Succès",
text: "Les informations de l'utilisateur ont été mises à jour avec succès.",
        icon: "success"
      }).then(() => {
        document.getElementById('closeEditModalBtn').click();
      });
    } catch (error) {
      console.error('Error updating user:', error);
      setError('Une erreur est survenue lors de la mise à jour des informations de l\'utilisateur.');
    }
  };

  const editPassword = async () => {
    const { id, newPassword, confirmNewPassword } = editPasswordData;
    if (!newPassword || !confirmNewPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Veuillez entrer un nouveau mot de passe et confirmer le mot de passe !',
      });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Le nouveau mot de passe et la confirmation du mot de passe ne correspondent pas !',
      });
      return;
    }
    try {
      await axios.put(`/users/${id}/password`, { newPassword: newPassword });
      fetchData();
      Swal.fire({
        title: "Succès",
text: "Le mot de passe a été mis à jour avec succès.",
        icon: "success"
      }).then(() => {
        document.getElementById('closePasswordModalBtn').click();
      });
    } catch (error) {
      console.error('Error updating password:', error);
      setError('Une erreur est survenue lors de la mise à jour du mot de passe.');
    }
  };

  const deleteUser = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Êtes-vous sûr ?",
text: "Vous ne pourrez pas revenir en arrière !",
icon: "warning",
showCancelButton: true,
confirmButtonColor: "#3085d6",
cancelButtonColor: "#d33",
confirmButtonText: "Oui, supprimez-le !"

      });

      if (result.isConfirmed) {
        await axios.delete(`/users/${id}`);
        fetchData();
        Swal.fire({
          title: "Supprimé !",
text: "L'utilisateur a été supprimé avec succès.",
          icon: "success"
        });
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Une erreur est survenue lors de la suppression de l\'utilisateur.');
    }
  };

  const openEditModal = (user) => {
    setEditUserData(user);
  };

  const openPasswordModal = (user) => {
    setEditPasswordData({
      id: user.id,
      newPassword: '',
      confirmNewPassword: ''
    });
  };

  return (
    <div className="row font-arabic">
      <div className="col-12">
        <button
          type="button"
          data-toggle="modal"
          data-target="#exampleModal"
          className="btn btn-success btn-flat mb-3"
          aria-label="إضافة"
          style={{ padding: '3px 11px' }}
        >
          <i className="fa fa-plus" aria-hidden="true" style={{ marginRight: '5px' }}></i>
          Ajouter
        </button>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title p-2">Liste users</h3>
            {/*<div className="card-tools" style={{ marginRight: '10rem' }}>
              <div className="input-group input-group-sm" style={{ width: '214px' }}>
                <input
                  type="text"
                  name="table_search"
                  className="form-control float-right search-input"
                  placeholder="البحث"
                  style={{ textAlign: 'right' }}
                  value={search}
                  onChange={handleSearchChange}
                />
              </div>
            </div>*/}
          </div>






          <div className="card-body table-responsive p-0">
            <table className="table table-hover text-nowrap">
              <thead>
                <tr>
                  <th>Prénom</th>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Service</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td >{user.first_name}</td>
                    <td >{user.last_name}</td>
                    <td >{user.email}</td>
                    <td style={{ color: getRoleLabel(user.role).color}}>
                    {getRoleLabel(user.role).label}
                    </td>
                    <td >{user.service_name}</td>
                    <td >
                      <a
                        href="#"
                        style={{ color: '#ff0000b3', marginRight: '10px' }}
                        aria-label="Delete"
                        onClick={() => deleteUser(user.id)}
                      >
                        <i className="fa fa-trash" aria-hidden="true"></i>
                      </a>
                      <a
                        type='button'
                        data-toggle="modal"
                        data-target="#editModal"
                        style={{ color: '#007bff', marginRight: '10px' }}
                        aria-label="Edit"
                        onClick={() => openEditModal(user)}
                      >
                        <i className="fa fa-edit" aria-hidden="true"></i>
                      </a>
                      <a
                        href="#"
                        style={{ color: '#28a745' }}
                        aria-label="Change Password"
                        onClick={() => openPasswordModal(user)}
                        data-toggle="modal"
                        data-target="#passwordModal"
                      >
                        <i className="fa fa-key" aria-hidden="true"></i>
                      </a>
                    </td>
                    
                    
                    
                    
                  </tr>
                ))}
              </tbody>
            </table>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
          </div>
          {/*<div className="card-footer clearfix">
            <ul className="pagination pagination-sm m-0 float-right">
              {Array.from({ length: lastPage }, (_, index) => (
                <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                  <a className="page-link" href="#" onClick={() => handlePageChange(index + 1)}>
                    {index + 1}
                  </a>
                </li>
              ))}
            </ul>
          </div>*/}
        </div>
      </div>

      {/* Add User Modal */}
      <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title font-arabic" id="exampleModalLabel">Ajouter</h5>
            
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group ">
                  <label htmlFor="first_name" >Prénom</label>
                  <input
                    type="text"
                    className="form-control"
                    id="first_name"
                    name="first_name"
                    value={newUserData.first_name}
                    onChange={handleNewUserDataChange}
                    required
                  />
                </div>
                <div className="form-group ">
                  <label htmlFor="last_name" >Nom</label>
                  <input
                    type="text"
                    className="form-control"
                    id="last_name"
                    name="last_name"
                    value={newUserData.last_name}
                    onChange={handleNewUserDataChange}
                    required
                  />
                </div>
                <div className="form-group ">
                  <label htmlFor="service_id" >Services</label>
                  <select
                    className="form-control text-left"
                    id="service_id"
                    name="service_id"
                    value={newUserData.service_id}
                    onChange={handleNewUserDataChange}
                    required
                  >
                    <option value="" disabled>Sélectionner le service</option>
                    {serviceInfos.map(service => (
        <option key={service.id} value={service.id}>{service.name}</option>
      ))}
                    
                  </select>
                </div>
                <div className="form-group ">
                  <label htmlFor="role" >Role</label>
                  <select
                    className="form-control text-left"
                    id="role"
                    name="role"
                    value={newUserData.role}
                    onChange={handleNewUserDataChange}
                    required
                  >
                    <option value="" disabled>Sélectionner le Role</option>
                    <option value="0">Employé</option>
                    <option value="1">Chef de service</option>
                    <option value="2">Admin</option>
                  </select>
                </div>
                <div className="form-group ">
                  <label htmlFor="email" >Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={newUserData.email}
                    onChange={handleNewUserDataChange}
                    required
                  />
                </div>
                <div className="form-group ">
                  <label htmlFor="password" >Mot de passe</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={newUserData.password}
                    onChange={handleNewUserDataChange}
                    required
                  />
                </div>
                <div className="form-group ">
                  <label htmlFor="confirmPassword" >Confirmation de mot de passe</label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={newUserData.confirmPassword}
                    onChange={handleNewUserDataChange}
                    required
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" style={{borderRadius: '0',
    padding: '3px 16px'}} data-dismiss="modal" id="closeModalBtn">Annuler</button>
              <button type="button" className="btn btn-primary" onClick={addUser}>Ajouter</button>
            </div>
          </div>
        </div>
      </div>
      {/* Edit User Modal */}
      <div className="modal fade" id="editModal" tabIndex="-1" role="dialog" aria-labelledby="editModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title font-arabic" id="exampleModalLabel">Modifier</h5>
            </div>
            <div className="modal-body">
            {editUserData && (
              <form>
                <div className="form-group ">
                  <label htmlFor="first_name" >Prénom</label>
                  <input
                    type="text"
                    className="form-control"
                    id="first_name"
                    name="first_name"
                    value={editUserData.first_name}
                    onChange={handleEditUserDataChange}
                    required
                  />
                </div>
                <div className="form-group ">
                  <label htmlFor="last_name" >Nom</label>
                  <input
                    type="text"
                    className="form-control"
                    id="last_name"
                    name="last_name"
                    value={editUserData.last_name}
                    onChange={handleEditUserDataChange}
                    required
                  />
                </div>
                <div className="form-group ">
                  <label htmlFor="service_id" >Services</label>
                  <select
                    className="form-control text-left"
                    id="service_id"
                    name="service_id"
                    value={editUserData.service_id}
                    onChange={handleEditUserDataChange}
                    required
                  >
                    <option value="" disabled>Sélectionner le service</option>
                    {serviceInfos.map(service => (
        <option key={service.id} value={service.id}>{service.name}</option>
      ))}
                    
                  </select>
                </div>
                <div className="form-group ">
                  <label htmlFor="role" >Role</label>
                  <select
                    className="form-control text-left"
                    id="role"
                    name="role"
                    value={editUserData.role}
                    onChange={handleEditUserDataChange}
                    required
                  >
                    <option value="" disabled>Sélectionner le Role</option>
                    <option value="0">Employé</option>
                    <option value="1">Chef de service</option>
                    <option value="2">Admin</option>
                  </select>
                </div>
                <div className="form-group ">
                  <label htmlFor="email" >Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={editUserData.email}
                    onChange={handleEditUserDataChange}
                    required
                  />
                </div>
              </form>
            )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" style={{borderRadius: '0',
    padding: '3px 16px'}} data-dismiss="modal" id="closeEditModalBtn">Annuler</button>
              <button type="button" className="btn btn-primary" onClick={editUser}>Modifier</button>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      <div className="modal fade" id="passwordModal" tabIndex="-1" role="dialog" aria-labelledby="passwordModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="passwordModalLabel">Changer le mot de passe</h5>

            </div>
            <div className="modal-body">
              <form>
                <div className="form-group">
                  <label htmlFor="newPassword" >Nouveau mot de passe</label>
                  <input
                    type="password"
                    className="form-control"
                    id="newPassword"
                    name="newPassword"
                    value={editPasswordData.newPassword}
                    onChange={handleEditPasswordDataChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="confirmNewPassword" >Confirmez le nouveau mot de passe</label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    value={editPasswordData.confirmNewPassword}
                    onChange={handleEditPasswordDataChange}
                    required
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" style={{borderRadius: '0',
    padding: '3px 16px'}} data-dismiss="modal" id="closePasswordModalBtn">Annuler</button>
              <button type="button" className="btn btn-primary" onClick={editPassword}>Modifier</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Users;
