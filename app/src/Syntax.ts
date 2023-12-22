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
export const MetaRegex : RegExp = /{([\w ]+)(?::([\w ]+))?}/,
/**
 * The RegExp to detect new lines.
 * 
 * {@link https://github.com/Blockitifluy/Wikipedia/ See the repository here for more infomation}
 * @example "Hello World○"
 */
LineRegex : RegExp = /○/g;

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
  constructor({ search, Form } : { search : RegExp, Form : FormSyntax }) {
    this.search = search;
    this.Form = Form;
  }
}

/**
 * The order of {@link TagSyntax} should be executed
 */
const Syntax : TagSyntax[] = [
  new TagSyntax({search : MetaRegex, Form : () => (null)}), //Meta Tags
  new TagSyntax({search: /(#{1,6}) (.+)/, Form : (match : RegExpMatchArray) => { //Header
    //*The length of the Hashtags (#) infer the level of the header
    let level : number = match[1].length;

    if (level > 6 || level > 1) { //!Throws error when level isn't between 1 - 6
      throw new Error(`Level of Header ${match[2]} is greater than 6 or less than 1. Level : ${level}`);
    }

    //Creates Header based on the level varibale
    const Header : HTMLHeadingElement = document.createElement(`h${level}`) as any;
    Header.innerText = match[2]; //Match two is the text

    return Header;
  }}),

  new TagSyntax({search : /(.+)/, Form : (match : RegExpMatchArray) => {
    const Paragraph : HTMLParagraphElement = document.createElement("p");
    Paragraph.innerText = match[1]; //Match one is just text

    return Paragraph;
  }})
]

export default Syntax;