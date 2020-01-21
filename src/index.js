import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Route,
  NavLink,
  withRouter
} from "react-router-dom";
import axios from "axios";

import Home from "./components/Home";
import ItemsList from "./components/ItemsList";
import Item from "./components/Item";
import ItemForm from "./components/ItemForm";
import UpdateForm from "./components/UpdateForm";
import "./styles.css";

const App = props => {
  const [items, setItems] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:3333/items")
      .then(res => setItems(res.data))
      .catch(error => console.log(error));
  }, []);

  const updateItem = (id, item) => {
    axios
      .put(`http://localhost:3333/items/${id}`, item)
      .then(response => {
        setItems(response.data);
        props.history.push(`/item-list/${id}`);
      })
      .catch(err => console.log(err));
  };

  const deleteItem = id => {
    console.log("FROM APP.js", id);
    axios
      .delete(`http://localhost:3333/items/${id}`)
      .then(response => {
        console.log(response);
        setItems(response.data);
        props.history.replace("/item-list");
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="App">
      <nav>
        <h1 className="store-header">Dan's Trinkets</h1>
        <div className="nav-links">
          <NavLink exact to="/item-form">
            Add Item
          </NavLink>
          <NavLink exact to="/">
            Home
          </NavLink>
          <NavLink to="/item-list">Shop</NavLink>
        </div>
      </nav>

      <Route exact path="/" component={Home} />
      <Route
        exact
        path="/item-list"
        render={props => (
          <ItemsList
            {...props} // this is the same as below
            //               match={props.match}
            //               history={props.history}
            //               location={props.location}
            items={items}
          />
        )}
      />
      <Route
        path="/item-list/:id"
        render={props => (
          <Item {...props} items={items} deleteItem={deleteItem} />
        )}
      />
      <Route path="/item-form" component={ItemForm} />
      <Route
        path="/edit-item/:id"
        render={props => (
          <UpdateForm {...props} items={items} updateItem={updateItem} />
        )}
      />
    </div>
  );
};
const AppWithRouter = withRouter(App);
const rootElement = document.getElementById("root");
ReactDOM.render(
  <Router>
    <AppWithRouter />
  </Router>,
  rootElement
);
