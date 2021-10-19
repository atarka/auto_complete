import React from 'react';

export const classnames = (...args) => args.filter((arg) => !!arg).join(' ');

export const highlightRegex = (str) =>
  new RegExp(str.split('').map((c) => (c.match(/[a-zA-Z0-9]/) ? c : '\\' + c) + ' *').join(''), 'i');

export const highlightString = (text, terms) => {
  if (terms.length === 0 || text === '') {
    return [text];
  }

  const result = [];
  while (text !== '') {
    let match = '',
      minPos = 0;

    terms.forEach((re) => {
      const m = re.exec(text);
      if (m && (match === '' || m.index < minPos)) {
        minPos = m.index;
        match = m[0]; // eslint-disable-line prefer-destructuring
      }
    });

    if (match) {
      result.push(text.slice(0, Math.max(0, minPos)));
      result.push(
        <span key={`hl-${result.length}`} role="mark">
          {match}
        </span>,
      );
      text = text.slice(Math.max(0, minPos + match.length));
    } else {
      result.push(text);
      break;
    }
  }

  return result;
}
