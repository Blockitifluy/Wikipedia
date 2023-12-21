interface PageContent {
  Metadata : PageMetadata

  rawContent : string
  Content : HTMLElement[]
}

interface PageMetadata {
  title: string
  stub: boolean
}

let fileName : string = "photosynthesis";

const ContentDiv : HTMLDivElement = document.querySelector("article > #content") as any,
StubDiv : HTMLDivElement = document.querySelector("#stub");

let PageData : PageContent = {
  Metadata : {
    title : "Loading...",
    stub : false
  },

  rawContent : "Loading...",
  Content : []
};

function SearchRegExp(Regex : RegExp, split : string[], funct : (match : RegExpMatchArray) => void) {
  for (let line of split) {
    let match : RegExpMatchArray | null = line.trim().match(Regex),
    doesMatch : boolean = match !== null;
    
    if (!doesMatch) {
      continue; //Skips
    }

    funct(match);
  }
}

function LoadMeta(rawContent : string) : PageMetadata {
  let Meta : PageMetadata = {title : "Loading...", stub : false};

  const MetaRegex : RegExp = /{([\w ]+)(?::([\w ]+))?}/,
  split : string[] = rawContent.split(/\n|\r|(?:\r\n)/g);
  
  SearchRegExp(MetaRegex, split, (match) => {
    let hasValue : boolean = match[2] !== undefined,
    key : string = match[1];
    console.log(hasValue, match, hasValue ? match[2] : true);

    Meta[key] = hasValue ? match[2] : true;
  });

  return Meta;
}

function LoadPage() {
  const queryString = window.location.search,
  urlParams = new URLSearchParams(queryString);

  fileName = decodeURIComponent(urlParams.get("page"));
  
  GeneratingPage().then(() => {
    ContentDiv.innerText = PageData.rawContent; //Temp
    
    PageData.Metadata = LoadMeta(PageData.rawContent);
    console.log(PageData);

    StubDiv.setAttribute("data-hidden", PageData.Metadata.stub ? "1" : "0");

    document.title = `Wikipedia - ${PageData.Metadata.title}`;
  }); //Loads pageContent

}

async function GeneratingPage() {
  try {
    const response : Response = await fetch(`http://localhost:8000/get_raw?page=${encodeURIComponent(fileName)}`);
    const data : string = await response.text();

    PageData.rawContent = data;
  }
  catch (error) {
    console.error(`Error fetching data: ${error}`);
  }
}

LoadPage();