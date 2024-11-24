import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import '../../css/users.css';

function Materiels() {
  const [articles, setArticles] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [selectedAnnee, setSelectedAnnee] = useState('');
  const [selectedLaboratoire, setSelectedLaboratoire] = useState('');
  //const [selectedEquipe, setCommandes] = useState('');
  //const [laboratoires, setCategories] = useState([]);

  const [ categories, setCategories ] = useState([]);
  const [ commandes, setCommandes ] = useState([]);

  const [equipes, setEquipe] = useState([]);

  const [newUserData, setNewUserData] = useState({
    name: '',
    description: '',
    quantity: '',
    category_id: '',
    bon_commande_id: '',
    stock: '',
    num_inventaire: '',
  });
  const [editUserData, setEditUserData] = useState(null);

  const getStockLabel = (role) => {
    switch(role) {
      case "0": return { label: "Non", color: "red" };
      case "1": return { label: "Oui", color: "green" };
      default: return { label: "Unknown", color: "black" };
    }
  };

  const fetchData = async () => {
    setError(null);
    try {
      const response = await axios.get('/materiels', {
        params: { 
          annee: selectedAnnee, 
          laboratoire_id: selectedLaboratoire,
          //equipe_id: selectedEquipe,  
        }
      });
      setArticles(response.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [categorieResponse, commandesResponse] = await Promise.all([
          axios.get('/categories'),
          axios.get('/commandes'),
        ]);
        setCategories(categorieResponse.data.data);
        setCommandes(commandesResponse.data.data);
      } catch (error) {
        console.error('There was an error fetching data!', error);
      }
    };

    fetchInitialData();
    fetchData();
  }, []);
  
  useEffect(() => {
    fetchData();
  }, [selectedAnnee, selectedLaboratoire]);

  /*const fetchEquipesByLaboratoire = async (laboratoireId) => {
    try {
      const response = await axios.get(`/laboratoire/${laboratoireId}/equipes`);
      setEquipe(response.data.data);
    } catch (error) {
      console.error('Error fetching equipes:', error);
    }
  };

  useEffect(() => {
    if (selectedLaboratoire) {
      fetchEquipesByLaboratoire(selectedLaboratoire);
    } else {
      setEquipe([]); // Réinitialiser les équipes si aucun laboratoire n'est sélectionné
    }
  }, [selectedLaboratoire]);*/
  

  const handleNewUserDataChange = (e) => {
    const { name, value } = e.target;
    setNewUserData((newUserData) => ({ ...newUserData, [name]: value }));
  };

  const handleEditUserDataChange = (e) => {
    const { name, value } = e.target;
    setEditUserData((editUserData) => ({ ...editUserData, [name]: value }));
  };

  const addUser = async () => {
    const { name, description, quantity, category_id, bon_commande_id, stock, num_inventaire } = newUserData;
    if (!name || !description || !quantity || !category_id || !bon_commande_id || !stock || !num_inventaire ) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
text: 'Veuillez remplir tous les champs obligatoires!',
      });
      return;
    }
    try {
      await axios.post('materiels', { name, description, quantity, category_id, bon_commande_id, stock, num_inventaire });
      Swal.fire({
        title: 'Terminé',
text: 'Ajouté avec succès.',
        icon: "success"
      }).then(() => {
        document.getElementById('closeModalBtn').click();
      });
      fetchData();
      setNewUserData({
        name: '',
        description: '',
        quantity: '',
        category_id: '',
        bon_commande_id: '',
        stock: '',
        num_inventaire: '',
      });
    } catch (error) {
        handleApiError(error, 'Une erreur est survenue lors de l\'ajout.');
    }
  };

  const editUser = async () => {
    try {
      const { id, name, description, quantity, category_id, bon_commande_id, stock, num_inventaire } = editUserData;
      await axios.put(`materiels/${id}`, { name, description, quantity, category_id, bon_commande_id, stock, num_inventaire });
      fetchData();
      Swal.fire({
        title: 'Terminé',
text: 'Les informations ont été mises à jour avec succès.',
        icon: "success"
      }).then(() => {
        document.getElementById('closeEditModalBtn').click();
      });
    } catch (error) {
        handleApiError(error, 'Une erreur est survenue lors de la mise à jour des informations.');
    }
  };

  const deleteUser = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'Êtes-vous sûr ?',
text: 'Vous ne pourrez pas annuler cela !',
icon: 'warning',
showCancelButton: true,
confirmButtonColor: '#3085d6',
cancelButtonColor: '#d33',
confirmButtonText: 'Oui, supprimez-la !'
      });

      if (result.isConfirmed) {
        await axios.delete(`/materiels/${id}`);
        fetchData();
        Swal.fire({
            title: 'Suppression réussie!',
            text: 'Supprimé avec succès.',            
          icon: "success"
        });
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Une erreur est survenue lors de la suppression.');
    }
  };

  const openEditModal = (user) => {
    setEditUserData(user);
  };

  const clearFilters = () => {
    setSelectedAnnee('');
    setSelectedLaboratoire('');
    //setSelectedEquipe('');
    fetchData();
  };

  const handleApiError = (error, defaultMessage) => {
    if (error.response && error.response.data.errorDate) {
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: error.response.data.errorDate,
      });
    } else {
      console.error(defaultMessage, error);
      setError(defaultMessage);
    }
  };

  const convertToExcel = (data) => {
  const ws = XLSX.utils.json_to_sheet(data.map(user => ({
    'nom': user.name,
    'description': user.description,
    'quantité': user.quantity,
    'catégorie': user.category_id,
    'bon de commande': user.bon_commande_id,
    'stock': user.stock,
    "numéro d'inventaire": user.num_inventaire,
  })));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Articles');

  return wb;
};

const downloadExcel = () => {
  const wb = convertToExcel(articles);
  XLSX.writeFile(wb, 'articles.xlsx');
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
            <h3 className="card-title p-2" style={{ borderBottom: 'none',
    paddingBottom: '0' }}>Matériels</h3>
    <div className="card-tools" style={{ marginRight: '10rem' }}>
          </div>
          <div className="filter-group">
            {/* Add more years as needed 
            <select className="form-select" style={{ width: '20%' }} value={selectedAnnee} onChange={(e) => setSelectedAnnee(e.target.value)}>
              <option value="">اختيار السنة</option>
              {Array.from({ length: new Date().getFullYear() - 1999 }, (_, i) => 2000 + i).reverse().map(year => (
    <option key={year} value={year}>{year}</option>
  ))}
              
            </select>
            <select
                className="form-select"
                style={{ width: '30%' }}
                value={selectedLaboratoire}
                onChange={(e) => setSelectedLaboratoire(e.target.value)}
              >
                <option value="">اختيار المختبر</option>
                {laboratoires.map(labo => (
                  <option key={labo.id} value={labo.id}>{labo.nom}</option>
                ))}
              </select>
              <select
                className="form-select"
                style={{ width: '30%' }}
                value={selectedEquipe}
                onChange={(e) => setSelectedEquipe(e.target.value)}
                disabled={!selectedLaboratoire}
              >
                <option value="">اختيار الفريق</option>
                {equipes.map(equipe => (
                  <option key={equipe.id} value={equipe.id}>{equipe.nom}</option>
                ))}
              </select>*/}
            <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={clearFilters}
              >
                افرغ
              </button>


              <button
  type="button"
  className="btn btn-success"
  onClick={downloadExcel}
  aria-label="تحميل"
>
  <svg xmlns="http://www.w3.org/2000/svg" width="16" style={{ marginRight: '5px' }} height="16" fill="currentColor" className="bi bi-file-earmark-spreadsheet" viewBox="0 0 16 16">
  <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V9H3V2a1 1 0 0 1 1-1h5.5zM3 12v-2h2v2zm0 1h2v2H4a1 1 0 0 1-1-1zm3 2v-2h3v2zm4 0v-2h3v1a1 1 0 0 1-1 1zm3-3h-3v-2h3zm-7 0v-2h3v2z"/>
</svg>
Télécharger
</button>



          </div>
          </div>
          <div className="card-body table-responsive p-0">
            <table className="table table-hover text-nowrap">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Description </th>
                  <th>Quantité</th>
                  <th>Catégorie</th>
                  <th>Bon de commande</th>
                  <th>Stock</th>
                  <th>Numéro d'inventaire</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {articles.map(user => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.description}</td>
                    <td>{user.quantity}</td>
                    <td>{user.category_name}</td>
                    <td>{user.bon_commande_name}</td>
                    <td style={{ color: getStockLabel(user.stock).color}}>{getStockLabel(user.stock).label}</td>
                    <td>{user.num_inventaire}</td>
                    <td>
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
                  <input type="text" className="form-control" id="name" name="name" value={newUserData.name} onChange={handleNewUserDataChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <input type="text" className="form-control" id="description" name="description" value={newUserData.description} onChange={handleNewUserDataChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="url">Quantité</label>
                  <input type="text" className="form-control" id="quantity" name="quantity" value={newUserData.quantity} onChange={handleNewUserDataChange} required />
                </div>
                <div className='form-group'>
                  <label htmlFor="category_id">Catégorie</label>
                  <select
                    className="form-control"
                    id="category_id"
                    name='category_id'
                    value={newUserData.category_id}
                    onChange={handleNewUserDataChange}
                    required
                  >
                    <option value="" disabled>Sélectionnez votre catégorie</option>
                                    {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
                <div className='form-group'>
                  <label htmlFor="bon_commande_id">Bon de commande</label>
                  <select
                    className="form-control"
                    id="bon_commande_id"
                    name='bon_commande_id'
                    value={newUserData.bon_commande_id}
                    onChange={handleNewUserDataChange}
                    required
                  >
                    <option value="" disabled>Sélectionnez votre Bon de commande</option>
                                    {commandes.map(commande => (
                        <option key={commande.id} value={commande.id}>{commande.ref}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
  <label htmlFor="stock">Stock</label>
  <div>
    <div className="form-check form-check-inline">
      <input
        className="form-check-input"
        type="radio"
        id="stockYes"
        name="stock"
        value="1"
        checked={newUserData.stock === "1"}
        onChange={handleNewUserDataChange}
        required
      />
      <label className="form-check-label" htmlFor="stockYes">Oui</label>
    </div>
    <div className="form-check form-check-inline">
      <input
        className="form-check-input"
        type="radio"
        id="stockNo"
        name="stock"
        value="0"
        checked={newUserData.stock === "0"}
        onChange={handleNewUserDataChange}
      />
      <label className="form-check-label" htmlFor="stockNo">Non</label>
    </div>
  </div>
</div>

                <div className="form-group">
                  <label htmlFor="url">Numéro d'inventaire</label>
                  <input type="text" className="form-control" id="num_inventaire" name="num_inventaire" value={newUserData.num_inventaire} onChange={handleNewUserDataChange} required />
                </div>
                {/*<div className="form-group">
                  <label htmlFor="annee">السنة </label>
                  <select className="form-control" id="annee" name="annee"
                  onChange={handleNewUserDataChange}
                  value={newUserData.annee}
                  >
                          <option value="" disabled>اختر السنة</option>
                          {Array.from({ length: new Date().getFullYear() - 1999 }, (_, i) => 2000 + i).reverse().map(year => (
    <option key={year} value={year}>{year}</option>
  ))}
                        </select>
                </div>
                <div className='form-group'>
                  <label htmlFor="user_id">صاحب المقال</label>
                  <select
                    className="form-control"
                    id="user_id"
                    name='user_id'
                    value={newUserData.user_id}
                    onChange={handleNewUserDataChange}
                    required
                  >
                    <option value="" disabled>اختر صاحب المقال</option>
                    {users.map(user => (
        <option key={user.id} value={user.id}>{user.nom} {user.prénom}</option>
      ))}
                    
                  </select>
                </div>*/}
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" style={{borderRadius: '0',
    padding: '3px 16px'}} className="btn btn-secondary" id="closeModalBtn" data-dismiss="modal">Annuler</button>
              <button type="button" className="btn btn-primary" onClick={addUser}>Ajouter</button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      {/* Edit User Modal */}
{editUserData && ( 
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
                  <input type="text" className="form-control" id="name" name="name" value={editUserData.name} onChange={handleEditUserDataChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <input type="text" className="form-control" id="description" name="description" value={editUserData.description} onChange={handleEditUserDataChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="url">Quantité</label>
                  <input type="text" className="form-control" id="quantity" name="quantity" value={editUserData.quantity} onChange={handleEditUserDataChange} required />
                </div>
                <div className='form-group'>
                  <label htmlFor="category_id">Catégorie</label>
                  <select
                    className="form-control"
                    id="category_id"
                    name='category_id'
                    value={editUserData.category_id}
                    onChange={handleEditUserDataChange}
                    required
                  >
                    <option value="" disabled>Sélectionnez votre catégorie</option>
                                    {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
                <div className='form-group'>
                  <label htmlFor="bon_commande_id">Bon de commande</label>
                  <select
                    className="form-control"
                    id="bon_commande_id"
                    name='bon_commande_id'
                    value={editUserData.bon_commande_id}
                    onChange={handleEditUserDataChange}
                    required
                  >
                    <option value="" disabled>Sélectionnez votre Bon de commande</option>
                                    {commandes.map(commande => (
                        <option key={commande.id} value={commande.id}>{commande.ref}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
        <label htmlFor="stock">Stock</label>
        <div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              id="stockYes"
              name="stock"
              value="1"
              checked={editUserData.stock === "1"}
              onChange={handleEditUserDataChange}
              required
            />
            <label className="form-check-label" htmlFor="stockYes">Oui</label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              id="stockNo"
              name="stock"
              value="0"
              checked={editUserData.stock === "0"}
              onChange={handleEditUserDataChange}
            />
            <label className="form-check-label" htmlFor="stockNo">Non</label>
          </div>
        </div>
      </div>
                <div className="form-group">
                  <label htmlFor="url">Numéro d'inventaire</label>
                  <input type="text" className="form-control" id="num_inventaire" name="num_inventaire" value={editUserData.num_inventaire} onChange={handleEditUserDataChange} required />
                </div>
          </form>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" style={{borderRadius: '0',
    padding: '3px 16px'}} id="closeEditModalBtn" data-dismiss="modal">Annuler</button>
          <button type="button" className="btn btn-primary" onClick={editUser}>Modifier</button>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default Materiels;
