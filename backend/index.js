const prompt = require('prompt-sync')({sigint: true});

// Closures
function createCounter(){
    let count = 0;

    function increment(){
        count++;
        console.log(`Count incremented by ${count}`);
    }

    function getCount(){
        return count;
    }

    return{increment, getCount}
}

var name = prompt("Enter a name");
const counter = createCounter();
counter.increment();
counter.increment();
counter.increment();
console.log(`{name}'s current count is ${counter.getCount()}`);