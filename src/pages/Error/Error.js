import React from "react";
import { Link } from "react-router-dom";
// import { Link, useHistory } from "react-router-dom";
import "./error.css";

const Error = () => {

  // const history = useHistory()

  return (
    <div id="notfound">
      <div className="notfound">
        <div className="notfound-404">
          <h1>404</h1>
        </div>
        <h2>Oops! This Page Could Not Be Found</h2>
        <p>Sorry but the page you are looking for does not exist, have been removed. name changed or is temporarily unavailable</p>
        <button className="btn btn-primary">
          <Link style={{ color: "white" }} to="/dashboard">GO BACK</Link>
        </button>
      </div>
    </div>
  );
};

export default Error;
