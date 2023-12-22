/**
 * The RegExp to detect Meta Tags.
 * @example "{title:Hello World}" or "{stub}"
 */
export var MetaRegex = /{([\w ]+)(?::([\w ]+))?}/, 
/**
 * The RegExp to detect new lines.
 *
 * {@link https://github.com/Blockitifluy/Wikipedia/ See the repository here for more infomation}
 * @example "Hello World○"
 */
LineRegex = /○/g;
/**
 * If passes the {@link TagSyntax.search search}, then turns into a HTML Element (or Null if isn't displayed).
 *
 * @see {@link Syntax Page Syntax}
 */
var TagSyntax = /** @class */ (function () {
    /**
     * @param search see {@link TagSyntax.search}
     * @param Form see {@link TagSyntax.Form} and {@link FormSyntax}
     */
    function TagSyntax(_a) {
        var search = _a.search, Form = _a.Form;
        this.search = search;
        this.Form = Form;
    }
    return TagSyntax;
}());
export { TagSyntax };
/**
 * The order of {@link TagSyntax} should be executed
 */
var Syntax = [
    new TagSyntax({ search: MetaRegex, Form: function () { return (null); } }), //Meta Tags
    new TagSyntax({ search: /(#{1,6}) (.+)/, Form: function (match) {
            //*The length of the Hashtags (#) infer the level of the header
            var level = match[1].length;
            if (level > 6 || level > 1) { //!Throws error when level isn't between 1 - 6
                throw new Error("Level of Header ".concat(match[2], " is greater than 6 or less than 1. Level : ").concat(level));
            }
            //Creates Header based on the level varibale
            var Header = document.createElement("h".concat(level));
            Header.innerText = match[2]; //Match two is the text
            return Header;
        } }),
    new TagSyntax({ search: /(.+)/, Form: function (match) {
            var Paragraph = document.createElement("p");
            Paragraph.innerText = match[1]; //Match one is just text
            return Paragraph;
        } })
];
export default Syntax;
