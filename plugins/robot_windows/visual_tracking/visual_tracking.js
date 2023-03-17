import RobotWindow from 'https://cyberbotics.com/wwi/R2023b/RobotWindow.js';

window.robotWindow = new RobotWindow();
const benchmarkName = 'Visual tracking';
let hitRateString;
let hitRate;

const modal = document.querySelector(".modal");
const closeButton = document.querySelector(".close-button");

function toggleModal() {
    modal.classList.toggle("show-modal");
}

function windowOnClick(event) {
    if (event.target === modal) {
        toggleModal();
    }
}

closeButton.addEventListener("click", toggleModal);
window.addEventListener("click", windowOnClick); 

window.robotWindow.receive = function(message, robot) {
  if (message.startsWith('hits:')) {
    const rate = message.substr(5);
    const hitValues = rate.split('/');
    document.getElementById('hits-display').innerHTML = zeroFilledInteger(hitValues[0], 3);
    document.getElementById('frames-display').innerHTML = zeroFilledInteger(hitValues[1], 3);
    hitRate = hitValues[0] / hitValues[1];
    hitRateString = (100 * hitRate).toFixed(2);
    document.getElementById('rate-display').innerHTML = hitRateString;
  } else if (message.startsWith('setup:')) {
    const setup = message.substr(6);
    const values = setup.split(';');
    document.getElementById('frame-step-display').innerHTML = values[1];
  } else if (message.startsWith('stop:')) {
    const benchmarkPerformance = message.substr(5);
    document.getElementById('rate-display').innerText = benchmarkPerformance;
    document.getElementById('rate-display').style.color = 'green';
    document.getElementById('rate-display').style.fontWeight = 'bold';
    document.querySelector(".text").innerHTML = `
      <h2>${benchmarkName} complete</h2>
      <h3>Congratulations you finished the benchmark!</h3>
      <p>Your current performance is: <b style="color:green;">${benchmarkPerformance}%</b></p>
      <p>If you want to submit your controller to the leaderboard, follow the instructions given by the "Register" button on the benchmark page.</p>
    `
    toggleModal()
  } else
    console.log("Received unknown message for robot '" + robot + "': '" + message + "'");

  function zeroFilledInteger(x, width) {
    return (new Array(width).join('0') + x).substr(-width);
  }
};

window.addEventListener('load', (event) => {
  if (document.readyState === 'complete' && navigator.userAgent.indexOf('Chrome') > -1) {
    // use MathJax to correctly render MathML not natively supported by Chrome
    let script = document.createElement('script');
    script.setAttribute('type','text/javascript');
    script.setAttribute('id','MathJax-script');
    script.setAttribute('async','');
    script.setAttribute('src','https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js');
    document.head.appendChild(script);
  }
});
