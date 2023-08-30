import React, { useState } from "react";

import "./login.css";

export default function LoginForm() {

  const initialState = {
    email: '',
    pass: ''
  }

  const [userDatas, setUserDatas] = useState(initialState)
 
  

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;

    setUserDatas({
      ...userDatas,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
  };
  

  return (
    <div className="login-page">
      <div className="form-container">
        <div className="form-header">
          <h3>Login</h3>
        </div>
        <form action="POST" className="login-form">
          <input
            type="email"
            placeholder="Email address"
            name="email"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            placeholder="Password"
            name="pass"
            onChange={handleChange}
            required
          />
          <input type="submit" value="Login" onClick={handleSubmit} />
        </form>
      </div>
    </div>
  );
}
