import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../../css/users.css';


function Livres() {
  const [users, setUsers] = useState([]);
  const [UserInfos, setUserInfo] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [newUserData, setNewUserData] = useState({
    titre: '',
    isbn: '',
    depot_legal: '',
    issn: '',
    annee: '',
    user_id: '',
  });
  const [editUserData, setEditUserData] = useState(null);

  useEffect(() => {
    axios.get('/users')
      .then(response => {
        setUserInfo(response.data.data);
      })
      .catch(error => {
        console.error('There was an error fetching labo data!', error);
      });
    fetchData();
  }, []);

  const fetchData = async () => {
    setError(null);
    try {
      const response = await axios.get('/livres');
      setUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleNewUserDataChange = (e) => {
    const { name, value } = e.target;
    setNewUserData({ ...newUserData, [name]: value });
  };

  const handleEditUserDataChange = (e) => {
    const { name, value } = e.target;
    setEditUserData({ ...editUserData, [name]: value });
  };

  const addUser = async () => {
    const { titre, isbn, depot_legal, issn, annee, user_id } = newUserData;
    if (!titre || !isbn || !depot_legal || !annee || !user_id ) {
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'يرجى ملء جميع الحقول المطلوبة!',
      });
      return;
    }
    try {
      await axios.post('/admin/livres', { titre, isbn, depot_legal, issn, annee, user_id });
      fetchData();
      setNewUserData({
        titre: '',
        isbn: '',
        depot_legal: '',
        issn: '',
        annee: '',
        user_id: '',
      });
      Swal.fire({
        title: "تم",
        text: "تمت الإضافة بنجاح.",
        icon: "success"
      }).then(() => {
        document.getElementById('closeModalBtn').click();
      });
    } catch (error) {
      if (error.response && error.response.data.errorDate) {
        Swal.fire({
          icon: 'error',
          title: 'خطأ',
          text: error.response.data.errorDate,
        });
      } else {
        console.error('Error adding user:', error);
        setError('حدث خطأ أثناء الإضافة .');
      }
    }
  };
  

  const editUser = async () => {
    try {
      const { id, titre, isbn, depot_legal, issn, annee, user_id } = editUserData;
      await axios.put(`/admin/livres/${id}`, { titre, isbn, depot_legal, issn, annee, user_id });
      fetchData();
      Swal.fire({
        title: "تم",
        text: "تم تحديث المعلومات بنجاح.",
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
            setError('حدث خطأ أثناء تحديث المعلومات .');
          }
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
        await axios.delete(`/livres/${id}`);
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
    paddingBottom: '0' }}>لائحة الكتب</h3>
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
                <tr style={{ textAlign: 'right' }}>
                  <th>إجراءات</th>
                  <th>صاحب الكتاب</th>
                  <th> السنة</th>
                  <th> ISSN</th>
                  <th> الإيداع القانوني</th>
                  <th>ISBN</th>
                  <th>العنوان</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
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
                    <td>{user.issn}</td>
                    <td>{user.depot_legal}</td>
                    <td>{user.isbn}</td>
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
                  <label htmlFor="isbn">ISBN </label>
                  <input type="text" className="form-control" id="isbn" name="isbn" value={newUserData.isbn} onChange={handleNewUserDataChange} required />
                </div>
                <div className="form-group text-right">
                  <label htmlFor="depot_legal">الإيداع القانوني </label>
                  <input type="text" className="form-control" id="depot_legal" name="depot_legal" value={newUserData.depot_legal} onChange={handleNewUserDataChange} required />
                </div>
                <div className="form-group text-right">
                  <label htmlFor="issn">ISSN </label>
                  <input type="text" className="form-control" id="issn" name="issn" value={newUserData.issn} onChange={handleNewUserDataChange} required />
                </div>
                <div className="form-group text-right">
                  <label htmlFor="annee">السنة </label>
                  <select className="form-control" id="annee" name="annee" onChange={handleNewUserDataChange} value={newUserData.annee}>
                          <option value="">اختر السنة</option>
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
                    {UserInfos.map(user => (
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
          <h5 className="modal-title font-arabic" id="editModalLabel"> تعديل </h5>
        </div>
        <div className="modal-body" dir='rtl'>
          <form>
                <div className="form-group text-right">
                  <label htmlFor="edtitre">العنوان</label>
                  <input type="text" className="form-control" id="edtitre" name="titre" value={editUserData.titre} onChange={handleEditUserDataChange} required />
                </div>
                <div className="form-group text-right">
                  <label htmlFor="edisbn">ISBN </label>
                  <input type="text" className="form-control" id="edisbn" name="isbn" value={editUserData.isbn} onChange={handleEditUserDataChange} required />
                </div>
                <div className="form-group text-right">
                  <label htmlFor="eddepot_legal">الإيداع القانوني </label>
                  <input type="text" className="form-control" id="eddepot_legal" name="depot_legal" value={editUserData.depot_legal} onChange={handleEditUserDataChange} required />
                </div>
                <div className="form-group text-right">
                  <label htmlFor="edissn">ISSN </label>
                  <input type="text" className="form-control" id="edissn" name="issn" value={editUserData.issn} onChange={handleEditUserDataChange} required />
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
                    {UserInfos.map(user => (
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

export default Livres;
