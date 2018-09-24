'use strict';


//Need to use the DOM to grab access objects on page
//Keep imgElements as a nodelist? Can be accesses with imgElements[0] etc
var imgElements = document.getElementsByClassName('displayItem');
var clickCounter = 0;
var maxClicks = 25;

//Needs a Product object
//Product object needs path to image, alt text, maybe Id?
//Product object also needs properties for numbers of times clicked and numbers of times shown
function Product(filepath, displayText){
  //use displayText as alt text for now
  this.imgSource = filepath;
  this.altText = displayText;

  this.numShown = 0;
  this.numClicked = 0;
  Product.allProducts.push(this);
}
//product objects needs to be stored in an array
Product.allProducts = [];

//Generate Product objects for each item
//Probably a better way to do this with looping through a directory...
new Product('img/bag.jpg','bag');
new Product('img/banana.jpg','banana');
new Product('img/bathroom.jpg','bathroom');
new Product('img/boots.jpg','boots');
new Product('img/breakfast.jpg','breakfast');
new Product('img/bubblegum.jpg','bubblegum');
new Product('img/chair.jpg','chair');
new Product('img/cthulhu.jpg','cthulhu');
new Product('img/dog-duck.jpg','dog-duck');
new Product('img/dragon.jpg','dragon');
new Product('img/pen.jpg','pen');
new Product('img/pet-sweep.jpg','pet-sweep');
new Product('img/scissors.jpg','scissors');
new Product('img/shark.jpg','shark');
new Product('img/sweep.png','sweep');
new Product('img/tauntaun.jpg','tauntaun');
new Product('img/unicorn.jpg','unicorn');
new Product('img/usb.gif','usb');
new Product('img/water-can.jpg','water-can');
new Product('img/wine-glass.jpg','wine-glass');

var imagesShown = 3; //number of images to show on the page
//Since we can't show an item two selections in a row, we can only display half of given elements at a time; use min to make sure imagesShown is capped at that limit
imagesShown = Math.min(imagesShown, Math.floor(Product.allProducts.length/2));
var imageParent = document.getElementsByTagName('main')[0];
for (let i = 0; i < imagesShown; i++){
  addElement('img','','displayItem',imageParent);
  let newElement = document.getElementsByClassName('displayItem')[i];
  newElement.setAttribute('src', '');
  newElement.setAttribute('alt', '');
}

/*console.log(Product.allProducts.length + ' objects created:');
for(let i = 0; i < Product.allProducts.length; i++){
  console.log(Product.allProducts[i]);
}*/

//Set of random, unique indicies need to be generated on click
//Generate them one at a time
function randomIndex(){
  return Math.floor(Math.random() * Product.allProducts.length);
}

//Create an array of 2N indices, where N is the number of products being shown; first half is for objects currently being shown, second half is for objects to be shown next

function generateNewIndices(){
  for(let i = 0; i < imgElements.length; i++){
    let newIndex = randomIndex();
    //do some validation for unique indicies here
    while(bIndexCollision(newIndex, imgIndices)){
      newIndex = randomIndex();
    }
    imgIndices[(i+ imagesShown)] = newIndex;
  }
}

function bIndexCollision(index, values){
  for(let i = 0; i < values.length; i++){
    if(values[i] === index){
      return true;
    }
  }
  return false;
}

function updateIndices(){
  for(let i = 0; i < imagesShown; i++){
    imgIndices[i] = imgIndices[i+imagesShown];
  }
  generateNewIndices();
}
var imgIndices = [];

for (let i = 0; i < imagesShown*2; i++){
  imgIndices.push(0);
}

function randomImages(){
  updateIndices();
  for (var i = 0; i < imagesShown; i++){
    imgElements[i].src = Product.allProducts[imgIndices[i]].imgSource;
    imgElements[i].alt = Product.allProducts[imgIndices[i]].altText;
    Product.allProducts[imgIndices[i]].numShown++;
  }
}

randomImages();//seed the first three images...
randomImages();//and the next three images

//event handler
function imageOnClick(){
  var clickedElement = this;
  clickCounter++;
  console.log('user has clicked ' + clickCounter + ' times.');
  console.log('user clicked on ' + clickedElement.alt);
  for(let i = 0; i < Product.allProducts.length; i++){
    if(Product.allProducts[i].altText === clickedElement.alt){
      Product.allProducts[i].numClicked++;
      console.log(clickedElement.alt + ' has been clicked ' + Product.allProducts[i].numClicked + ' times.');
    }
  }
  if(clickCounter < maxClicks){
    randomImages();
  }
  //After X clicks (X=25 in the final version), kill event listeners and display results
  else{
    displayResults();
  }
}

function displayResults(){
  let targetNode = document.getElementsByTagName('h2')[0];
  targetNode.textContent = 'The results are in!';
  targetNode = imgElements[0].parentNode;
  for(var i = imgElements.length; i > 0; i--){
    imgElements[i-1].removeEventListener('click', imageOnClick);
    imgElements[i-1].parentNode.removeChild(imgElements[i-1]);
  }
  addElement('ul','','',targetNode);
  targetNode = document.getElementsByTagName('ul')[0];
  for(var x = 0; x < Product.allProducts.length; x++){
    var liString = Product.allProducts[x].altText + ' was seen ' + Product.allProducts[x].numShown + ' times and clicked ' + Product.allProducts[x].numClicked + ' times.';
    addElement('li', liString, '', targetNode);
  }
}

//DOM addition from previous lab - modified to add class
function addElement(tag,elementContent,elementClass,parentElement){
  let newElement = document.createElement(tag);
  if(elementContent){
    let newElementContent = document.createTextNode(elementContent);
    newElement.appendChild(newElementContent);
  }
  if(elementClass){
    newElement.classList.add(elementClass);
  }
  parentElement.appendChild(newElement);
  return(newElement);
}

//event listener
for(var i = 0; i < imgElements.length; i++){
  imgElements[i].addEventListener('click', imageOnClick);
}


////On click, move second half of array into first half, then regenerate second half
////Generate second half while checking to make sure indices are not duplicated within the entire array
////When moving items into the first half of the array, increment the "seen" counter
////When item is clicked, increment the clicked counter

//Create an event listener for each product being displayed
//On click, increment the "clicked" counter and regenerate items to be shown

