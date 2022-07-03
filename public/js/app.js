
let username
let socket = io()
do{
    username = prompt('Enter your Name : ')
}while(!username)

const textarea = document.querySelector('textarea')
const submitbtn = document.querySelector('#submitBtn')

const commentbox = document.querySelector('.comment_box')

submitbtn.addEventListener('click' , (e)=>{
    e.preventDefault()
    let comment = textarea.value;

    if(!comment){
        return
    }

    postComment(comment);
})

function postComment(comment){

    let data = {
        username : username,
        comment : comment
    }
    appendToDom(data)
    textarea.value='';

    broadCastComment(data);

    syncWithDb(data)
}

function appendToDom(data){
    let ltag = document.createElement('li')
    ltag.classList.add('comment','mb-3')

    let markup = `
            <div class="card border-light mb-3">
            <div class="card-body">
                <h6>${data.username}</h6>
                <p>${data.comment}</p>
                <div><i class="fa-solid fa-clock"></i></div>
                <small>${moment(data.time).format('LT')}</small>
            </div>
        </div> `

        ltag.innerHTML = markup

        commentbox.prepend(ltag);
}

function broadCastComment(data){

    socket.emit('comment' , data)

}

socket.on('comment' , (data)=>{
    appendToDom(data)
})

let timerid = null
function debounce(func , timer)
{
    if(timerid){
        clearTimeout(timerid)
    }
    timerid = setTimeout(()=>{
        func()
    } , timer) 
}

let typingdiv = document.querySelector('.typing')
socket.on('typing',(data)=>{
    typingdiv.innerHTML = `${data.username} is typing...`
    debounce(function() {
        typingdiv.innerHTML = ``
    } , 1000)
})

textarea.addEventListener('keypress' , ()=>{
    socket.emit('typing', {username})
})

function syncWithDb(data){
    const headers = {
        'Content-Type' : 'application/json'
    }
    fetch('/api/comments' , { method : 'Post' , body : JSON.stringify(data) , headers})
      .then(response => response.json())
      .then(result => {
        console.log(result)
      })
}

function fetchComments()
{
    fetch('/api/comments')
        .then(res => res.json())
        .then(result => 
            {
            result.forEach((comment) => {
                comment.time = comment.createdAt
                appendToDom(comment)
            });
            console.log(result)
        })
}

window.onload = fetchComments
