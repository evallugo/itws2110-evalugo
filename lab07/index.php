<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title> Spooky Web Sys UI </title>
<link href="https://fonts.googleapis.com/css2?family=Creepster&display=swap" rel="stylesheet">
<style>

body {
    margin: 0;
    height: 100vh; 
    display: flex;
    color: #f4f4f4;
    font-family: 'Creepster', cursive;
}

.sidebar {
    width: 25%; 
    background-color: #1a1a1a;
    border-right: 2px solid #ff6600;
    align-items: center;
    text-align: center;
}

.content{
    flex-grow: 1;
    padding: 2rem;
    background: #0b0b0b;
    text-align: center;
}

h2, h3{
    color: #ff6600;
    text-shadow: 0 0 9px #ff6600;
}

button{
    background-color: #ff6600;
    border: none;
    color: white;
    padding: 0.5rem 1rem;
    cursor: pointer;
    margin-bottom: 1rem;
    font-family: 'Creepster', cursive;
    font-size: 1.1rem;
    transition: background-color 0.2s;
}

button:hover{
    background-color: #cc5200;
}

.item{
    margin: 0.4rem 0;
    cursor: pointer;
    transition: color 0.2s;
}

.item:hover{
    color: #ff6600;
    text-shadow: 0 0 6px #ff6600;
}

#desc {
    font-family: "Trebuchet MS", sans-serif;
    line-height: 1.6; 
    margin-top: 1rem;
}


</style>
</head>
<body>
  <div class="sidebar">
    <h2 style="align-content: top;">🕸️ Course Contents 🕸️</h2>
    <button onclick="loadContent()">Refresh 🧟‍♂️</button>
    <div id="nav">Loading...</div>
  </div>

  <div class="content">
    <h2 id="title">🎃 Select a Lecture or Lab 🎃</h2>
    <p id="desc">Your lab or lecture description can be seen here...</p>
  </div>

<script>
async function loadContent() {
  const nav = document.getElementById('nav');
  nav.innerHTML = 'Loading...';
  try {
    const res = await fetch('get_course.php');
    const data = await res.json();
    nav.innerHTML = '';

    if (!data.Websys_course) {
      nav.innerHTML = '<p>👻 No course data found!</p>';
      return;
    }

    const course = data.Websys_course;
    if (!data || !data.Websys_course) {
        nav.innerHTML = '<p>👻 No course data found!</p>';
        return;
    }
    for (const section in course) {
      const header = document.createElement('h3');
      header.textContent = section;
      nav.appendChild(header);

      const items = course[section];
      for (const key in items) {
        const div = document.createElement('div');
        div.textContent = items[key].Title;
        div.className = 'item';
        div.onclick = () => showContent(items[key]);
        nav.appendChild(div);
      }
    }
  } catch (err) {
    nav.innerHTML = '<p style="color:red;">💀 Error loading data.</p>';
    console.error(err);
  }
}

function showContent(item) {
  document.getElementById('title').textContent = item.Title;
  document.getElementById('desc').textContent = item.Description;
}

//auto-load when page opens
loadContent();
</script>
</body>
</html>
