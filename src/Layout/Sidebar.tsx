import React from "react";

export default function Sidebar() {
  return (
    <div
      className="bg-dark text-white p-3"
      style={{ width: "220px", minHeight: "100vh" }}
    >
      <h5 className="text-center">Menu</h5>
      <ul className="nav flex-column mt-4">
        <li className="nav-item">
          <a className="nav-link text-white" href="/">
            Form-Name
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link text-white" href="/formbuilder">
            Dynamic-Form-Config
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link text-white" href="/FormList">
            User-Forms-Submission
          </a>
        </li>
         <li className="nav-item">
          <a className="nav-link text-white" href="/users">
            User-List
          </a>
        </li>
      </ul>
    </div>
  );
};

