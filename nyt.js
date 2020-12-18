const baseURL = 'https://api.nytimes.com/svc/search/v2/articlesearch.json'; //required API endpoint for the New York Times data.
const key = 'xnBfIPDXGP1JNQWcEGp0f5x1D6OjT4Jf'; //lets NYT know who is using their APIs
let url; //will see later how we use it to make a dynamix search url

// Next, we'll set up variables that reference all the DOM elements that we'll be manipulating:

//SEARCH FORM //querySelector returns the first element within the document that matched the specified selector group or group of selectors
const searchTerm = document.querySelector('.search'); 
const startDate = document.querySelector('.start-date'); 
const endDate = document.querySelector('.end-date'); 
const searchForm = document.querySelector('form'); 
const submitBtn = document.querySelector('.submit'); 

//RESULTS NAVIGATION
const nextBtn = document.querySelector('.next'); 
const previousBtn = document.querySelector('.prev'); 
const nav = document.querySelector('nav'); 

let pageNumber = 0; 
console.log('PageNumber', pageNumber); 

//RESULTS SECTION 
const section = document.querySelector('section'); 

//NAV VARIABLE 
nav.style.display = "none"; 

/* EVENT LISTENERS
    DOM is listening for all kinds of 'events' -- sent to notify code of interesting things that have taken place 
    each event is represented by an object which is based on the 'Event' interface, and may have additional custom fields and/or functions used to get additional information about what happened. Events can represent everything from basic user interactions to automated notifications of things happening in the rendering model
        
        Resource Events
            https://developer.mozilla.org/en-US/docs/Web/Events

    'target.addEventLister()' helps us identify a target and then add an event listener on that target. Event targets can be an element, the document object, the window object, or any other object that supports events
*/

// target is first part, function is second part, parameters is third part
searchForm.addEventListener('submit',fetchResults);
nextBtn.addEventListener('click', nextPage);
previousBtn.addEventListener('click',nextPage);

//'stubbing-out a function' --means you'll only write enough to show that the function was called, leaving the details for later when you have more time.
function fetchResults(e){ //1
    e.preventDefault(); // 1.1 -- we add the preventDefault method to make sure that a request isn't actually sent. In other words, even though we tell our code to submit the data, we don't actually want data to be submitted anywhere. This isn't a form where we are signing up for something or filling out data to be saved in a database. That is the default nature of a form element: to submit data, to send a POST request

    //instead, we want to get data. We are using a form to construct our GET request. We are using the form to gather the data for that request.
    console.log(e); //2

    //ACCESSING API & ASSEMBLING FULL URL
    url = baseURL + '?api-key=' + key + '&page=' + pageNumber + '&q=' + searchTerm.value; //3 
    // the url is given to fetch as a parameter, which sends the request to the url. -- the strings are anticipating you are going to have a value and then it will come after that
    console.log("URL:", url);

    // CONDITIONAL STATEMENTS FOR OUR END DATE AND START DATE
    if(startDate.value !== '') {
        console.log(startDate.value)
        url += '&begin_date' + startDate.value;
    };

    if(endDate.value !== '') {
        url += '&end_date' +endDate.value;
    };

    fetch(url)
        .then(function(result) {
            console.log(result)
            return result.json(); // meanwhile it creates a promise containing a result object. This is our response. Remember that we use promises when we have asynchronous, long-running operations. The fetch gets the network resource, which might take a long time to resolve. It will convert the response into a json object by returning the results.json function
        }) .then(function(json) {
            displayResults(json); // that json object is used in another promise(set off by the second .then) to send the information received to another function. For now, we'll use console.log(json) to see the json data.
        });
        }

         

    // in this chunk of code, we are checking to see if the section element has any child elements. If the 'section.firstChild' is true, then we call 'removeChild' on the 'section' variable, which targets the 'section' element in the 'html' file. This simply will clear out any child elements that are in the 'section'
    
    // function displayResults(json) {
    //     console.log(json.response.docs);
    // }

    // function displayResults(json) {
    //     let articles = json.response.docs;
    function displayResults(json) {
        while (section.firstChild){
            section.removeChild(section.firstChild);
        }
        let articles = json.response.docs;

        if(articles.length === 0) { 
            console.log("No results");
        } else {
            for(let i = 0; i < articles.length; i++) {
                let article = document.createElement('article'); //1
                let heading = document.createElement('h2'); //2
                let link = document.createElement('a'); //5
                let img = document.createElement('img'); //20
                let para = document.createElement('p'); //11
                let clearfix = document.createElement('div'); //12

                let current = articles[i]; //6
                console.log("Current:", current); //7

                link.href = current.web_url; //8
                link.textContent = current.headline.main; //9

                para.textContent = 'Keywords: ';  //13

                for(let j = 0; j < current.keywords.length; j++){ //14
                    let span = document.createElement('span'); //15
                    span.textContent += current.keywords[j].value + ' '; //16
                    para.appendChild(span); 
                }

                //21
                if(current.multimedia.length > 0 ){
                    img.src = 'http://www.nytimes.com/' + current.multimedia[0].url; //22
                    img.alt = current.headline.main; //23
                }

                clearfix.setAttribute('class','clearfix'); //17

                article.appendChild(heading); //3
                heading.appendChild(link); //10
                article.appendChild(img); //24
                article.appendChild(para); //18
                article.appendChild(clearfix); //19
                section.appendChild(article); //4
            }
        }
        if (articles.length === 10) { //if articles length = 10 we want to display as block
            nav.style.display = 'block';
        } else { //otherwise don't want them to display at all
            nav.style.display = 'none';
        }
    };
//1 -- We create an article variable that will create a node in the DOM that is an 'article' element - Remember that 'article' is an HTML5 element
//2 We also create a 'heading' variable that creates a node in the DOM that is an 'h2' element
//3 We call appendChild() on the article element. This will create a child node on that element. We pass in 'heading' to the appendChild method. This means that there will be an 'h2' element created inside each 'article' element
//4 Since we have a 'section' in our original 'html' file, we call the appendChild() method on the 'section' element. We pass in the article to that. This way, the article is a child of 'section' and the 'h2' is a grandchild of 'section'
//5 We create a 'link' variable that is going to use the 'a' element, the anchor tag which will allow us to createe an 'href' link.
//6 We create a current variable that holds the data of the current article as we iterate. 
//7 We log the current data so that wwe can see it in the console.
//8 Since link is an 'a' element, we need to attach an 'href' property to it. 'current.web_url' grabs the hyperlink for the current article out of the json result. This will set the value for the 'link.href' each time we iterate.
//9 The text that we'll use in 'link.textContent'is set to the value of 'current.headline.main', which is part of the json object from the NYT API. You can see this when you drill down intro the data
//10 Finally, we call the 'appendChild()' method on the heading element again. This will append a link as a child element in the DOM inside of each h2. See the screenshot for orientation:
//11 We've declared a paragraph variable that will later on append a 'div' to the DOM to be used for some of our JSON data.
//12 We're declaring a clearfix variable that will later on append a 'div' to the DOM. More on that later
//13 We are adding the 'textContent' attribute to our para variable. Each result will show this at the start of the 'p' tag that is created by 'para'    
//14 Now we have a 'for loop' inside of our 'for loop'. We are using this nested loop to iterate over the 'current' object, specifically the 'keywwords' array for that object. If you look through the JSON results, you'll see that 'keywords' is a property of the entire object, and it's an array. Here we iterate through the length of the array for the current result object. 
//15 As we iterate, we create a 'span' for each keyword. If you don't already know, a 'span' will be an element that will end when the item ends. So the 'span' of Pizza will start at the P and end at the a. If we were to use a 'p' tag here, it would covere the entirety of the parent objeect. 
//16 The 'textContent' for each 'span' will be the value found inside the keywords array inside the JSON object. 
//17 We append each 'span' to the 'para' node.
//18 Remember we still have an outer loop and printing the results. Here we're using the 'setAttribute' method to target our 'clearfix' class. It's a class in the CSS file. 
//19 We add 'clearfix' and 'para' as children of the article
//20 We add an 'img' variable that will create an image element
//21 We use a conditional to check the JSON for data. There is a multimedia property in the JSON. You should go look for it in the 'json'. If that has anything in it (if the length is greater than 0), then we'll do some stuff in the next steps.
//22 If there is an object, we want to concatenate a string with the url for the html src value. We will add the first item in the multimedia array: 'current.multimedia[0].url. That is all confusing, so it helps here to think about a regular old image tag <img src="">
//23 We need an 'alt' if an image isn't available. We set it to the value of the headline.
//24 We append the image to the article element for each of our items. 

// console.log(url); //4

function nextPage(e) {
    pageNumber++; //6
    fetchResults(e); //7
    //console.log("Next button clicked"); //5
    console.log('Page number:', pageNumber);//8
}

function previousPage(e) {
    if (pageNumber > 0) {
        pageNumber--;
        fetchResults(e);
    } else {
        return;
    }
    fetchResults(e);
    // console.log("Previous button clicked"); //5
    console.log('Page:', pageNumber);
}

//1 -- the little (e) is something in javascript called an event handling function. Every event handling function recieves an event object. For the purpose of this discussion, think of an event object as a 'thing' that holds a bunch of properties(variables) and methods(functions). The handle, the (e) is similar to a variable that allows you to interact with the object
//2 -- We are logging the event object so that you can look at it in the console for learning purposes 
//3 -- We are creating a versatile query string. The 'url' variable is loaded with other variables and url requirements. We have our base for the API, our key, the page number that corresponds to the results array, and our specific value. Something to study on your own might be: '?', '&', and '&q' in a url string? What are those?
//4 -- We log the string so that wew can see it. Later on you can try another search and see how it changes
//5 -- We add in a few basic functions to define 'nextPage' and 'previousPage' and log them. If you leave out this step, your app will get an error
//6 We first increase the value of the 'pageNumber' variable
//7 Wee rerun the 'fetchResults' function
//8 We print the 'pageNumber' variable so that we can see it incremement
// addition -- this section pulls and displays the next page of results from the API