const todoInput = document.querySelector('#todoInput');
const addTodo = document.querySelector('#addTodo');
const todoList = document.querySelector('#todoList');
const allDel = document.querySelector('#allDel');

todoInput.addEventListener('keydown',()=>{
  if(window.event.keyCode === 13) {
    createTodo()
  }
})

addTodo.addEventListener('click',()=>{
  if(todoInput.value !== '') {
    createTodo()
  }
})

const getLocalData = JSON.parse(localStorage.getItem('todo-list'))
if(getLocalData) {
  for(let i=0; i<getLocalData.length; i++) {
    createTodo(getLocalData[i])
  }
}

function createTodo(localData) {
  let localContent = todoInput.value
  if(localData) {
    localContent = localData.contents
  }
  const newLi = document.createElement('li');
  const newSpan = document.createElement('span');
  const newCheck = document.createElement('input');
  const newBtn = document.createElement('button');

  newCheck.setAttribute('type','checkbox')
  newLi.appendChild(newCheck)
  newLi.appendChild(newSpan)

  newSpan.textContent = localContent

  todoList.appendChild(newLi)


  todoInput.value = ''

  
  newCheck.addEventListener('click',()=>{

    newSpan.classList.toggle('complete')

    saveTodoData()
  })
  newLi.addEventListener('dblclick',()=>{
    newLi.remove()
    saveTodoData()
  })
  if(localData && localData.complete === true){
    newCheck.checked = true
    newSpan.classList.add('complete')
  }
  saveTodoData()
  
}

function saveTodoData(){
  const todoData = [];
  const todoStyle = document.querySelectorAll('#todoList li span')
  for(let i=0; i<todoList.children.length; i++) {
    const objTodo = {
      contents : todoList.children[i].querySelector('span').textContent,
      complete: todoList.children[i].querySelector('span').classList.contains('complete')
    }
    todoData.push(objTodo)
  }
  localStorage.setItem('todo-list', JSON.stringify(todoData));
  if(todoData.length === 0) {
    localStorage.removeItem('todo-list')
  }else {
    localStorage.setItem('todo-list', JSON.stringify(todoData))
  }
}

//list
allDel.addEventListener('click',()=>{
  const liList = document.querySelectorAll('#todoList li')

  for(let i = 0; i<liList.length; i++) {
    liList[i].remove()
  }
  saveTodoData()
})

const times = document.querySelector('.time');
const dateBox = document.createElement('h4')
const timeTextBox = document.createElement('h4')

function getTimes(){
  const date = new Date();
  const years = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2,"0");
  const day = String(date.getDay()).padStart(2,"0");
  const yoilBox = ['일', '월', '화', '수', '목', '금', '토'];
  const yoil = yoilBox[date.getDay()]
  const hours = String(date.getHours()).padStart(2,"0");
  const min = String(date.getMinutes()).padStart(2,"0");
  const sec = String(date.getSeconds()).padStart(2,"0");

  times.appendChild(dateBox);
  times.appendChild(timeTextBox);

  dateBox.innerText = `${years} - ${month} - ${day}(${yoil})  `
  timeTextBox.innerText = `${hours} : ${min} : ${sec}`
}

getTimes()
setInterval(getTimes, 1000)

//weather
const API_KEY = '9caeb487df02c173a7e367baaf2b5f1b'

if(navigator.geolocation) {
  navigator.geolocation.getCurrentPosition((position)=>{
    const lat = position.coords.latitude
    const lon = position.coords.longitude
    console.log(lat, lon)
    
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=kr`

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        const temp = Math.floor(data.main.temp)
        const location = data.name
        const descipt = data.weather[0].description
        const weatherIcon = data.weather[0].icon
        const iconBox = document.querySelector('.weatherIcon')
        const iconUrl = `http://openweathermap.org/img/wn/${weatherIcon}@2x.png`
        iconBox.setAttribute('src', iconUrl)
        
        const weatherLocation = document.querySelector('.weatherLocation')
        weatherLocation.innerHTML = `<h3>${location}</h3>`
        const weatherInfo = document.querySelector('.weatherInfo')
        weatherInfo.innerHTML = `<p>${temp}°C</p><p>${descipt}</p>`
      })

  }, error => {
    console.log(error)
    const weatherErr = document.querySelectorAll('.weatherBox')
    weatherErr.innerHTML = '<p>위치 정보를 받아오는데 실패했습니다.</p>'
  })
} else {
  const weatherErr = document.querySelectorAll('.weatherBox')
    weatherErr.innerHTML = '<p>현재 브라우저에서는 지원히지 않습니다.</p>'
}

