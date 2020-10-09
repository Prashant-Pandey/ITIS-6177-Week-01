exports.sanitizer = {
    value: (word, type) => {
        let convert_corret_type;
        switch (type) {
            case 'int':
                convert_corret_type = parseInt(word);
                break;
            case 'string':
                if (word === null||word===undefined) {
                    convert_corret_type = null;
                }else{
                    convert_corret_type = `${word}`
                }
                
                break;
            default:
                convert_corret_type = word
                break;
        }

        return convert_corret_type;
    }
}