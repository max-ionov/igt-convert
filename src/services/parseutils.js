import eol from "eol";

const readUploadedFileAsText = (inputFile) => {
    const temporaryFileReader = new FileReader();

    return new Promise((resolve, reject) => {
        temporaryFileReader.onerror = () => {
            temporaryFileReader.abort();
            reject(new DOMException("Problem parsing input file."));
        };

        temporaryFileReader.onload = () => {
            resolve(temporaryFileReader.result);
        };
        temporaryFileReader.readAsText(inputFile);
    });
}

const detectFileType = (file) => {
    if (file.mimeType === 'text/plain' || file.name.endsWith('.txt'))
        return 'toolbox'

    if (file.mimeType === 'application/xml' || file.name.endsWith('.flextext'))
        return 'flex'

    return 'unknown'
}

const parseToolbox = (res) => {
    const blankLine = /^\s*$/u
    const toolboxLine = /^\\(?<marker>\S+)\s*(?<data>.*)$/u
    let firstMarker = 'ref'
    let curMarker = null, data = null

    const parsed = {
        type: 'toolbox',
        headers: {},
        entries: [],
    }

    eol.split(res).filter(l => !blankLine.test(l)).forEach((line) => {
        if (line[0] !== '\\' && curMarker !== null) { // lines that don't start with a marker should be glued to the previous one
            parsed.entries.at(-1)[curMarker] += ' ' + line
            return
        }

        ({ marker: curMarker, data: data } = line.match(toolboxLine).groups)

        if (curMarker === firstMarker) // we are at the beginning of a new entry
            parsed.entries.push({})

        if (parsed.entries.length === 0) // we still haven't encountered the first entry
            parsed.headers[curMarker] = data
        else
            // we need to check if this marker has already been encountered in this entry
            parsed.entries.at(-1)[curMarker] = curMarker in parsed.entries.at(-1)
                ? parsed.entries.at(-1)[curMarker] + ' ' + data
                : data
    })

    return parsed
}

// Convert an XPathResult to a proper iterator. Source: https://stackoverflow.com/a/68503000
function xpr2iter (xpr) {
    // Produce a JavaScript iterator for an *ITERATOR_TYPE XPathResult
    // or a JavaScript iterable for a *SNAPSHOT_TYPE XPathResult
    switch (xpr.resultType) {
        case XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE:
        case XPathResult.ORDERED_NODE_SNAPSHOT_TYPE:
            return {
                [Symbol.iterator] () {
                    let i = 0;
                    return {
                        next() {
                            const node = xpr.snapshotItem(i++);
                            return {value: node, done: !node};
                        }
                    };
                },
                at(i) {
                    return xpr.snapshotItem(i) || undefined;
                }
            };
        case XPathResult.UNORDERED_NODE_ITERATOR_TYPE:
        case XPathResult.ORDERED_NODE_ITERATOR_TYPE:
            return {
                next() {
                    const node = xpr.iterateNext();
                    return {value: node, done: !node};
                },
                [Symbol.iterator] () {
                    return this;
                },
            };
    }
}

const joinNodeList = (nodeList, sep = '', before = '', after = '') => {
    return Array.from(nodeList).map(item => before + item.textContent + after).join(sep)
}

const parseFlex = (res) => {
    const parsed = {
        type: 'flex',
        headers: {},
        entries: [],
    }

    const parser = new DOMParser()
    const doc = parser.parseFromString(res, 'application/xml')

    const entries = doc.evaluate('//phrase', doc, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE)
    for (let node of xpr2iter(entries)) { // process a single entry
        let entry = {
            phrase_segnum: node.querySelector('item[type="segnum"]').textContent,
            phrase_gls: node.lastElementChild.textContent,
            word_txt: [],
            txt: [],
            cf: [],
            gls: []
        }
        for (let word of node.querySelectorAll('words word')) {
            let content = word.querySelector('item[type="punct"]')
            if (content)
                entry.word_txt[entry.word_txt.length - 1] = entry.word_txt.at(-1) + content.textContent // let's just pray that punct never comes before a word
            else {
                entry.word_txt.push(word.querySelector('item[type="txt"]').textContent)
                entry.gls.push(joinNodeList(word.querySelectorAll('morphemes morph item[type="gls"]'),
                    '-', '{', '}')
                    .replaceAll('=-', '=')
                    .replaceAll('-=', '='))
                entry.txt.push(joinNodeList(word.querySelectorAll('morphemes morph item[type="txt"]')))
                entry.cf.push(joinNodeList(word.querySelectorAll('morphemes morph item[type="cf"]')))
            }
        }

        for (let key of ['txt', 'cf', 'gls', 'word_txt'])
            entry[key] = entry[key].join('\t')
        parsed.entries.push(entry)
    }

    return parsed
}

const parseFile = async (file) => {
    const res = await readUploadedFileAsText(file)

    switch (detectFileType(file)) {
        case 'toolbox':
            return parseToolbox(res)
        case 'flex':
            return parseFlex(res)

        default:
            console.log('unknown file type')
    }
}

export { parseFile }