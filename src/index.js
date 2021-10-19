import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import '../styles/app.scss'; // went for a global css, no css modules

ReactDOM.render(<App />, document.querySelector('#app'));
