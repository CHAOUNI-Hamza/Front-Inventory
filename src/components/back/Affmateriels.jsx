import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../../css/users.css';
import { UserContext } from '../../UserContext';

function Affmateriels() {
  const { userInfo } = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const [selectedMateriel, setselectedMateriel] = useState('');
  const [selectedService, setselectedService] = useState('');
  const [selectedAssigned, setselectedAssigned] = useState('');
  const [selectedDate, setselectedDate] = useState('');
  const [affectations, setAffectations] = useState([]);
  const [error, setError] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [serviceInfos, ServiceInfos] = useState([]);
  const [newAffectationData, setNewAffectationData] = useState({
    materiel_id: '',
    service_id: '',
    assigned_by: '',
    quantity: '',
    date: '',
  });
  const [editAffectationData, setEditAffectationData] = useState(null);
  const fetchData = async () => {
    try {
      const [affectationResponse, serviceResponse, materialResponse, userResponse] = await Promise.all([
        axios.get('/affectations', {
          params: { 
            materiel_id: selectedMateriel, 
            service_id: selectedService,
            assigned_by: selectedAssigned, 
            date: selectedDate,  
          }}),
        axios.get('/services'),
        axios.get('/materiels'),
        axios.get('/users'),
      ]);
  
      setAffectations(affectationResponse.data.data);
      setUsers(userResponse.data.data);
      ServiceInfos(serviceResponse.data.data);
      setMaterials(materialResponse.data.data); // Assurez-vous d'avoir une fonction ou un état pour gérer les données des matériels
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const handleNewAffectationDataChange = (e) => {
    const { name, value } = e.target;
    setNewAffectationData({ ...newAffectationData, [name]: value });
  };
  const handleEditAffectationDataChange = (e) => {
    const { name, value } = e.target;
    setEditAffectationData({ ...editAffectationData, [name]: value });
  };
  const addAffectation = async () => {
    const { materiel_id, service_id, assigned_by, quantity, date } = newAffectationData;
    if (!materiel_id || !service_id || !assigned_by || !quantity || !date ) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Veuillez remplir tous les champs obligatoires !',
      });
      return;
    }
    try {
      await axios.post('/affectations', { materiel_id, service_id, assigned_by, quantity, date });
      Swal.fire({
        title: "Succès",
        text: "Un nouvel utilisateur a été ajouté avec succès.",
        icon: "success"
      }).then(() => {
        document.getElementById('closeModalBtn').click();
      });
      fetchData();
      setNewAffectationData({
        materiel_id: '',
        service_id: '',
        assigned_by: '',
        quantity: '',
        date: '',
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: error.response.data.message,
      });
      //console.error('Error adding user:', error.response.data.message);
      //setError('Une erreur est survenue lors de l\'ajout de l\'utilisateur.');
    }
  };

  const clearFilters = () => {
    setselectedMateriel('');
    setselectedService('');
    setselectedAssigned('');
    setselectedDate('');
    fetchData();
  };

  const editAffectation = async () => {
    try {
      const { id, materiel_id, service_id, assigned_by, quantity, date } = editAffectationData;
      if (!materiel_id || !service_id || !assigned_by || !quantity || !date ) {
        Swal.fire({
          icon: 'error',
          title: "Erreur",
text: "Veuillez remplir tous les champs obligatoires !",
        });
        return;
      }
      await axios.put(`/affectations/${id}`, { materiel_id, service_id, assigned_by, quantity, date });
      fetchData();
      Swal.fire({
        title: "Succès",
text: "Les informations de l'utilisateur ont été mises à jour avec succès.",
        icon: "success"
      }).then(() => {
        document.getElementById('closeEditModalBtn').click();
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: error.response.data.message,
      });
      //console.error('Error updating user:', error);
      //setError('Une erreur est survenue lors de la mise à jour des informations de l\'utilisateur.');
    }
  };

  const deleteAffectation = async (id) => {
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
        await axios.delete(`/affectations/${id}`);
        fetchData();
        Swal.fire({
          title: "Supprimé !",
text: "L'utilisateur a été supprimé avec succès.",
          icon: "success"
        });
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      //setError('Une erreur est survenue lors de la suppression de l\'utilisateur.');
    }
  };

  const openEditModal = (user) => {
    setEditAffectationData(user);
  };

  useEffect(() => {
    fetchData();
  }, [selectedMateriel, selectedService, selectedAssigned, selectedDate]);

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
            <h3 className="card-title p-2 mr-5">Liste des affectations</h3>
            <div className="card-tools" style={{ marginRight: '10rem' }}>
          </div>
          <div className="filter-group mt-2">
            <select
                className="form-select"
                style={{ width: '20%' }}
                value={selectedMateriel}
                onChange={(e) => setselectedMateriel(e.target.value)}
              >
                <option value="">Materiels</option>
                {materials.map(material => (
                  <option key={material.id} value={material.id}>{material.name}</option>
                ))}
              </select>
              <select
                className="form-select"
                style={{ width: '20%' }}
                value={selectedService}
                onChange={(e) => setselectedService(e.target.value)}
              >
                <option value="">Services</option>
                {serviceInfos.map(service => (
                  <option key={service.id} value={service.id}>{service.name}</option>
                ))}
              </select>
              <select
                className="form-select"
                style={{ width: '20%' }}
                value={selectedAssigned}
                onChange={(e) => setselectedAssigned(e.target.value)}
              >
                <option value="">Users</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>{user.first_name} {user.last_name}</option>
                ))}
              </select>
              <input
  type="date"
  className="form-select"
  style={{ width: '15%' }}
  value={selectedDate}
  onChange={(e) => setselectedDate(e.target.value)} // Valeur déjà au format YYYY-MM-DD
/>
            <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={clearFilters}
              >
                Vider
              </button>


              {/*<button
  type="button"
  className="btn btn-success"
  onClick={downloadExcel}
  aria-label="تحميل"
>
  <svg xmlns="http://www.w3.org/2000/svg" width="16" style={{ marginRight: '5px' }} height="16" fill="currentColor" className="bi bi-file-earmark-spreadsheet" viewBox="0 0 16 16">
  <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V9H3V2a1 1 0 0 1 1-1h5.5zM3 12v-2h2v2zm0 1h2v2H4a1 1 0 0 1-1-1zm3 2v-2h3v2zm4 0v-2h3v1a1 1 0 0 1-1 1zm3-3h-3v-2h3zm-7 0v-2h3v2z"/>
</svg>
  تحميل
</button>*/}



          </div>
          </div>
          <div className="card-body table-responsive p-0">
            <table className="table table-hover text-nowrap">
              <thead>
                <tr>
                  <th>Materiels</th>
                  <th>Services</th>
                  <th>Users</th>
                  <th>Quantité</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {affectations.map(affectation => (
                  <tr key={affectation.id}>
                    <td >{affectation.materiel_name}</td>
                    <td >{affectation.service_name}</td>
                    <td >{affectation.assigned_name}</td>
                    <td >{affectation.quantity}</td>
                    <td >{affectation.date}</td>
                    <td >
                      <a
                        href="#"
                        style={{ color: '#ff0000b3', marginRight: '10px' }}
                        aria-label="Delete"
                        onClick={() => deleteAffectation(affectation.id)}
                      >
                        <i className="fa fa-trash" aria-hidden="true"></i>
                      </a>
                      <a
                        type='button'
                        data-toggle="modal"
                        data-target="#editModal"
                        style={{ color: '#007bff', marginRight: '10px' }}
                        aria-label="Edit"
                        onClick={() => openEditModal(affectation)}
                      >
                        <i className="fa fa-edit" aria-hidden="true"></i>
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
      {/* Add Affectation Modal */}
      <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title font-arabic" id="exampleModalLabel">Ajouter</h5>
            
            </div>
            <div className="modal-body">
              <form>
              <div className="form-group ">
                  <label htmlFor="service_id" >Services</label>
                  <select
                    className="form-control text-left"
                    id="service_id"
                    name="service_id"
                    value={newAffectationData.service_id}
                    onChange={handleNewAffectationDataChange}
                    required
                  >
                    <option value="" disabled>Sélectionner le service</option>
                    {serviceInfos.map(service => (
                    <option key={service.id} value={service.id}>{service.name}</option>
                  ))}
                  </select>
                </div>
                <div className="form-group ">
                  <label htmlFor="materiel_id" >Materiels</label>
                  <select
                    className="form-control text-left"
                    id="materiel_id"
                    name="materiel_id"
                    value={newAffectationData.materiel_id}
                    onChange={handleNewAffectationDataChange}
                    required
                  >
                    <option value="" disabled>Sélectionner materiels</option>
                    {materials.map(material => (
        <option key={material.id} value={material.id}>{material.name}</option>
      ))}
                    
                  </select>
                </div>
                <div className="form-group ">
                  <label htmlFor="assigned_by" >Users</label>
                  <select
                    className="form-control text-left"
                    id="assigned_by"
                    name="assigned_by"
                    value={newAffectationData.assigned_by}
                    onChange={handleNewAffectationDataChange}
                    required
                  >
                    <option value="" disabled>Sélectionner users</option>
                    {users.map(user => (
        <option key={user.id} value={user.id}>{user.first_name} {user.last_name}</option>
      ))}
                    
                  </select>
                </div>
                <div className="form-group ">
                  <label htmlFor="quantity" >Quantité</label>
                  <input
                    type="text"
                    className="form-control"
                    id="quantity"
                    name="quantity"
                    value={newAffectationData.quantity}
                    onChange={handleNewAffectationDataChange}
                    required
                  />
                </div>
                <div className="form-group ">
                  <label htmlFor="date" >Date</label>
                  <input
                    type="date"
                    className="form-control"
                    id="date"
                    name="date"
                    value={newAffectationData.date}
                    onChange={handleNewAffectationDataChange}
                    required
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" style={{borderRadius: '0',
    padding: '3px 16px'}} data-dismiss="modal" id="closeModalBtn">Annuler</button>
              <button type="button" className="btn btn-primary" onClick={addAffectation}>Ajouter</button>
            </div>
          </div>
        </div>
      </div>
      {/* Edit Affectation Modal */}
      <div className="modal fade" id="editModal" tabIndex="-1" role="dialog" aria-labelledby="editModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title font-arabic" id="exampleModalLabel">Modifier</h5>
            </div>
            <div className="modal-body">
            {editAffectationData && (
              <form>
                <div className="form-group ">
                  <label htmlFor="service_id" >Services</label>
                  <select
                    className="form-control text-left"
                    id="service_id"
                    name="service_id"
                    value={editAffectationData.service_id}
                    onChange={handleEditAffectationDataChange}
                    required
                  >
                    <option value="" disabled>Sélectionner le service</option>
                    {serviceInfos.map(service => (
        <option key={service.id} value={service.id}>{service.name}</option>
      ))}
                    
                  </select>
                </div>
                <div className="form-group ">
                  <label htmlFor="materiel_id" >Materiels</label>
                  <select
                    className="form-control text-left"
                    id="materiel_id"
                    name="materiel_id"
                    value={editAffectationData.materiel_id}
                    onChange={handleEditAffectationDataChange}
                    required
                  >
                    <option value="" disabled>Sélectionner materiels</option>
                    {materials.map(material => (
        <option key={material.id} value={material.id}>{material.name}</option>
      ))}
                    
                  </select>
                </div>
                <div className="form-group ">
                  <label htmlFor="assigned_by" >Users</label>
                  <select
                    className="form-control text-left"
                    id="assigned_by"
                    name="assigned_by"
                    value={editAffectationData.assigned_by}
                    onChange={handleEditAffectationDataChange}
                    required
                  >
                    <option value="" disabled>Sélectionner users</option>
                    {users.map(user => (
        <option key={user.id} value={user.id}>{user.first_name} {user.last_name}</option>
      ))}
                    
                  </select>
                </div>
                <div className="form-group ">
                  <label htmlFor="quantity" >Quantité</label>
                  <input
                    type="text"
                    className="form-control"
                    id="quantity"
                    name="quantity"
                    value={editAffectationData.quantity}
                    onChange={handleEditAffectationDataChange}
                    required
                  />
                </div>
                <div className="form-group ">
                  <label htmlFor="date" >Date</label>
                  <input
                    type="date"
                    className="form-control"
                    id="date"
                    name="date"
                    value={editAffectationData.date}
                    onChange={handleEditAffectationDataChange}
                    required
                  />
                </div>
              </form>
            )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" style={{borderRadius: '0',
    padding: '3px 16px'}} data-dismiss="modal" id="closeEditModalBtn">Annuler</button>
              <button type="button" className="btn btn-primary" onClick={editAffectation}>Modifier</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Affmateriels;
