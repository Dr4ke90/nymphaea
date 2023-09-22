import React from "react";
import "./listaBonuriCasa.css";

export default function ListaBonuriCasa({ bonuri, setBonCurrent }) {
  return (
    <div className="lista-bonuri">
      <div className="title">
        <h4>De incasat</h4>
        <hr />
      </div>
      <div className="list-container">
        <ol>
          {bonuri.map((bon) => {
            return (
              <li
                key={bon.nrBon}
                onClick={() => setBonCurrent(bon)}
              >{`${bon.codAngajat} - ${bon.nrBon}`}</li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
