import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [completed, setCompleted] = useState(false);
  const [warning, setWarning] = useState("")
  const [page, setPage] = useState(0);
  const [items] = useState(5);

  // Grabs data from Django
  const grabData = () => {
    axios.get('http://localhost:8001/api/todos/')
      .then(res => setData(res.data))
      .catch(err => console.log(err));
  }

  // Updates a single completed status
  const updateStatus = (item) => {
    console.log(item);
    item['completed'] = !item['completed'];
    console.log(item);

    axios.put(`http://localhost:8001/api/todos/${item.id}/`, item)
      .then(res => grabData())
      .catch(err => console.log(err));
  }

  // Submits a new Todo to Django backend
  const handleSubmit = () => {
    let date = new Date();

    let item = {
      "title": title,
      "description": description,
      "completed": completed,
      "set_date": date
    }

    if (title !== "" && description !== "") {
      setWarning("")
      axios.post('http://localhost:8001/api/todos/', item)
        .then(res => grabData())
        .catch(err => console.log(err))
    } else {
      setWarning("You need a title and description!")
    }
  }

  // Deletes an item from the db
  const handleDelete = (item) => {
    axios.delete(`http://localhost:8001/api/todos/${item.id}/`)
      .then(res => grabData());
  }

  // Handles page changing for Pagination
  const handlePage = (direction) => {
    if (direction === 'right') {
      setPage(page + 1);
    } else {
      setPage(page - 1);
    }
  }

  useEffect(() => {
    grabData()
  }, [])

  return (
    <>
      <div className='head'><h1>React / Django Todo</h1></div>
      <div className='header-row'>
        <div className='row' style={{ borderBottom: 'none' }}>
          <h4 className='box' style={{ borderBottom: 'none' }}>Id</h4>
          <h4 className='box' style={{ borderBottom: 'none' }}>Title</h4>
          <h4 className='box' style={{ borderBottom: 'none' }}>Description</h4>
          <h4 className='box' style={{ borderBottom: 'none' }}>Date Set</h4>
          <h4 className='box' style={{ borderBottom: 'none' }}>Completed</h4>
          <h4 className='box' style={{ borderBottom: 'none' }}>Update</h4>
        </div>
      </div>

      <div className='table'>
        {data.slice(page * items, items + page * items).map((element, i) => (
          <div key={i}>
            {
              (i + 1) % items === 0
                ? <div className='row' style={{ borderBottom: 'none' }}>
                  <div className='box'>{page * items + i + 1}</div>
                  <div className='box'>{element.title}</div>
                  <div className='box'>{element.description}</div>
                  <div className='box'>{element.set_date}</div>
                  {
                    element.completed
                      ? <div className='box' style={{ color: 'green', fontWeight: 'bold' }}>True</div>
                      : <div className='box' style={{ color: 'red', fontWeight: 'bold' }}>False</div>
                  }
                  {
                    element.completed
                      ? <div className='box'><button onClick={() => updateStatus(element)}>Revoke</button></div>
                      : <div className='box'><button onClick={() => updateStatus(element)}>Complete</button></div>
                  }
                  <div className='btn' onClick={() => handleDelete(element)}>x</div>
                </div>

                : <div className='row'>
                  <div className='box'>{page * items + i + 1}</div>
                  <div className='box'>{element.title}</div>
                  <div className='box'>{element.description}</div>
                  <div className='box'>{element.set_date}</div>
                  {
                    element.completed
                      ? <div className='box' style={{ color: 'green', fontWeight: 'bold' }}>True</div>
                      : <div className='box' style={{ color: 'red', fontWeight: 'bold' }}>False</div>
                  }
                  {
                    element.completed
                      ? <div className='box'><button onClick={() => updateStatus(element)}>Revoke</button></div>
                      : <div className='box'><button onClick={() => updateStatus(element)}>Complete</button></div>
                  }
                  <div className='btn' onClick={() => handleDelete(element)}>x</div>
                </div>
            }
          </div>
        ))}
      </div>

      <div className='submit-bar'>
        <div className='submit'>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            Title
            <textarea onChange={(e) => setTitle(e.target.value)}></textarea>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            Description
            <textarea onChange={(e) => setDescription(e.target.value)} style={{ width: '400px' }}></textarea>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            Completed
            <input type='checkbox' onChange={() => setCompleted(!completed)} style={{ marginTop: '0.5em' }}></input>
          </div>
          <button onClick={handleSubmit}>Submit</button>
        </div>
      </div>
      <div style={{ marginTop: '1em' }}>{warning}</div>

      {
        page === 0
          ? <button className='left-btn' disabled>Prev</button>
          : <button className='left-btn' onClick={() => handlePage('left')}>Prev</button>
      }
      {
        page >= Math.ceil(data.length / items) - 1
          ? <button className='right-btn' disabled>Next</button>
          : <button className='right-btn' onClick={() => handlePage('right')}>Next</button>
      }



    </>
  )
}

export default App
