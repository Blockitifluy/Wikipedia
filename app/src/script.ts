import { BinarySearch } from "./Utility"
import Syntax, { MetaRegex, LineRegex } from "./Syntax"

/**
 * The page as an object
 * @property Metadata - see {@link PageMetadata}
 * @proterty rawContent - The page as it's raw/source
 * @property Content - An array of HTML Element of the rawContent
 */
interface PageContent {
  Metadata : PageMetadata

  rawContent : string
  Content : HTMLElement[]
}

/**
 * The Pages metadata
 * @property title - The title of the page
 * @property stub - If the page is a stub
 */
interface PageMetadata {
  title: string
  stub: boolean
}

const ContentDiv : HTMLDivElement = document.querySelector("article > #content") as any,
StubDiv : HTMLDivElement = document.querySelector("#stub"),
MainTitle : HTMLHeadingElement = document.querySelector("article > .main");

/**
 * The page data for the article.
 * * Metadata - Containing the title and ect. See {@link PageMetadata}
 */
let PageData : PageContent = {
  Metadata : {
    title : "Loading...",
    stub : false
  },

  rawContent : "Loading...",
  Content : []
};

/**
 * If the string inside the split array matches then do the function
 * @param Regex Matches the string from the split array
 * @param split An array of strings meaning a different tag
 * @param funct The function to be executed when the Regex matches
 */
function SearchRegExp(Regex : RegExp, split : string[], funct : (match : RegExpMatchArray) => void) {

  BinarySearch<string>(split, (val : string) => { //O(log n)
    let match : RegExpMatchArray | null = val.trim().match(Regex),
    doesMatch : boolean = match !== null;

    if (!doesMatch) {
      return false;
    }

    funct(match);

    return true
  })

}

function LoadContent(rawContent : string) : HTMLElement[] {
  let Content : HTMLElement[] = [];

  const split : string[] = rawContent.split(LineRegex);

  for (let TagType of Syntax) { //O(n log n)
    
    SearchRegExp(TagType.search, split, (match : RegExpMatchArray) => {
      const FormedElement : HTMLElement | null = TagType.Form(match);

      if (!FormedElement) { //If Formed Element === null, then skip it
        return;
      }

      //Appends FormedElement to Content
      Content = [...Content, FormedElement]
    });

  }

  return Content;
}

/**
 * Generates Metadata from rawContent
 * @param rawContent The raw content
 * @returns Metadata
 */
function LoadMeta(rawContent : string) : PageMetadata {
  //Basic Metadata
  let Meta : PageMetadata = {title : "Loading...", stub : false};

  //*Splits the lines based on the LineRegex
  const split : string[] = rawContent.split(LineRegex);
  
  SearchRegExp(MetaRegex, split, (match) => { //?O(log n)
    //Checks if the tag doesn't have value, the value is true //?eg. {stub}
    let hasValue : boolean = match[2] !== undefined,
    key : string = match[1];

    Meta[key] = hasValue ? match[2] : true;
  });

  return Meta;
}

/**
 * Loads in page, using the url as input
 */
function LoadPage() {
  const queryString = window.location.search,
  urlParams = new URLSearchParams(queryString);

  //Sets the fileName to the Page Parameter in the URL 
  const fileName = decodeURIComponent(urlParams.get("page"));
  
  GeneratingPage(fileName).then(() => {
    //*Loads in the the metadata eg. Title
    PageData.Metadata = LoadMeta(PageData.rawContent);

    //Hides or Show the Stub info card based on the Metadata's stub value
    StubDiv.setAttribute("data-hidden", PageData.Metadata.stub ? "1" : "0");

    //Makes the Title (document and Main Title) to the Metadata title
    document.title = `Wikipedia - ${PageData.Metadata.title}`;
    MainTitle.innerText = PageData.Metadata.title;

    //*Generates the page using the rawContent
    PageData.Content = LoadContent(PageData.rawContent);
    console.log(PageData.Content);
    
    PageData.Content.forEach((PageElement : HTMLElement) => {
      //*Loads in the Content to the page
      ContentDiv.appendChild(PageElement); 
    });
  });

}

async function GeneratingPage(fileName : string) {
  try {
    //Requests a txt file to server //?http://localhost:8000/get_raw?page=Hello%20World
    const response : Response = await fetch(`http://localhost:8000/get_raw?page=${encodeURIComponent(fileName)}`);
    const data : string = await response.text(); //Converts the txt file to a string

    PageData.rawContent = data;
  }
  catch (error) {
    console.error(`Error fetching data: ${error}`);
  }
}

LoadPage();