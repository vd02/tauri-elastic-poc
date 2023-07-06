import React, { useEffect, useState } from 'react';
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:3001';

const App: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    fetchData();
    createIndex();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/data');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const createData = () => {
    return new Promise((resolve, reject) => {
      axios
        .post('/api/data', { title: newTitle })
        .then(() => {
          setNewTitle('');
          setTimeout(() => {
            resolve(fetchData());
          }, 700);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  const createIndex = () => {
    return new Promise((resolve, reject) => {
      axios
        .put('/api/create-index')
        .then(() => {
          console.log('Index created successfully');
          resolve(true);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  const deleteData = (id: string) => {
    return new Promise((resolve, reject) => {
      axios
        .delete(`/api/data/${id}`)
        .then(() => {
          setTimeout(() => {
            resolve(fetchData());
          }, 700);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  return (
    <div>
      <h1>Elasticsearch POC</h1>
      <div>
        <h2>Data:</h2>
        <ul>
          {data.map((item) => (
            <>
              <li key={item._id}>
                {item._source.title}<span> -- </span>
                <button onClick={() => deleteData(item._id)}>Delete</button>
              </li>
              <div>----------------------------------------------</div>
            </>
          ))}
        </ul>
      </div>
      <div>
        <h2>Create Data:</h2>
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <button onClick={() => createData()}>
          Create
        </button>
      </div>
    </div>
  );
};

export default App;
