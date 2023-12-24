import { SplitAndTrim } from "./Utility";
import Syntax, { MetaRegex, LineRegex } from "./Syntax";
const ContentDiv = document.querySelector("article > #content"), StubDiv = document.querySelector("#stub"), MainTitle = document.querySelector("article > .main"), SidebarList = document.querySelector("#sidebar > ul");
let PageData = {
    Metadata: {
        title: "Loading...",
        stub: false
    },
    rawContent: "Loading...",
    Content: []
};
function GetValidSyntax(str) {
    console.log(`Getting valid syntax for ${str}`);
    for (let SyntaxTag of Syntax) {
        const Match = str.match(SyntaxTag.search), doesMatch = Match !== null;
        if (!doesMatch) {
            continue;
        }
        return [SyntaxTag, Match];
    }
    throw new Error(`Text ${str} doesn't match with any syntax`);
}
function LoadContent(split) {
    let Content = [];
    let step = 0;
    do {
        const val = split[step];
        const [SyntaxTag, Match] = GetValidSyntax(val);
        let LoadedHTML = SyntaxTag.Form(Match);
        if (!LoadedHTML) {
            step++;
            continue;
        }
        step++;
        Content = [...Content, LoadedHTML];
    } while (step < split.length);
    return Content;
}
function LoadMeta(split) {
    let Meta = { title: "Loading...", stub: false };
    let step = 0;
    console.group("Loading Metatags");
    do {
        const val = split[step];
        const Match = val.match(MetaRegex), doesMatch = Match !== null;
        if (!doesMatch) {
            console.log(`Text ${val} doesn't match with ${MetaRegex}.`);
            step++;
            continue;
        }
        let hasValue = Match[2] !== undefined, key = Match[1];
        console.log(`${val} matches and has the key: ${key} and has the value of ${Match[2]}`);
        Meta[key] = hasValue ? Match[2] : true;
        step++;
    } while (step < split.length);
    console.groupEnd();
    return Meta;
}
const SideHeaderSearch = ['#content > h1', '#content > h2', '#content > h3', '#content > h4', '#content > h5', '#content > h6'];
function LoadSideHeaders() {
    const Headers = document.querySelectorAll(SideHeaderSearch.join(','));
    for (let Header of Headers) {
        let level = Header.tagName.match(/H(\d)/)[1];
        const HeaderListItem = document.createElement('li');
        HeaderListItem.className = `tab-${level} dark-txt list-button`;
        HeaderListItem.innerHTML = Header.innerHTML;
        SidebarList.appendChild(HeaderListItem);
        HeaderListItem.addEventListener('click', () => {
            Header.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
        });
    }
}
function LoadPage() {
    const queryString = window.location.search, urlParams = new URLSearchParams(queryString);
    const fileName = decodeURIComponent(urlParams.get("page"));
    GeneratingPage(fileName).then(() => {
        const preComputeTime = Date.now();
        let split = SplitAndTrim(PageData.rawContent, LineRegex);
        PageData.Metadata = LoadMeta(split);
        StubDiv.setAttribute("data-hidden", PageData.Metadata.stub ? "1" : "0");
        document.title = `Wikipedia - ${PageData.Metadata.title}`;
        MainTitle.innerText = PageData.Metadata.title;
        PageData.Content = LoadContent(split);
        PageData.Content.forEach((PageElement) => {
            ContentDiv.appendChild(PageElement);
        });
        LoadSideHeaders();
        console.info(`Loading took ${Date.now() - preComputeTime} ms to execute.`);
    });
}
async function GeneratingPage(fileName) {
    try {
        const response = await fetch(`http://localhost:8000/get_raw?page=${encodeURIComponent(fileName)}`);
        const data = await response.text();
        PageData.rawContent = data;
    }
    catch (error) {
        console.error(`Error fetching data: ${error}`);
    }
}
LoadPage();
