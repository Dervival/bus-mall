'use strict';

//Need to use the DOM to grab access objects on page
//Keep imgElements as a nodelist? Can be accesses with imgElements[0] etc
var imgElements = document.getElementsByClassName('displayItem');
var clickCounter = 0;
var maxClicks = 25;
//number of images to show on the page - will be capped at # of all products later
var imagesShown = 3;
var imgIndices = [];

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


function initializeBusMall(){
  buildProducts();
  //Since we can't show an item two selections in a row, we can only display half of given elements at a time; use min to make sure imagesShown is capped at that limit
  imagesShown = Math.min(imagesShown, Math.floor(Product.allProducts.length/2));
  initializeImageElements();
  initializeIndices();
  randomImages();//seeding the first half of the array...
  randomImages();//pushing the first half to its proper place, seeding the second half
}

function buildProducts(){
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
}

function initializeImageElements(){
  var imageParent = document.getElementsByTagName('main')[0];
  for (let i = 0; i < imagesShown; i++){
    addElement('img','','displayItem',imageParent);
    let newElement = document.getElementsByClassName('displayItem')[i];
    newElement.setAttribute('src', '');
    newElement.setAttribute('alt', '');
  }
}

function initializeIndices(){
  for (let i = 0; i < imagesShown*2; i++){
    imgIndices.push(0);
  }
}
initializeBusMall();

//Set of random, unique indicies need to be generated on click
//Generate them one at a time
function randomIndex(){
  return Math.floor(Math.random() * Product.allProducts.length);
}

//Create an array of 2N indices, where N is the number of products being shown; first half is for objects currently being shown, second half is for objects to be shown next


//Generates new index values for the last half of imgIndices; the first half was generated in the set previously;
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

//Checks to make sure that the index being added isn't already in the array - returns true if it finds a collision, false otherwise
function bIndexCollision(index, values){
  for(let i = 0; i < values.length; i++){
    if(values[i] === index){
      return true;
    }
  }
  return false;
}

//Two step process; move previously generated indices into the "display" half of the array, generates new indices for the "next" half of the array
function updateIndices(){
  for(let i = 0; i < imagesShown; i++){
    imgIndices[i] = imgIndices[i+imagesShown];
  }
  generateNewIndices();
}

//Refreshes the array of indices, pushing the second half of the array into the first half; regenerates the images shown based off of the newly pushed values
function randomImages(){
  updateIndices();
  for (var i = 0; i < imagesShown; i++){
    imgElements[i].src = Product.allProducts[imgIndices[i]].imgSource;
    imgElements[i].alt = Product.allProducts[imgIndices[i]].altText;
    Product.allProducts[imgIndices[i]].numShown++;
  }
}

//event handler - increment the click counter, increment the appropriate numClick counter, either refresh the images (if clicks aren't at max) or swap to results (if they are at or past max)
function imageOnClick(){
  event.stopPropagation();
  let warningNode = document.getElementsByTagName('h2')[0];
  var clickedElement = this;
  if(this.alt){
    clickCounter++;
    for(let i = 0; i < Product.allProducts.length; i++){
      if(Product.allProducts[i].altText === clickedElement.alt){
        Product.allProducts[i].numClicked++;
        break;
      }
    }
    if(clickCounter < maxClicks){
      randomImages();
      warningNode.textContent = 'Choose your favorite of the following';
    }
    else{
      displayResults();
    }
  }
  else{
    warningNode.textContent = 'Please only click on the images.';
  }
}

//Remove all event listeners, delete content of the body of the page, rebuild with list content
function displayResults(){
  let targetNode = document.getElementsByTagName('h2')[0];
  targetNode.textContent = 'The results are in!';
  let bodyElement = document.getElementsByTagName('body')[0];
  bodyElement.removeEventListener('click', imageOnClick);
  targetNode = imgElements[0].parentNode;
  for(var i = imgElements.length; i > 0; i--){
    imgElements[i-1].removeEventListener('click', imageOnClick);
    //imgElements[i-1].parentNode.removeChild(imgElements[i-1]);
  }
  /*addElement('ul','','',targetNode);
  targetNode = document.getElementsByTagName('ul')[0];
  for(var x = 0; x < Product.allProducts.length; x++){
    var liString = Product.allProducts[x].altText + ' was seen ' + Product.allProducts[x].numShown + ' times and clicked ' + Product.allProducts[x].numClicked + ' times.';
    addElement('li', liString, '', targetNode);
  }*/
  drawGraph();
}

//DOM addition from previous lab - modified to add class to elements
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

//event listener for images
for(var i = 0; i < imgElements.length; i++){
  imgElements[i].addEventListener('click', imageOnClick);
}

//event listener for the user not clicking an image
var bodyElement = document.getElementsByTagName('body')[0];
bodyElement.addEventListener('click', imageOnClick);

function drawGraph(){
  var productNames = [];
  var voteData = [];
  var chartColors = [];
  for(let i = 0; i < Product.allProducts.length; i++){
    productNames.push(Product.allProducts[i].altText);
    let clickRatio = 0;
    if(Product.allProducts[i].numShown > 0){
      clickRatio = Product.allProducts[i].numClicked / Product.allProducts[i].numShown;
    }
    voteData.push(Math.floor(clickRatio*100));
    let barColor = [0,0,0];
    for(let i = 0; i < barColor.length; i++){
      barColor[i] = Math.floor(Math.random()*255 + 1);
    }
    chartColors.push(getRandomColor());
  }
  let chartElement = document.getElementById('busMallChart');
  var ctx = chartElement.getContext('2d');
  var chart = new Chart(ctx, {
  // The type of chart we want to create
    type: 'horizontalBar',

    // The data for our dataset
    data: {
      labels: productNames,
      datasets: [{
        label: 'Results: Popularity (by % of votes)',
        backgroundColor: chartColors,
        borderColor: 'rgb(255,255,255)',
        data: voteData,
      }]
    },

    // Configuration options go here
    options: {
      scales: [{
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Products'
          }
        }],
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Percent of times selected when shown'
          }
        }],
      }],
      responsive: true,
      maintainAspectRatio: true,
    }
  });
  chartElement.scrollIntoView();
}

function getRandomColor(){
  let colorArray = [];
  for(let i = 0; i < 3; i++){
    colorArray[i] = Math.floor(Math.random()*255 + 1);
  }
  return `rgb(${colorArray[0]},${colorArray[1]},${colorArray[2]})`;
}
