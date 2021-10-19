const filterNames = [
  {name: 'Jorge Valencia'},
  {name: 'Michael Jordan'},
  {name: 'Archetype Vicarius'},
  {name: 'Benedict Bandersnatch'},
  {name: 'Rambo Bloodaxe'},
  {name: 'Hugo Rune'},
  {name: 'Barry the Time Sprout'},
  {name: 'Nanny Ogg'},
  {name: 'Granny Weatherwax'},
  {name: 'Samuel Vimes'},
  {name: 'Aaron Schwarzman'},
  {name: 'William Starling'},
].map((item) => ({...item, _search: item.name.replace(/ +/g, '').toLowerCase()}));

export const fakeFilter = (str) => {
  // there are many possible implementations of an autocomplete matching, this one is a simple substring filter
  const lc = str.replace(/ +/g, '').toLowerCase();

  return new Promise((resolve) => {
    setTimeout(
      () => resolve(filterNames.filter((item) => item._search.indexOf(lc) !== -1)),
      Math.random() * 500 + 100
    );
  });
}


export const realFilter = (str) => {
  return new Promise((resolve, reject) => {
    fetch('https://atarka.ru/api/search.php?' + new URLSearchParams({ str }))
      .then((response) => response.json())
      .then((data) => resolve(data.items || []))
      .catch(reject);
  });
}
