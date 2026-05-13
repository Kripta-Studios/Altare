async function test() {
  const query = `
    query {
      commentaries(book: "mt", chapter: 1, verse: 1) {
        author
        text
      }
    }
  `;

  const res = await fetch('https://api.catenabible.com/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  });

  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}

test();
