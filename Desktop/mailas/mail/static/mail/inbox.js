document.addEventListener('DOMContentLoaded', function() {

  
  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#compose-form').addEventListener('submit', send_email);
  

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}



function send_email(event) {
event.preventDefault();
console.log("As esu funkcijoje send_email")

var recipients = document.querySelector('#compose-recipients').value;
var subject = document.querySelector('#compose-subject').value;
var body = document.querySelector('#compose-body').value;

fetch('/emails', {
  method: 'POST',
  body: JSON.stringify({
      recipients:  recipients,
      subject: subject,
      body: body
  })
})
.then(response => response.json())
.then(result => {
  load_mailbox('inbox')
    // Print result
    console.log(result);
  
})}

function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';

  // Show the mailbox name & clear previous child elements
  const view = document.querySelector('#emails-view');
  view.innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;


  fetch('/emails/' + mailbox)
  .then(response => response.json())
  .then(emails => {

    // generate div for each email
    emails.forEach(email => {
      console.log(email)

        let div = document.createElement('div');
        // div.className = email['read'] ? "email-list-item-read" : "email-list-item-unread";
        div.innerHTML = `
            <div class=" row email-box" id="eilute" style="border: 1px solid grey; padding:5px" >
            <div class="sender col-3"> <b>${email['sender']}</b> </div>
            <div class="subject col-6"> ${email['subject']} </div>
            <div class="timestamp col-3"> ${email['timestamp']} </div>
            </div>
        `;

        // add listener and append to DOM

        div.addEventListener('click', () =>load_email(email['id']))
        fetch('/emails/' + email['id'], {
          method: 'PUT',
          body: JSON.stringify({ read : !email['read'] })
        })
        
        console.log(email)
        view.appendChild(div);
        if(!email['read']){

          document.querySelector('#eilute').style.backgroundColor = "grey"};
        
        
  })})}


function load_email(id) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'block';

  // Show the mailbox name & clear previous child elements
  const email_view = document.querySelector('#email-view');
  

  fetch('/emails/' + id)
  .then(response => response.json())
  .then(email => {
        const email_view = document.getElementById ("email-view")
        let mail = document.createElement('div');
        // div.className = email['read'] ? "email-list-item-read" : "email-list-item-unread";
        mail.innerHTML = `
        <div class="card" style="margin: 5px; padding:5px; width: 500px">
        <ul>
            <p> <b>Sender:</b> ${email['sender']} <p>
            <p> <b>Subject </b> ${email['subject']} </p>
            <p> <b>Time </b>${email['timestamp']} </p>
            <hr>
            <p> ${email['body']} </p>
            
            </ul>
            </div>
        `;

        email_view.appendChild(mail);
      //archive
        let archiveButton = document.createElement('button');
        archiveButton.className = "btn btn-outline-primary";
        archiveButton.innerHTML = !email['archived'] ? 'Archive' : 'Unarchive';
        archiveButton.addEventListener('click', function() {
          fetch('/emails/' + email['id'], {
            method: 'PUT',
            body: JSON.stringify({ archived : !email['archived'] })
          })
          .then(response => load_mailbox('inbox'))
        });
        email_view.appendChild(archiveButton);

        let replyButton = document.createElement('button');
        replyButton.className = "btn btn-outline-primary";
        replyButton.innerHTML = "Reply"
        replyButton.addEventListener('click', function() {
        document.querySelector('#compose-view').style.display = 'block';
        document.querySelector('#email-view').style.display = 'none';
        var recipients = document.querySelector('#compose-recipients').value =  email["sender"];
        var subject = document.querySelector('#compose-subject').value = email["subject"];
        var body = document.querySelector('#compose-body').value = email["body"];
        
      })
        email_view.appendChild(replyButton)

        
      
  
       
    })};


  
  
      
      





    
      