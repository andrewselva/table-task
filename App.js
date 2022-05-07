import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [tableValue, setTableValue] = useState([]);
  const [isEdit, setEdit] = useState(false);
  const handleInputChange = (index, key) => e => {
    let newArr = [...tableValue]; 
    newArr[index][key] = e.target.value; 
    setTableValue(newArr);
  };  
  const editFunct= () =>{
    setEdit(!isEdit);
    if(isEdit){
      localStorage.setItem('items', JSON.stringify(tableValue));
    }
  }
  const deleteFunct= (e, index) =>{
    const filtTableValue = tableValue.filter((val, ind)=> ind !== index);
    setTableValue(filtTableValue);
    localStorage.setItem('items', JSON.stringify(filtTableValue));
  }
    useEffect(() => {
      const items = JSON.parse(localStorage.getItem('items'));
      if (items) {
        setIsLoaded(true);
        setTableValue(items);
      } else {
        fetch("https://reqres.in/api/users?page=1")
            .then(res => res.json())
            .then(
                (response) => {
                    setIsLoaded(true);
                    setTableValue(response.data);
                    localStorage.setItem('items', JSON.stringify(response.data));
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
        }
      }, [])
      if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
        return (
            <ul>
                {tableValue.map((value, i) => (
                  <table class="table">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Email</th>
                        <th scope="col">First Name</th>
                        <th scope="col">Last Name</th>
                        <th scope="col">Avatar</th>
                      </tr>
                    </thead>
                    <tbody key={value.id}>
                      <tr>
                        <th scope="row">{i + 1}</th>
                        <td>{isEdit ?(<input
                            value={value.email}
                            name="email"
                            onChange={handleInputChange(i, 'email')}
                          />):(<span>{value.email}</span>)}</td>
                        <td>{isEdit ?(<input
                            value={value.first_name}
                            name="first_name"
                            onChange={handleInputChange(i, 'first_name')}
                          />):(<span>{value.first_name}</span>)}</td>
                        <td>{isEdit ?(<input
                            value={value.last_name}
                            name="last_name"
                            onChange={handleInputChange(i, 'last_name')}
                          />):(<span>{value.last_name}</span>)}</td>
                        <td><img src={value.avatar} alt={value.id}></img></td>
                        <td><button type="button" onClick={editFunct} class="btn btn-primary">{isEdit?"Save":"Edit"}</button></td>
                        <td><button type="button" onClick={(e) => deleteFunct(e, i)} class="btn btn-danger">Delete</button></td>
                      </tr>
                    </tbody>
                </table>
                ))}
            </ul>
        );
    }
}

export default App;
