export const MetaRegex = /{([\w ]+)(?::(.+))?}/, LineRegex = /○/g;
class InlineTag {
    search;
    Form;
    constructor({ search, Form }) {
        this.search = search;
        this.Form = Form;
    }
}
export class TagSyntax {
    search;
    Form;
    constructor({ search, Form }) {
        this.search = search;
        this.Form = Form;
    }
}
let PastUlElement = null;
function TextToInline(txt) {
    let final = txt;
    for (let Inline of InlineSyntax) {
        let matchAll = final.replace(Inline.search, Inline.Form);
        final = matchAll;
    }
    return final;
}
const Syntax = [
    new TagSyntax({ search: MetaRegex, Form: () => (null) }),
    new TagSyntax({ search: /!(?:\[(.+)\])?\((.+)\)/, Form: (match) => {
            const ImageSection = document.createElement('div');
            ImageSection.className = 'image-section';
            const Image = document.createElement('img');
            Image.src = match[2];
            Image.alt = match[1] || '';
            ImageSection.appendChild(Image);
            if (match[1]) {
                const AltText = document.createElement('span');
                AltText.innerHTML = TextToInline(match[1]);
                ImageSection.appendChild(AltText);
            }
            return ImageSection;
        } }),
    new TagSyntax({ search: /(#{1,6}) (.+)/, Form: (match) => {
            PastUlElement = null;
            let level = match[1].length;
            if (level > 7 || level < 1) {
                throw new Error(`Level of Header ${match[2]} is greater than 6 or less than 1. Level : ${level}`);
            }
            const Header = document.createElement(`h${level}`);
            Header.innerHTML = TextToInline(match[2]);
            return Header;
        } }),
    new TagSyntax({ search: /(?:\-|\*) (.+)/, Form: (match) => {
            let GetUL = PastUlElement || document.createElement("ul");
            const ListItem = document.createElement("li");
            ListItem.innerHTML = TextToInline(match[1]);
            GetUL.appendChild(ListItem);
            PastUlElement = GetUL;
            return GetUL;
        } }),
    new TagSyntax({ search: /(.*)/, Form: (match) => {
            const Paragraph = document.createElement("p");
            Paragraph.innerHTML = TextToInline(match[1]);
            return Paragraph;
        } })
];
const InlineSyntax = [
    new InlineTag({ search: /(?:\[(.+)\])?\((.+)\)/g, Form: (_, g1, g2) => {
            return `<a href="${g2}">${g1 || g2}</a>`;
        } }),
    new InlineTag({ search: /__(.+?)__/g, Form: (_, g1) => {
            return `<strong>${g1}</strong>`;
        } }),
    new InlineTag({ search: /_(.+?)_/g, Form: (_, g1) => {
            return `<i>${g1}</i>`;
        } })
];
export default Syntax;
