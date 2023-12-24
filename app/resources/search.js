var SearchBar = document.querySelector("#searchbar");
SearchBar.addEventListener("change", () => {
    console.log("Redirection");
    location.href = `http://localhost:8000/wiki?page=${SearchBar.value}`;
});
