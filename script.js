'use strict'

const products = document.querySelectorAll('.product');
const basketOne = document.querySelector('.basket-one');
const basketTwo = document.querySelector('.basket-two');
const basketThree = document.querySelector('.basket-three');
const btnPay = document.querySelector('.btn-pay');
const basket = document.querySelector('.basket');
const produktsInBasket = {
  basketOne: ['wine', 'milk', 'cake', 'chese'],
  basketTwo: ['beef', 'checken', 'cheeps'],
  basketThree: ['pineapple', 'banana', 'aple', 'salad']
}

let currentDraggedElement;
let touchStartX;
let touchStartY;
let elementOffsetX = 0;
let elementOffsetY = 0;

products.forEach(function (elem) {
  elem.addEventListener('dragstart', function (e) {
    currentDraggedElement = this;
  });

  elem.addEventListener('touchstart', handleTouchStart, false);
  elem.addEventListener('touchmove', handleTouchMove, false);
  elem.addEventListener('touchend', handleTouchEnd, false);
});

// Восстанавливаем обработчик drop события
basket.addEventListener('drop', function (e) {
  if (!currentDraggedElement) return;
  let productName = currentDraggedElement.className.split(' ')[1];

  updateBasket(produktsInBasket.basketOne, basketOne, productName);
  updateBasket(produktsInBasket.basketTwo, basketTwo, productName);
  updateBasket(produktsInBasket.basketThree, basketThree, productName);
});

basket.addEventListener('dragover', function (e) {
  e.preventDefault();
});

// Touch события
function handleTouchStart(e) {
  touchStartX = e.touches[0].clientX - elementOffsetX;
  touchStartY = e.touches[0].clientY - elementOffsetY;
  
  if (e.target.classList.contains('product')) {
    currentDraggedElement = e.target;
    currentDraggedElement.style.position = 'absolute';
    currentDraggedElement.style.zIndex = '1000';
  }
}

function handleTouchMove(e) {
  if (!currentDraggedElement) return;
  
  e.preventDefault();
  
  const currentTouchX = e.touches[0].clientX - touchStartX;
  const currentTouchY = e.touches[0].clientY - touchStartY;

  elementOffsetX = currentTouchX;
  elementOffsetY = currentTouchY;

  moveElement(currentTouchX, currentTouchY, currentDraggedElement);
}

function handleTouchEnd(e) {
  if (!currentDraggedElement) return;

  const basketRect = basket.getBoundingClientRect();
  const productRect = currentDraggedElement.getBoundingClientRect();

  if (isOverlapping(productRect, basketRect)) {
    let productName = currentDraggedElement.className.split(' ')[1];
    
    updateBasket(produktsInBasket.basketOne, basketOne, productName);
    updateBasket(produktsInBasket.basketTwo, basketTwo, productName);
    updateBasket(produktsInBasket.basketThree, basketThree, productName);
  } else {
    currentDraggedElement.style.transform = '';
    currentDraggedElement.style.position = '';
  }

  elementOffsetX = 0;
  elementOffsetY = 0;
  currentDraggedElement = null;
}

function moveElement(x, y, element) {
  element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
}

function isOverlapping(rect1, rect2) {
  return !(rect1.right < rect2.left || 
           rect1.left > rect2.right || 
           rect1.bottom < rect2.top || 
           rect1.top > rect2.bottom);
}

let count = 0;
let zIndex = 1;

function updateBasket(produktsInBasket, basket, productName) {
  if (produktsInBasket.includes(productName)) {
    basket.appendChild(currentDraggedElement);
    basket.style = `z-index: ${zIndex++}`;
    currentDraggedElement.style.position = '';
    currentDraggedElement.style.transform = '';
    count += 1;
    if (count >= 3) {
      btnPay.classList.add('btn-pay-visible');
    }
  }
}

btnPay.addEventListener('click', () => {
  window.location.href = 'https://lavka.yandex.ru/';
});

function togglePulse() {
  btnPay.classList.toggle('pulsate');
}

setInterval(togglePulse, 2000);