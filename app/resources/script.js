var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
import { BinarySearch } from "./Utility";
import Syntax, { MetaRegex, LineRegex } from "./Syntax";
var ContentDiv = document.querySelector("article > #content"), StubDiv = document.querySelector("#stub"), MainTitle = document.querySelector("article > .main");
console.log(MainTitle);
/**
 * The page data for the article.
 * * Metadata - Containing the title and ect. See {@link PageMetadata}
 */
var PageData = {
    Metadata: {
        title: "Loading...",
        stub: false
    },
    rawContent: "Loading...",
    Content: []
};
/**
 * If the string inside the split array matches then do the function
 * @param Regex Matches the string from the split array
 * @param split An array of strings meaning a different tag
 * @param funct The function to be executed when the Regex matches
 */
function SearchRegExp(Regex, split, funct) {
    BinarySearch(split, function (val) {
        var match = val.trim().match(Regex), doesMatch = match !== null;
        if (!doesMatch) {
            return false;
        }
        funct(match);
        return true;
    });
}
function LoadContent(rawContent) {
    var e_1, _a;
    var Content = [];
    var split = rawContent.split(LineRegex);
    var _loop_1 = function (TagType) {
        SearchRegExp(TagType.search, split, function (match) {
            var FormedElement = TagType.Form(match);
            if (!FormedElement) { //If Formed Element === null, then skip it
                return;
            }
            //Appends FormedElement to Content
            Content = __spreadArray(__spreadArray([], __read(Content), false), [FormedElement], false);
        });
    };
    try {
        for (var Syntax_1 = __values(Syntax), Syntax_1_1 = Syntax_1.next(); !Syntax_1_1.done; Syntax_1_1 = Syntax_1.next()) {
            var TagType = Syntax_1_1.value;
            _loop_1(TagType);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (Syntax_1_1 && !Syntax_1_1.done && (_a = Syntax_1.return)) _a.call(Syntax_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return Content;
}
/**
 * Generates Metadata from rawContent
 * @param rawContent The raw content
 * @returns Metadata
 */
function LoadMeta(rawContent) {
    //Basic Metadata
    var Meta = { title: "Loading...", stub: false };
    //*Splits the lines based on the LineRegex
    var split = rawContent.split(LineRegex);
    SearchRegExp(MetaRegex, split, function (match) {
        //Checks if the tag doesn't have value, the value is true //?eg. {stub}
        var hasValue = match[2] !== undefined, key = match[1];
        Meta[key] = hasValue ? match[2] : true;
    });
    return Meta;
}
/**
 * Loads in page, using the url as input
 */
function LoadPage() {
    var queryString = window.location.search, urlParams = new URLSearchParams(queryString);
    //Sets the fileName to the Page Parameter in the URL 
    var fileName = decodeURIComponent(urlParams.get("page"));
    GeneratingPage(fileName).then(function () {
        //*Loads in the the metadata eg. Title
        PageData.Metadata = LoadMeta(PageData.rawContent);
        //Hides or Show the Stub info card based on the Metadata's stub value
        StubDiv.setAttribute("data-hidden", PageData.Metadata.stub ? "1" : "0");
        //Makes the Title (document and Main Title) to the Metadata title
        document.title = "Wikipedia - ".concat(PageData.Metadata.title);
        MainTitle.innerText = PageData.Metadata.title;
        //*Generates the page using the rawContent
        PageData.Content = LoadContent(PageData.rawContent);
        console.log(PageData.Content);
        PageData.Content.forEach(function (PageElement) {
            //*Loads in the Content to the page
            ContentDiv.appendChild(PageElement);
        });
    });
}
function GeneratingPage(fileName) {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch("http://localhost:8000/get_raw?page=".concat(encodeURIComponent(fileName)))];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.text()];
                case 2:
                    data = _a.sent();
                    PageData.rawContent = data;
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error("Error fetching data: ".concat(error_1));
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
LoadPage();
