const text = [
  "Initializing portfolio...",
  "Installing skills...",
  "Starting Docker containers...",
  "Deploying website...",
  "Ready. Welcome!"
];

let line = 0;
let char = 0;
const speed = 40;
const terminal = document.getElementById("terminalText");

function type() {
  if (line < text.length) {
    if (char < text[line].length) {
      terminal.innerHTML += text[line][char];
      char++;
      setTimeout(type, speed);
    } else {
      terminal.innerHTML += "<br>";
      line++;
      char = 0;
      setTimeout(type, 300);
    }
  }
}

type();

const skills = document.querySelectorAll('#skills-list li');
const progress = document.getElementById('progress');
let skillIndex = 0;

function installSkills() {
  if (skillIndex <= skills.length) {
    progress.style.width = (skillIndex / skills.length) * 100 + '%';
    skillIndex++;
    setTimeout(installSkills, 300);
  }
}

installSkills();
