import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../../css/users.css';


function Laboratoires() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [newUserData, setNewUserData] = useState({
    nom: '',
  });
  const [editUserData, setEditUserData] = useState(null);

  const fetchData = async () => {
    setError(null);
    try {
      const response = await axios.get('/laboratoires');
      setUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  });

  const handleNewUserDataChange = (e) => {
    const { name, value } = e.target;
    setNewUserData({ ...newUserData, [name]: value });
  };

  const handleEditUserDataChange = (e) => {
    const { name, value } = e.target;
    setEditUserData({ ...editUserData, [name]: value });
  };

  const addUser = async () => {
    const { nom } = newUserData;
    if (!nom ) {
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'يرجى ملء جميع الحقول المطلوبة!',
      });
      return;
    }
    try {
      await axios.post('/laboratoires', { nom });
      fetchData();
      setNewUserData({
        nom: '',
      });
      Swal.fire({
        title: "تم",
        text: "تمت الإضافة  بنجاح.",
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
      const { id, nom } = editUserData;
      await axios.put(`/laboratoires/${id}`, { nom });
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
        await axios.delete(`/laboratoires/${id}`);
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
    paddingBottom: '0' }}>لائحة المختبرات</h3>
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
                  <th>الإسم</th>
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
                    <td>{user.nom}</td>
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
              <h5 className="modal-title font-arabic" id="exampleModalLabel">إضافة مختبر</h5>
            </div>
            <div className="modal-body" dir='rtl'>
              <form>
                <div className="form-group text-right">
                  <label htmlFor="addnom">الإسم</label>
                  <input type="text" className="form-control" id="addnom" name="nom" value={newUserData.nom} onChange={handleNewUserDataChange} required />
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
          <h5 className="modal-title font-arabic" id="editModalLabel">  الفريق تعديل</h5>
        </div>
        <div className="modal-body" dir='rtl'>
          <form>
          <div className="form-group text-right">
                  <label htmlFor="nom">الإسم</label>
                  <input type="text" className="form-control" id="nom" name="nom" value={editUserData.nom} onChange={handleEditUserDataChange} required />
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

export default Laboratoires;
