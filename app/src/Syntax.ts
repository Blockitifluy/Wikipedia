interface TagSyntaxParams {
  search : RegExp,
  Form : FormSyntax
}

interface InlineTagParams {
  search : RegExp,
  Form : FormInline
}

type FormInline = (substring : string, ...arg : any[]) => (string)

/**
 * Turns a {@link RegExpMatchArray} to an HTMLElement (or Null).
 * @param match The matches from {@link TagSyntax.search TagSyntax's search propetry }
 * @returns A HTMLElement (or Null if you're dealing with Meta Tags)
 */
export type FormSyntax = (match : RegExpMatchArray) => (HTMLElement | null)

/**
 * The RegExp to detect Meta Tags.
 * @example "{title:Hello World}" or "{stub}"
 */
export const MetaRegex : RegExp = /{([\w ]+)(?::(.+))?}/,
/**
 * The RegExp to detect new lines.
 * 
 * {@link https://github.com/Blockitifluy/Wikipedia/ See the repository here for more infomation}
 * @example "Hello World○"
 */
LineRegex : RegExp = /○/g;

class InlineTag {
  public search : RegExp;
  public Form :FormInline;

  constructor({ search, Form } : InlineTagParams) {
    this.search = search;
    this.Form = Form;
  }
}

/**
 * If passes the {@link TagSyntax.search search}, then turns into a HTML Element (or Null if isn't displayed).
 * 
 * @see {@link Syntax Page Syntax}
 */
export class TagSyntax { 
  /**
   * The search RegExp, if the provided string is valid.
   */
  public search : RegExp;
  /**
   * Turns the provided text to HTML (null, if isn't displayed).
   * @see {@link FormSyntax}
   */
  public Form : FormSyntax;

  /**
   * @param search see {@link TagSyntax.search}
   * @param Form see {@link TagSyntax.Form} and {@link FormSyntax}
   */
  constructor({ search, Form } : TagSyntaxParams) {
    this.search = search;
    this.Form = Form;
  }
}

let PastUlElement : HTMLUListElement | null = null;

function TextToInline(txt : string) : string {
  let final : string = txt;

  for (let Inline of InlineSyntax) {
    let matchAll = final.replace(Inline.search, Inline.Form);

    final = matchAll;
  }

  return final;
}

/**
 * The order of {@link TagSyntax} should be executed
 */
const Syntax : TagSyntax[] = [
  new TagSyntax({search : MetaRegex, Form : () => (null)}), //Meta Tags

  new TagSyntax({search : /!(?:\[(.+)\])?\((.+)\)/, Form : (match : RegExpMatchArray) => {
    const ImageSection : HTMLDivElement = document.createElement('div');
    ImageSection.className = 'image-section';

    const Image : HTMLImageElement = document.createElement('img');
    Image.src = match[2];
    Image.alt = match[1] || '';
    ImageSection.appendChild(Image)

    if (match[1]) {
      const AltText : HTMLSpanElement = document.createElement('span');
      AltText.innerHTML = TextToInline(match[1]);
      ImageSection.appendChild(AltText);
    }

    return ImageSection;
  }}),

  new TagSyntax({search: /(#{1,6}) (.+)/, Form : (match : RegExpMatchArray) => { //Header
    PastUlElement = null;

    //*The length of the Hashtags (#) infer the level of the header
    let level : number = match[1].length;

    if (level > 7 || level < 1) { //!Throws error when level isn't between 1 - 6
      throw new Error(`Level of Header ${match[2]} is greater than 6 or less than 1. Level : ${level}`);
    }

    //Creates Header based on the level varibale
    const Header : HTMLHeadingElement = document.createElement(`h${level}`) as any;
    Header.innerHTML = TextToInline(match[2]); //Match two is the text

    return Header;
  }}),

  new TagSyntax({ search: /(?:\-|\*) (.+)/, Form : (match : RegExpMatchArray) => {
    let GetUL : HTMLUListElement = PastUlElement || document.createElement("ul");

    const ListItem : HTMLLIElement = document.createElement("li");
    ListItem.innerHTML = TextToInline(match[1]);

    GetUL.appendChild(ListItem);

    PastUlElement = GetUL;

    return GetUL;
  }}),

  new TagSyntax({ search : /(.*)/, Form : (match : RegExpMatchArray) => {
    const Paragraph : HTMLParagraphElement = document.createElement("p");

    Paragraph.innerHTML = TextToInline(match[1]); //Match one is just text
  
    return Paragraph;
  } })
  
]

const InlineSyntax : InlineTag[] = [
  new InlineTag({ search : /(?:\[(.+)\])?\((.+)\)/g, Form : (_ : string, g1 : string, g2 : string) => {
    return `<a href="${g2}">${g1 || g2}</a>`;
  }}),

  new InlineTag({ search : /__(.+?)__/g, Form : (_ : string, g1 : string) => {
    return `<strong>${g1}</strong>`;
  }}),

  new InlineTag({ search : /_(.+?)_/g, Form : (_ : string, g1 : string) => {
    return `<i>${g1}</i>`;
  }})
  
]

export default Syntax;