import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  
} from "react-router-dom";
import { useState } from "react";
import NavBar from "./Components/NavBar";
import Home from "./Components/Home";
import About from "./Components/About";
import NoteState from "./Context/notes/NoteState";
import Alert from "./Components/Alert";
import Signup from './Components/Signup';
import Login from './Components/Login';

function App() {
  const [alert, setAlert] = useState(null)
  const showAlert=(message,type)=>{
    setAlert({
      msg:message,
      type:type 
    })
    setTimeout(() => {
      setAlert(null)
    }, 2000);
  }

  return (
    <>
    <NoteState>
      <Router>
        <NavBar />
        <Alert alert={alert}/>
  <div className="container">
        <Switch>
          
          <Route exact path="/">
            <Home  showAlert={showAlert} />
            
          </Route>
          <Route exact path="/about">
            <About />
          </Route>
          <Route exact path="/login">
                <Login  showAlert={showAlert}/>
              </Route>
              <Route exact path="/signup">
                <Signup showAlert={showAlert} />
              </Route>
        </Switch>
        </div>
      </Router>
      </NoteState>
    </>
  );
}

export default App;
