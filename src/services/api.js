export async function getCategories() {
  // Implemente aqui
  const result = await fetch('https://api.mercadolibre.com/sites/MLB/categories');
  const resolver = result.json();
  return resolver;
}

export async function getProductsFromCategoryAndQuery(categoryId, query) {
  // Implemente aqui! Quando o fizer, descomente os parâmetros que essa função recebe
  const result = await fetch(`https://api.mercadolibre.com/sites/MLB/search?category=${categoryId}&q=${query}`);
  const resolver = result.json();
  return resolver;
}
