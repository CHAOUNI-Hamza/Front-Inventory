import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import '../../css/users.css';

function Articles() {
  const [articles, setArticles] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [selectedAnnee, setSelectedAnnee] = useState('');
  const [selectedLaboratoire, setSelectedLaboratoire] = useState('');
  const [selectedEquipe, setSelectedEquipe] = useState('');
  const [laboratoires, setLaboratoire] = useState([]);

  const [equipes, setEquipe] = useState([]);

  const [newUserData, setNewUserData] = useState({
    title: '',
    revue: '',
    url: '',
    annee: '',
    user_id: '',
  });
  const [editUserData, setEditUserData] = useState(null);

  const fetchData = async () => {
    setError(null);
    try {
      const response = await axios.get('/articles', {
        params: { 
          annee: selectedAnnee, 
          laboratoire_id: selectedLaboratoire,
          equipe_id: selectedEquipe,  
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
        const [usersResponse, laboResponse, equipeResponse] = await Promise.all([
          axios.get('/users'),
          axios.get('/laboratoires'),
        ]);
        setUsers(usersResponse.data.data);
        setLaboratoire(laboResponse.data.data);
      } catch (error) {
        console.error('There was an error fetching data!', error);
      }
    };

    fetchInitialData();
    fetchData();
  }, []);
  
  useEffect(() => {
    fetchData();
  }, [selectedAnnee, selectedLaboratoire, selectedEquipe]);

  const fetchEquipesByLaboratoire = async (laboratoireId) => {
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
  }, [selectedLaboratoire]);
  

  const handleNewUserDataChange = (e) => {
    const { name, value } = e.target;
    setNewUserData((newUserData) => ({ ...newUserData, [name]: value }));
  };

  const handleEditUserDataChange = (e) => {
    const { name, value } = e.target;
    setEditUserData((editUserData) => ({ ...editUserData, [name]: value }));
  };

  const addUser = async () => {
    const { titre, revue, url, annee, user_id } = newUserData;
    if (!titre || !revue || !url || !annee || !user_id ) {
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'يرجى ملء جميع الحقول المطلوبة!',
      });
      return;
    }
    try {
      await axios.post('admin/articles', { titre, revue, url, annee, user_id });
      Swal.fire({
        title: "تم",
        text: "تمت الإضافة بنجاح.",
        icon: "success"
      }).then(() => {
        document.getElementById('closeModalBtn').click();
      });
      fetchData();
      setNewUserData({
        titre: '',
        revue: '',
        url: '',
        annee: '',
        user_id: '',
      });
    } catch (error) {
      handleApiError(error, 'حدث خطأ أثناء الإضافة .');
    }
  };

  const editUser = async () => {
    try {
      const { id, titre, revue, url, annee, user_id } = editUserData;
      await axios.put(`admin/articles/${id}`, { titre, revue, url, annee, user_id });
      fetchData();
      Swal.fire({
        title: "تم",
        text: "تم تحديث المعلومات بنجاح.",
        icon: "success"
      }).then(() => {
        document.getElementById('closeEditModalBtn').click();
      });
    } catch (error) {
      handleApiError(error, 'حدث خطأ أثناء تحديث المعلومات .');
    }
  };

  const deleteUser = async (id) => {
    try {
      const result = await Swal.fire({
        title: "هل أنت متأكد؟",
        text: "لن تتمكن من التراجع عن هذا!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "نعم، احذفها!"
      });

      if (result.isConfirmed) {
        await axios.delete(`/articles/${id}`);
        fetchData();
        Swal.fire({
          title: "تم الحذف!",
          text: "تم الحذف بنجاح.",
          icon: "success"
        });
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('حدث خطأ أثناء الحذف .');
    }
  };

  const openEditModal = (user) => {
    setEditUserData(user);
  };

  const clearFilters = () => {
    setSelectedAnnee('');
    setSelectedLaboratoire('');
    setSelectedEquipe('');
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
    'العنوان': user.titre,
    'المجلة': user.revue,
    'الرابط': user.url,
    'السنة': user.annee,
    'صاحب المقال': `${user.user.nom} ${user.user.prénom}`
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
          إضافة
        </button>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title font-arabic p-2" style={{ float: 'right', borderBottom: 'none',
    paddingBottom: '0' }}>لائحة المقالات</h3>
    <div className="card-tools" style={{ marginRight: '10rem' }}>
          </div>
          <div className="filter-group">
            <select className="form-select" style={{ width: '20%' }} value={selectedAnnee} onChange={(e) => setSelectedAnnee(e.target.value)}>
              <option value="">اختيار السنة</option>
              {Array.from({ length: new Date().getFullYear() - 1999 }, (_, i) => 2000 + i).reverse().map(year => (
    <option key={year} value={year}>{year}</option>
  ))}
              {/* Add more years as needed */}
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
                disabled={!selectedLaboratoire} // Désactiver si aucun laboratoire n'est sélectionné
              >
                <option value="">اختيار الفريق</option>
                {equipes.map(equipe => (
                  <option key={equipe.id} value={equipe.id}>{equipe.nom}</option>
                ))}
              </select>
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
  تحميل
</button>



          </div>
          </div>
          <div className="card-body table-responsive p-0">
            <table className="table table-hover text-nowrap">
              <thead>
                <tr style={{ textAlign: 'right' }}>
                  <th>إجراءات</th>
                  <th>صاحب المقال</th>
                  <th> السنة</th>
                  <th> المختبر</th>
                  <th>المجلة</th>
                  <th>العنوان</th>
                </tr>
              </thead>
              <tbody>
                {articles.map(user => (
                  <tr key={user.id} style={{ textAlign: 'right' }}>
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
                    <td>{user.user.nom} {user.user.prénom}</td>
                    <td>{user.annee}</td>
                    <td>{user.user.laboratoire.nom}</td>
                    <td>{user.revue}</td>
                    <td>{user.titre}</td>
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
            <div className="modal-header" dir='rtl'>
              <h5 className="modal-title font-arabic" id="exampleModalLabel">إضافة مقال</h5>
            </div>
            <div className="modal-body" dir='rtl'>
              <form>
                <div className="form-group text-right">
                  <label htmlFor="titre">العنوان</label>
                  <input type="text" className="form-control" id="titre" name="titre" value={newUserData.titre} onChange={handleNewUserDataChange} required />
                </div>
                <div className="form-group text-right">
                  <label htmlFor="revue">المجلة </label>
                  <input type="text" className="form-control" id="revue" name="revue" value={newUserData.revue} onChange={handleNewUserDataChange} required />
                </div>
                <div className="form-group text-right">
                  <label htmlFor="url">الرابط </label>
                  <input type="text" className="form-control" id="url" name="url" value={newUserData.url} onChange={handleNewUserDataChange} required />
                </div>
                <div className="form-group text-right">
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
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" style={{borderRadius: '0',
    padding: '3px 16px'}} className="btn btn-secondary" id="closeModalBtn" data-dismiss="modal">إلغاء</button>
              <button type="button" className="btn btn-primary" onClick={addUser}>إضافة</button>
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
        <div className="modal-header" dir='rtl'>
          <h5 className="modal-title font-arabic" id="editModalLabel">  تعديل </h5>
        </div>
        <div className="modal-body" dir='rtl'>
          <form>
          <div className="form-group text-right">
                  <label htmlFor="titre">العنوان</label>
                  <input type="text" className="form-control" id="titre" name="titre" value={editUserData.titre} onChange={handleEditUserDataChange} required />
                </div>
                <div className="form-group text-right">
                  <label htmlFor="revue">المجلة </label>
                  <input type="text" className="form-control" id="revue" name="revue" value={editUserData.revue} onChange={handleEditUserDataChange} required />
                </div>
                <div className="form-group text-right">
                  <label htmlFor="url">الرابط </label>
                  <input type="text" className="form-control" id="url" name="url" value={editUserData.url} onChange={handleEditUserDataChange} required />
                </div>
                <div className="form-group text-right">
  <label htmlFor="annee">السنة </label>
  <select
    className="form-control"
    id="annee"
    name="annee"
    value={editUserData.annee}
    onChange={handleEditUserDataChange}
  >
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
                    value={editUserData.user_id}
                    onChange={handleEditUserDataChange}
                    required
                  >
                    <option value="" disabled>اختر صاحب المقال</option>
                    {users.map(user => (
        <option key={user.id} value={user.id}>{user.nom} {user.prénom}</option>
      ))}
                    
                  </select>
                </div>
          </form>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" style={{borderRadius: '0',
    padding: '3px 16px'}} id="closeEditModalBtn" data-dismiss="modal">إلغاء</button>
          <button type="button" className="btn btn-primary" onClick={editUser}>تعديل</button>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default Articles;
