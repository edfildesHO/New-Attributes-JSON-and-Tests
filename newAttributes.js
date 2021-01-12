const _ = require('lodash');
const readline = require('readline');

let results = ""

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

   
rl.question('\nPlease paste in the attributes list...\n\n', attributes => {
    results += " " + attributes
    rl.on('line', function(line) {
        if(line=== "***"){
            next()
        }
        else{
            results += " " + line
        }
    });
});

function next(){
    results = results.match(/\w+.[\w_\[\]\*.]+/g)
    function askQuestion(results){
        rl.question('\nOutput (json) or (tests) | or (exit) ?\n\n', answer => {
            if(answer === "json"){
                console.log("\n\n\n")
                outputJson(results)
                console.log("\n\n\n")
            }
            else if(answer =="tests"){
                console.log("\n\n\n")
                outputTests(results)
                console.log("\n\n\n")
            }
            else if(answer =="exit"){
                rl.close()
                return
            }
            else console.log("\nplease choose either 'json', 'tests' or 'exit") 
            askQuestion(results)
        });
    }
    askQuestion(results)
}



function outputJson(results){

    results = results.map(val=> val.replaceAll('[*]', '[0]'))
    let object = {}

    results.forEach(val => {

        if(val.match(/.is_[\w_]+$/)){
            _.set(object, val, true)
        }
        else _.set(object, val, '')
        
    })

    let output = JSON.stringify(object, null, '  ')
    console.log(output)

}

function outputTests(results){

    results = results.map(val=> val.replaceAll('[*]', '.[0]'))
    results = results.map((val) => {

        if(val.match(/.is_[\w_]+$/)){
            return `assertThat(JsonPath.read(expectedJsonResponse, "$.${val}"), is(true));`
        }
        else return `assertThat(JsonPath.read(expectedJsonResponse, "$.${val}"), is(""));` 

    })

    results = _.uniq(results)

    results.forEach(val => {
        console.log(val)
    })

}



