import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import '../../../css/users.css';

function Child2() {
  const [doctorants, setDoctorants] = useState([]);
  const [error, setError] = useState(null);
  const [selectedAnnee, setSelectedAnnee] = useState('');
  const [selectedLaboratoire, setSelectedLaboratoire] = useState('');
  const [selectedEquipe, setSelectedEquipe] = useState('');
  const [laboratoires, setLaboratoire] = useState([]);

  const fetchData = async () => {
    setError(null);
    try {
      const response = await axios.get('/admin/professor/doctorants', {
        params: { 
          id: 39,  
        }
      });
      setDoctorants(response.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [usersResponse, laboResponse] = await Promise.all([
          axios.get('/users'),
          axios.get('/users'),
        ]);
        setDoctorants(usersResponse.data.data);
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

  const clearFilters = () => {
    setSelectedAnnee('');
    setSelectedLaboratoire('');
    setSelectedEquipe('');
    fetchData();
  };

  const convertToExcel = (data) => {
  const ws = XLSX.utils.json_to_sheet(data.map(user => ({
    'الإسم و النسب': `${user.user.nom} ${user.user.prénom}`,
    'البطاقة الوطنية': user.CIN,
    'رقم أبوجي': user.APOGEE,
    'الجنسية': user.nationalite,
    'تاريخ التسجيل': user.date_inscription,
    'تاريخ المناقشة': user.date_soutenance,
    'الموضوع': user.sujet_these,
  })));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Doctorants');

  return wb;
};

const downloadExcel = () => {
  const wb = convertToExcel(doctorants);
  XLSX.writeFile(wb, 'doctorants.xlsx');
};

  

  return (
    <div className="row font-arabic">
      <div className="col-12">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title font-arabic p-2" style={{ float: 'right', borderBottom: 'none',
    paddingBottom: '0' }}>لائحة طلاب الدكتوراه</h3>
    <div className="card-tools" style={{ marginRight: '10rem' }}>
          </div>
          <div className="filter-group">
            <select
                className="form-select"
                style={{ width: '30%' }}
                value={selectedLaboratoire}
                onChange={(e) => setSelectedLaboratoire(e.target.value)}
              >
                <option value="">اختيار الأستاذ</option>
                {laboratoires.map(labo => (
                  <option key={labo.id} value={labo.id}>{labo.nom}</option>
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
                <th>الموضوع </th>
                  <th> تاريخ المناقشة</th>
                  <th> تاريخ التسجيل</th>
                  <th>الجنسية </th>
                  <th> رقم أبوجي</th>
                  <th>البطاقة الوطنية</th>
                  <th> النسب</th>
                  <th>الإسم</th>
                </tr>
              </thead>
              <tbody>
                {doctorants.map(user => (
                  <tr key={user.id} style={{ textAlign: 'right' }}>
                    <td>{user.user.nom} {user.user.prénom}</td>
                    <td>{user.sujet_these}</td>
                    <td>{user.date_soutenance}</td>
                    <td>{user.date_inscription}</td>
                    <td>{user.nationalite}</td>
                    <td>{user.APOGEE}</td>
                    <td>{user.CIN}</td>
                    <td>{user.NOM}</td>
                    <td>{user.PRENOM}</td>
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
    </div>
  );
}

export default Child2;
