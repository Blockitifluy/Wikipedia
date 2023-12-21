interface PageContent {
  Title : string
  Content : string
}

const fileName : string = "Photosythesis",
Article : HTMLDivElement = document.querySelector("article") as any;

let pageContent : PageContent | null = null;

function Refresh() : void {
}

async function GeneratingPage() {


  try {
    const response : Response = await fetch(`http://localhost:8000/get_raw?page=${encodeURIComponent(fileName)}`);
    const data : PageContent = await response.json();

    console.log(data);

    pageContent = data;
  }
  catch (error) {
    console.error(`Error fetching data: ${error}`);
  }
}

GeneratingPage();

Refresh();