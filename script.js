const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

walkDir('e:\\Dell\\Documents\\GetPro\\app\\pages', function(filePath) {
    if (filePath.endsWith('.vue')) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // We want to wrap or prepend <SkeltonTable v-if="loading" :headers="headers" />
        // before <TablesAppTable
        if (content.includes('<TablesAppTable') && !content.includes('<SkeltonTable')) {
            // we will replace <TablesAppTable with <SkeltonTable v-if="loading" :headers="headers" />\n    <TablesAppTable v-else
            let newContent = content.replace(
                /<TablesAppTable/g,
                `<SkeltonTable v-if="loading" :headers="headers" />\n    <TablesAppTable v-else`
            );
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log('Updated:', filePath);
        }
    }
});
