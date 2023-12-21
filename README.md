# Wikipedia

> [!IMPORTANT]
> To run the server you need Python 3.11 or above Can be installed by the **Mircosoft Store** using the Windows OS.

A more modern version of Wikipedia.

Colour scheme link: [Coolors](https://coolors.co/606c38-283618-fefae0-dda15e-bc6c25)

## List of Server Imports

> [!IMPORTANT]
> You need to install these Imports using pip, if not available.

* *os*
* *mimetypes*
* *http*
* *re*

## Page Syntax

> [!TIP]
> All special characters (eg. #, {}, *, -, <>, \\) can be escaped by using an `\`

* Meta Tags are formed by `{key: value}` or `{set}` ; An example of Meta Tags are
  * `{title: foo}`: Sets the title to `foo`
  * `{stub}`: Adds an stub header
* Headers Tags are formed by `# Hello World` (The hashtag is the level of the header eg. 1) [^1]
* Bullet point Tags are formed by `* Hello World`, `- Hello World` add a *tab* to indecate the level
* Link tags are formed by `[Name](Link Here)`[^2]
* Image tags are formed by `![alt](Link to Picture Here)`[^2]
* Paragraphs are just plain text: `Hello World`

### Inlines

* Inline Links `<[Name](Link)>` [^2]

[^1]: Levels only range to 1 to 6, if not in the range it will throw an error
[^2]: Can the `[]` and `()`'s positions are interchangable, and `[]` can be removed
