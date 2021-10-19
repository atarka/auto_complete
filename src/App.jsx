import * as React from 'react';
import { useState } from 'react';
import AutoComplete from './components/AutoComplete';
import AutoCompleteHooks from './components/AutoCompleteHooks';
import { fakeFilter, realFilter } from './services/api';

export default function() {
  const [ inputClassy, setInputClassy ] = useState('');
  const [ inputFunky, setInputFunky ] = useState('');

  return (
    <div className="sample-app">
      <div className="sample-input">
        <p>Classy mocker</p>
        <AutoComplete value={inputClassy} onChange={setInputClassy} filter={fakeFilter} />
        <p className="description">This is a class implementation with mock function for querying data with a random high response delay.</p>
      </div>

      <div className="sample-input">
        <p>Funky real</p>
        <AutoCompleteHooks
          className="could-be-funky"
          value={inputFunky}
          onChange={setInputFunky}
          filter={realFilter}
          typeDelay={0}
          locked
        />
        <p className="description">
          This one is function component with hooks and a real API endpoint.
          This one is also locked, allowing you to only select values from the list.
        </p>
      </div>
    </div>
  );
}
