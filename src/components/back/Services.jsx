import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../../css/users.css';


function Services() {
  const [services, setServices] = useState([]);
  const [UserInfos, setUserInfo] = useState([]);
  const [error, setError] = useState(null);
  const [newServiceData, setNewServiceData] = useState({
    name: '',
  });
  const [editServiceData, setEditServiceData] = useState(null);

  const fetchData = async () => {
    setError(null);
    try {
      const response = await axios.get('/services');
      setServices(response.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleNewServiceDataChange = (e) => {
    const { name, value } = e.target;
    setNewServiceData({ ...newServiceData, [name]: value });
  };

  const handleEditServiceDataChange = (e) => {
    const { name, value } = e.target;
    setEditServiceData({ ...editServiceData, [name]: value });
  };

  const addService = async () => {
    const { name } = newServiceData;
    if (!name) {
      Swal.fire({
        icon: 'error',
        title: "Erreur",
text: "Veuillez remplir tous les champs obligatoires !",
      });
      return;
    }
    try {
      await axios.post('/services', { name });
      fetchData();
      setNewServiceData({
        name: '',
      });
      Swal.fire({
        title: "Fait",
text: "Ajouté avec succès.",
        icon: "success"
      }).then(() => {
        document.getElementById('closeModalBtn').click();
      });
    } catch (error) {
      if (error.response && error.response.data.errorDate) {
        Swal.fire({
          icon: 'error',
          title: 'error',
          text: error.response.data.errorDate,
        });
      } else {
        console.error('Error adding user:', error);
        setError("Une erreur s'est produite lors de l'ajout.");
      }
    }
  };
  

  const editService = async () => {
    try {
      const { id, name } = editServiceData;
      await axios.put(`/services/${id}`, { name });
      fetchData();
      Swal.fire({
        title: "Fait",
text: "Les informations ont été mises à jour avec succès.",
        icon: "success"
      }).then(() => {
        document.getElementById('closeEditModalBtn').click();
      });
    } catch (error) {
        if (error.response && error.response.data.errorDate) {
            Swal.fire({
              icon: 'error',
              title: 'خطأ',
              text: error.response.data.errorDate,
            });
          } else {
            console.error('Error updating user:', error);
            setError("Une erreur s'est produite lors de la mise à jour des informations.");
          }
    }
  };

  const deleteService = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Êtes-vous sûr ?",
        text: "Vous ne pourrez pas annuler cela !",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Oui, supprimez-le !"

      });

      if (result.isConfirmed) {
        await axios.delete(`/services/${id}`);
        fetchData();
        Swal.fire({
          title: "Supprimé !",
text: "Supprimé avec succès.",
          icon: "success"
        });
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      setError("Une erreur s'est produite lors de la suppression.");
    }
  };

  const openEditModal = (user) => {
    setEditServiceData(user);
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
            <h3 className="card-title font-arabic p-2" style={{ borderBottom: 'none',
    paddingBottom: '0' }}>Services</h3>
          </div>
          <div className="card-body table-responsive p-0">
            <table className="table table-hover text-nowrap">
              <thead>
                <tr >
                  <th>Nom</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {services.map(service => (
                  <tr key={service.id} >
                    <td>{service.name}</td>
                    <td>
                      <a
                        href="#"
                        style={{ color: '#ff0000b3', marginRight: '10px' }}
                        aria-label="Delete"
                        onClick={() => deleteService(service.id)}
                      >
                        <i className="fa fa-trash" aria-hidden="true"></i>
                      </a>
                      <a
                        type='button'
                        data-toggle="modal"
                        data-target="#editModal"
                        style={{ color: '#007bff', marginRight: '10px' }}
                        aria-label="Edit"
                        onClick={() => openEditModal(service)}
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
                <div className="form-group">
                  <label htmlFor="name">Nom</label>
                  <input type="text" className="form-control" id="name" name="name" value={newServiceData.name} onChange={handleNewServiceDataChange} required />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" style={{borderRadius: '0',
    padding: '3px 16px'}} className="btn btn-secondary" id="closeModalBtn" data-dismiss="modal">Annuler</button>
              <button type="button" className="btn btn-primary" onClick={addService}>Ajouter</button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
{editServiceData && ( 
  <div className="modal fade" id="editModal" tabIndex="-1" role="dialog" aria-labelledby="editModalLabel" aria-hidden="true">
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title font-arabic" id="editModalLabel">Modification</h5>
        </div>
        <div className="modal-body">
          <form>
          <div className="form-group">
                  <label htmlFor="name">Nom</label>
                  <input type="text" className="form-control" id="name" name="name" value={editServiceData.name} onChange={handleEditServiceDataChange} required />
                </div>
          </form>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" style={{borderRadius: '0',
    padding: '3px 16px'}} id="closeEditModalBtn" data-dismiss="modal">Annuler</button>
          <button type="button" className="btn btn-primary" onClick={editService}>Modifier</button>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default Services;
