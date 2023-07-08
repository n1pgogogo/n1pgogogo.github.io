class SimpleTokenizer {
    constructor(vocab) {
        if (!Array.isArray(vocab)) {
            throw new Error("Expected 'vocab' to be an array.");
        }
        this.vocab = vocab;
        this.invVocab = {};

        // Generate reverse dictionary
        for (let i = 0; i < vocab.length; i++) {
            this.invVocab[vocab[i]] = i;
        }
    }

    tokenize(text) {
        if (typeof text !== 'string') {
            throw new Error("Expected 'text' to be a string.");
        }
        // Simplified WordPiece tokenization method
        let tokens = [];
        let start = 0;
        while (start < text.length) {
            let end = text.length;
            let curStr = "";
            while (start < end) {
                let subStr = text.slice(start, end);
                if (this.invVocab.hasOwnProperty(subStr)) {
                    curStr = subStr;
                    break;
                }
                end--;
            }
            if (curStr !== "") {
                tokens.push(curStr);
                start += curStr.length;
            } else {
                // handle unknown character
                tokens.push(text[start]);
                start += 1;
            }
        }
        return tokens;
    }

    convertTokensToIds(tokens) {
        if (!Array.isArray(tokens)) {
            throw new Error("Expected 'tokens' to be an array.");
        }
        return tokens.map(token => this.invVocab[token] !== undefined ? this.invVocab[token] : 0);
    }

    convertIdsToTokens(ids) {
        if (!Array.isArray(ids)) {
            throw new Error("Expected 'ids' to be an array.");
        }
        return ids.map(id => this.vocab[id]);
    }

    encode(text, maxLen) {
        if (typeof text !== 'string' || typeof maxLen !== 'number') {
            throw new Error("Expected 'text' to be a string and 'maxLen' to be a number.");
        }
        let tokens = ['[CLS]', ...this.tokenize(text), '[SEP]'];

        // If text length exceeds max length, truncate it
        if (tokens.length > maxLen) {
            const headLen = Math.floor(maxLen / 2);
            const tailLen = maxLen - headLen;

            const headTokens = tokens.slice(0, headLen);
            const tailTokens = tokens.slice(tokens.length - tailLen);

            tokens = [...headTokens, ...tailTokens];
        }

        const inputIds = tokens.map(token => {
            if (this.invVocab[token] !== undefined) {
                return BigInt(this.invVocab[token]);
            } else {
                return BigInt(101);  // Use 0 for tokens not in vocab
            }
        });

        const segmentIds = new Array(tokens.length).fill(BigInt(0));
        const positionIds = Array.from({ length: tokens.length }, (_, i) => BigInt(i));
        const attentionMask = new Array(tokens.length).fill(BigInt(1));

        // Padding
        while (inputIds.length < maxLen) {
            inputIds.push(BigInt(0));
            segmentIds.push(BigInt(0));
            positionIds.push(BigInt(0));
            attentionMask.push(BigInt(0));
        }

        return {
            inputIds,
            segmentIds,
            positionIds,
            attentionMask,
        };
    }

    static async fromVocabFile(vocabs) {
        if (!Array.isArray(vocabs)) {
            throw new Error("Expected 'vocabs' to be an array.");
        }
        return new SimpleTokenizer(vocabs);
    }
}

export default SimpleTokenizer;
