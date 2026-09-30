fetch('http://localhost:3000/products')
  .then((response) => {
    return response.json();
  })
  .then((products) => {
    console.log(products);
  });
  