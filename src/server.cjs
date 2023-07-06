// server.js
const express = require('express');
const { Client } = require('@elastic/elasticsearch');
const cors = require('cors');

const app = express();
const port = 3001;
app.use(cors());

const client = new Client({ node: 'http://localhost:9200' });

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is running');
});


app.put('/api/create-index', async (req, res) => {
  try {
    const { body } = await client.indices.create({
      index: 'my-index-1'
    });
    res.json(body);
  } catch (error) {
    console.error('Error creating index:', error);
    res.status(500).send('Error creating index');
  }
});

app.get('/api/data', async (req, res) => {
  try {
    const { body } = await client.search({
      index: 'my-index-1',
      body: {
        query: {
          match_all: {},
        },
      },
    });
    res.json(body.hits.hits);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  }
});

app.post('/api/data', async (req, res) => {
  try {
    const { title } = req.body;
    const { body } = await client.index({
      index: 'my-index-1',
      body: {
        title,
      },
    });
    res.json(body);
  } catch (error) {
    console.error('Error creating data:', error);
    res.status(500).send('Error creating data');
  }
});

app.delete('/api/data/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = await client.delete({
      index: 'my-index-1',
      id,
    });
    res.json(body);
  } catch (error) {
    console.error('Error deleting data:', error);
    res.status(500).send('Error deleting data');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
