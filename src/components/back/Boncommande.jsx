import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../../css/users.css';
import { UserContext } from '../../UserContext';

function Boncommande() {
  const { userInfo } = useContext(UserContext);
  const [error, setError] = useState(null);
  const [categoriesbdc, setCategoriesbdc] = useState([]);
  const [commandes, setCommandes] = useState([]);
  const [newAffectationData, setNewAffectationData] = useState({
    ref: '',
    categorie_bdc_id: '',
    date: '',
  });
  const [editAffectationData, setEditAffectationData] = useState(null);
  const fetchData = async () => {
    try {
      const [categoriesbdcResponse, commandesResponse] = await Promise.all([
        axios.get('/categoriesbdc'),
        axios.get('/commandes'),
      ]);
  
      setCategoriesbdc(categoriesbdcResponse.data.data);
      setCommandes(commandesResponse.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  
  useEffect(() => {
    fetchData();
  }, []);
  

  const handleNewAffectationDataChange = (e) => {
    const { name, value } = e.target;
    setNewAffectationData({ ...newAffectationData, [name]: value });
  };

  const handleEditAffectationDataChange = (e) => {
    const { name, value } = e.target;
    setEditAffectationData({ ...editAffectationData, [name]: value });
  };

  const addAffectation = async () => {
    const { ref, categorie_bdc_id, date } = newAffectationData;
    if (!ref || !categorie_bdc_id || !date ) {
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'يرجى ملء جميع الحقول المطلوبة!',
      });
      return;
    }
    try {
      await axios.post('/commandes', { ref, categorie_bdc_id, date });
      Swal.fire({
        title: "Succès",
        text: "Un nouvel utilisateur a été ajouté avec succès.",
        icon: "success"
      }).then(() => {
        document.getElementById('closeModalBtn').click();
      });
      fetchData();
      setNewAffectationData({
        ref: '',
        categorie_bdc_id: '',
        date: '',
      });
    } catch (error) {
      console.error('Error adding user:', error);
      setError('Une erreur est survenue lors de l\'ajout de l\'utilisateur.');
    }
  };

  const editAffectation = async () => {
    try {
      const { id, ref, categorie_bdc_id, date } = editAffectationData;
      if (!ref || !categorie_bdc_id || !date) {
        Swal.fire({
          icon: 'error',
          title: "Erreur",
text: "Veuillez remplir tous les champs obligatoires !",
        });
        return;
      }
      await axios.put(`/commandes/${id}`, {  ref, categorie_bdc_id, date });
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
        await axios.delete(`/commandes/${id}`);
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
    setEditAffectationData(user);
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
          إضافة
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
                  <th>Ref</th>
                  <th>Categorie BDC</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {commandes.map(commande => (
                  <tr key={commande.id}>
                    <td >{commande.ref}</td>
                    <td >{commande.categorie_bdc_id}</td>
                    <td >{commande.date}</td>
                    <td >
                      <a
                        href="#"
                        style={{ color: '#ff0000b3', marginRight: '10px' }}
                        aria-label="Delete"
                        onClick={() => deleteAffectation(commande.id)}
                      >
                        <i className="fa fa-trash" aria-hidden="true"></i>
                      </a>
                      <a
                        type='button'
                        data-toggle="modal"
                        data-target="#editModal"
                        style={{ color: '#007bff', marginRight: '10px' }}
                        aria-label="Edit"
                        onClick={() => openEditModal(commande)}
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
                  <label htmlFor="ref" >Ref</label>
                  <input
                    type="text"
                    className="form-control"
                    id="ref"
                    name="ref"
                    value={newAffectationData.ref}
                    onChange={handleNewAffectationDataChange}
                    required
                  />
                </div>
                <div className="form-group ">
                  <label htmlFor="categorie_bdc_id" >Categorie BDC</label>
                  <select
                    className="form-control text-left"
                    id="categorie_bdc_id"
                    name="categorie_bdc_id"
                    value={newAffectationData.categorie_bdc_id}
                    onChange={handleNewAffectationDataChange}
                    required
                  >
                    <option value="" disabled>Sélectionner Categorie de BDC</option>
                    {categoriesbdc.map(categoriebdc => (
        <option key={categoriebdc.id} value={categoriebdc.id}>{categoriebdc.name}</option>
      ))}
                    
                  </select>
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
                  <label htmlFor="ref" >Ref</label>
                  <input
                    type="text"
                    className="form-control"
                    id="ref"
                    name="ref"
                    value={editAffectationData.ref}
                    onChange={handleEditAffectationDataChange}
                    required
                  />
                </div>
                <div className="form-group ">
                  <label htmlFor="categorie_bdc_id" >Categorie BDC</label>
                  <select
                    className="form-control text-left"
                    id="categorie_bdc_id"
                    name="categorie_bdc_id"
                    value={editAffectationData.categorie_bdc_id}
                    onChange={handleEditAffectationDataChange}
                    required
                  >
                    <option value="" disabled>Sélectionner Categorie de BDC</option>
                    {categoriesbdc.map(categoriebdc => (
        <option key={categoriebdc.id} value={categoriebdc.id}>{categoriebdc.name}</option>
      ))}
                    
                  </select>
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

export default Boncommande;
