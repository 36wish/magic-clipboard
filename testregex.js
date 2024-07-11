function matchText(modifiedText){
const regex = new RegExp("id=[\"']([^\"']+)[\"']", 'g')
const match = regex.exec(modifiedText);
    if (match){
        modifiedText = match[1]
    }
return modifiedText
} 


console.log(matchText('id=hello"'))
console.log(matchText('id="hello"'))
console.log(matchText('<a id="hello">'))