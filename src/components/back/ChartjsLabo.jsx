import React, { PureComponent } from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

export default class Example extends PureComponent {
  state = {
    data: [],
    selectedYear: '', // to store the selected year
  };

  static demoUrl = 'https://codesandbox.io/p/sandbox/simple-bar-chart-72d7y5';

  componentDidMount() {
    this.fetchData();
  }

  fetchData = (year = '') => {
    let url = '/chart-data-labo';
    if (year) {
      url += `?annee=${year}`;
    }

    axios.get(url)
      .then(response => {
        this.setState({ data: response.data });
      })
      .catch(error => {
        console.error('There was an error fetching the data!', error);
      });
  };

  handleYearChange = (event) => {
    const selectedYear = event.target.value;
    this.setState({ selectedYear });
    this.fetchData(selectedYear);
  };

  render() {
    const { data, selectedYear } = this.state;

    return (
      <div style={{ width: '100%', height: '100%' }}>
        <div className='titre' style={{ 
          background: 'cadetblue',
          color: 'white',
          fontWeight: '600',
          padding: '10px',
          textAlign: 'center',
          marginBottom: '17px'
         }}>Nombre de livres et d'articles pour chaque laboratoire.</div>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="year-select">Sélectionnez l'année : </label>
          <select style={{ marginLeft: '16px',
    padding: '5px 19px',
    border: '1px solid #00000014' }} id="year-select" value={selectedYear} onChange={this.handleYearChange}>
            <option value="">Tous</option>
            {Array.from({ length: new Date().getFullYear() - 1999 }, (_, i) => 2000 + i).reverse().map(year => (
    <option key={year} value={year}>{year}</option>
  ))}
            {/* Add more options as needed */}
          </select>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => {
                if (name === 'uv') return [value, 'Articles'];
                if (name === 'pv') return [value, 'Livres'];
                return [value, name];
              }}
            />
            <Legend 
              formatter={(value) => {
                if (value === 'uv') return 'Articles';
                if (value === 'pv') return 'Livres';
                return value;
              }}
            />
            <Bar dataKey="pv" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
            <Bar dataKey="uv" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="purple" />} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
}
