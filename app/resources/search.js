var SearchBar = document.querySelector("#searchbar");
SearchBar.addEventListener("change", function () {
    console.log("Redirection");
    location.href = "http://localhost:8000/wiki?page=".concat(SearchBar.value);
});
