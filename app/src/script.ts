
import { SplitAndTrim } from "./Utility"
import Syntax, { MetaRegex, LineRegex, TagSyntax } from "./Syntax"

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
MainTitle : HTMLHeadingElement = document.querySelector("article > .main"),
SidebarList : HTMLUListElement = document.querySelector("#sidebar > ul");

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

function GetValidSyntax(str : string) : [TagSyntax, RegExpMatchArray] {
  console.log(`Getting valid syntax for ${str}`);

  for (let SyntaxTag of Syntax) {
    
    const Match : RegExpMatchArray | null = str.match(SyntaxTag.search),
    doesMatch : boolean = Match !== null;
    
    if (!doesMatch) {
      continue;
    }

    return [SyntaxTag, Match];
  }

  throw new Error(`Text ${str} doesn't match with any syntax`);
}

function LoadContent(split : string[]) : HTMLElement[] {
  let Content : HTMLElement[] = [];

  let step : number = 0;

  do {
    const val : string = split[step];

    const [SyntaxTag, Match] = GetValidSyntax(val);

    let LoadedHTML = SyntaxTag.Form(Match);

      if (!LoadedHTML) {
      step++;
      continue;
      }

      step++;
      Content = [...Content, LoadedHTML];
  } while (step < split.length)

  return Content;
}

/**
 * Generates Metadata from rawContent
 * @param rawContent The raw content
 * @returns Metadata
 */
function LoadMeta(split : string[]) : PageMetadata {
  //Basic Metadata
  let Meta : PageMetadata = {title : "Loading...", stub : false};

  let step : number = 0;

  console.group("Loading Metatags")

  do {
    const val : string = split[step];

    const Match : RegExpMatchArray | null = val.match(MetaRegex),
    doesMatch : boolean = Match !== null;

    if (!doesMatch) {
      console.log(`Text ${val} doesn't match with ${MetaRegex}.`);

      step++;

      continue;
    } //Passes

    let hasValue : boolean = Match[2] !== undefined,
    key : string = Match[1];

    console.log(`${val} matches and has the key: ${key} and has the value of ${Match[2]}`);

    Meta[key] = hasValue ? Match[2] : true;

    step++;
  } while (step < split.length)

  console.groupEnd();

  return Meta;
}

const SideHeaderSearch : string[] = ['#content > h1', '#content > h2', '#content > h3', '#content > h4', '#content > h5', '#content > h6'];

function LoadSideHeaders() {
  const Headers : NodeListOf<HTMLHeadingElement> = document.querySelectorAll<HTMLHeadingElement>(SideHeaderSearch.join(','));
  
  for (let Header of Headers) {
    let level : string = Header.tagName.match(/H(\d)/)[1];

    const HeaderListItem : HTMLLIElement = document.createElement('li');
    HeaderListItem.className = `tab-${level} dark-txt list-button`;
    HeaderListItem.innerHTML = Header.innerHTML;
    SidebarList.appendChild(HeaderListItem);

    HeaderListItem.addEventListener('click', () => {
      Header.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
    });
  }
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
const preComputeTime = Date.now() 

    let split : string[] = SplitAndTrim(PageData.rawContent, LineRegex);
    
    //*Loads in the the metadata eg. Title
    PageData.Metadata = LoadMeta(split);

    //Hides or Show the Stub info card based on the Metadata's stub value
    StubDiv.setAttribute("data-hidden", PageData.Metadata.stub ? "1" : "0");

    //Makes the Title (document and Main Title) to the Metadata title
    document.title = `Wikipedia - ${PageData.Metadata.title}`;
    MainTitle.innerText = PageData.Metadata.title;

    //*Generates the page using the rawContent
    PageData.Content = LoadContent(split);
    
    PageData.Content.forEach((PageElement : HTMLElement) => {
      //*Loads in the Content to the page

      ContentDiv.appendChild(PageElement); 
    });

    LoadSideHeaders();

    console.info(`Loading took ${Date.now() - preComputeTime} ms to execute.`)
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