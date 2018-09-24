'use strict';

var imagesShown = 3; //number of images to show on the page
//Need to use the DOM to grab access objects on page
//Keep imgElements as a nodelist? Can be accesses with imgElements[0] etc
var imgElements = document.getElementsByClassName('displayItem');

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
new Product('img/sweep.jpg','sweep');
new Product('img/tauntaun.jpg','tauntaun');
new Product('img/unicorn.jpg','unicorn');
new Product('img/usb.gif','usb');
new Product('img/water-can.jpg','water-can');
new Product('img/wine-glass.jpg','wine-glass');

/*console.log(Product.allProducts.length + ' objects created:');
for(let i = 0; i < Product.allProducts.length; i++){
  console.log(Product.allProducts[i]);
}*/

//Set of random, unique indicies need to be generated on click
//Generate them one at a time
function randomIndex(){
  return Math.floor(Math.random() * Product.allProducts.length);
}

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
      //console.log('Collision found at index ' + i);
      return true;
    }
  }
  //console.log('No collisions found.');
  return false;
}

function updateIndices(){
  for(let i = 0; i < imagesShown; i++){
    imgIndices[i] = imgIndices[i+imagesShown];
  }
  generateNewIndices();
}
var imgIndices = [-1,-1,-1,-1,-1,-1];

for(var x = 0; x < 20; x++){
  updateIndices();
  console.log(imgIndices);
}

function randomImages(){
  updateIndices();
  imgElements[0].src = Product.allProducts[imgIndices[0]].imgSource;
  imgElements[0].alt = Product.allProducts[imgIndices[0]].altText;
}

randomImages();
/*console.log(imgIndices);
removeCurrentImages();
console.log(imgIndices);
removeCurrentImages();
console.log(imgIndices);
removeCurrentImages();*/

//indices need to also be unique between sets
////Create an array of 2N indices, where N is the number of products being shown; first half is for objects currently being shown, second half is for objects to be shown next
////Make array initially full of nulls?
////On click, move second half of array into first half, then regenerate second half
////Generate second half while checking to make sure indices are not duplicated within the entire array
////When moving items into the first half of the array, increment the "seen" counter
////When item is clicked, increment the clicked counter

//Create an event listener for each product being displayed
//On click, increment the "clicked" counter and regenerate items to be shown

//After X clicks (X=25 in the final version), kill event listeners and display results
