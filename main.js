let timer = document.querySelector('.timer');
let startButton = document.querySelector('.start');
let pauseButton = document.querySelector('.pause');
let restartButton = document.querySelector('.restart');

let focusTime = document.querySelector('.time-btns select');

let breakButtons = document.querySelectorAll('.time-btn.break');
breakButtons.forEach(button => {
    button.addEventListener('click', () => {

        restart();

        console.log(button.getAttribute('data-time'));

        breakTime = parseInt(button.getAttribute('data-time'));

        let sessionTime = focusTime.value;
        
        workAndRestSwitch(breakTime*60,"focus",sessionTime);
        
    });
});


let remainingTime;
let endTime;
let interval;
let situation = 'focus'; // work or rest
let pause = false;

startButton.disabled = false;
pauseButton.disabled = true;

// progress bar
let progressBar = document.querySelector('.progress');

// notification permission request
if ("Notification" in window) {
    Notification.requestPermission();
}

    timer.innerHTML = `${focusTime.value.toString().padStart(2,'0')}:00`;

    focusTime.addEventListener('change', () => {
        restart();
        timer.innerHTML = `${focusTime.value.toString().padStart(2,'0')}:00`;
    })

//FUNCTIONS

// timer function
startButton.addEventListener('click',()=>{

    startButton.disabled = true;
    pauseButton.disabled = false;

    startButton.classList.add('hidden');
    pauseButton.classList.remove('hidden');


    let sessionTime = focusTime.value;
    let breakTime = (sessionTime / 25 )* 5 ;
    console.log(sessionTime *60);
    console.log(breakTime);

    if (situation === 'focus') {
        workAndRestSwitch(sessionTime*60,"break",breakTime);
    }else if (situation === 'break') {
        workAndRestSwitch(breakTime*60,"focus",sessionTime);
    }

});


// function


function workAndRestSwitch(sessionTime,sit,time) {
    if (!pause) {
        
        endTime = Date.now() + (sessionTime * 1000);

        remainingTime = sessionTime;

    }else{
        
        pause = false;

        endTime = Date.now() + (remainingTime * 1000);
    }
    
    let min = Math.floor(remainingTime / 60 );
    let sec = remainingTime % 60;
    timer.innerHTML = `${min.toString().padStart(2,'0')}:${sec.toString().padStart(2, '0')}`;

    
        interval = setInterval(() => {
            if (remainingTime > 0) {

                remainingTime = Math.round((endTime - Date.now()) / 1000);

                let min = Math.floor(remainingTime / 60 );
                let sec = remainingTime % 60;
                timer.innerHTML = `${min.toString().padStart(2,'0')}:${sec.toString().padStart(2, '0')}`;

                let progress = 240 - ((remainingTime * 240) / sessionTime);

                progressBar.style.setProperty('--progress', `${progress}deg`);

                
            }else if (remainingTime === 0) {
                if (Notification.permission === 'granted') {

                    new Notification('Time is up!', {
                        body: `it's time for ${sit} !`,
                        icon: './imgs/tomatoIcon.png'
                    });
                    
                }

                clearInterval(interval);
                
                situation = sit;
                timer.innerHTML = `${time.toString().padStart(2,'0')}:00`; ;
                pause = false;

                startButton.disabled = false;
                pauseButton.disabled = true;

                startButton.classList.remove('hidden');
                pauseButton.classList.add('hidden');
            }
        }, 1000);


}


pauseButton.addEventListener('click', () =>{

    remainingTime = Math.round((endTime - Date.now()) / 1000);
    clearInterval(interval);
    pause = true;

    startButton.disabled = false;
    pauseButton.disabled = true;

    startButton.classList.remove('hidden');
    pauseButton.classList.add('hidden');
});

restartButton.addEventListener('click', () => {
    restart();
});

function restart() {
    clearInterval(interval);

    timer.innerHTML = '25:00';

    remainingTime = 1500;
    situation = 'focus';
    
    pause = false;

    startButton.disabled = false;
    pauseButton.disabled = true;

    startButton.classList.remove('hidden');
    pauseButton.classList.add('hidden');
}
