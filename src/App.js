import React from 'react';
import './App.css';
import ProductList from './ProductList';

function App() {
  return (
    <div className="app-container">
      <div className="app">
        <header className="app-header">
          <h1>The Shopping List</h1>
        </header>
        <ProductList />
      </div>
      
    </div>
  );
}

export default App;
