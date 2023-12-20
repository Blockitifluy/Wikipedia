var SearchBar : HTMLInputElement = document.querySelector("#searchbar") as any;

SearchBar.addEventListener("change", () => {
  console.log("Redirection");
  location.href = `http://localhost:8000/wiki?page=${SearchBar.value}`;
});