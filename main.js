let timer = document.querySelector('.timer');
let startButton = document.querySelector('.start');
let pauseButton = document.querySelector('.pause');
let restartButton = document.querySelector('.restart');

let remainingTime;
let endTime;
let interval;
let situation = 'focus'; // work or rest
let pause = false;

startButton.disabled = false;
pauseButton.disabled = true;


// notification permission request
if ("Notification" in window) {
    Notification.requestPermission();
}

//FUNCTIONS

// timer function
startButton.addEventListener('click',()=>{

    startButton.disabled = true;
    pauseButton.disabled = false;

    startButton.classList.add('hidden');
    pauseButton.classList.remove('hidden');

    if (situation === 'focus') {

        workAndRestSwitch(1500,"break",'05:00');

    }
    else if (situation === 'break') {

        workAndRestSwitch(300,"focus",'25:00');
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
                
            }else if (remainingTime === 0) {
                if (Notification.permission === 'granted') {

                    new Notification('Time is up!', {
                        body: `it's time for ${sit} !`,
                        icon: './imgs/tomatoIcon.png'
                    });
                    
                }

                clearInterval(interval);
                
                situation = sit;
                timer.innerHTML = time;
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

    clearInterval(interval);

    timer.innerHTML = '25:00';

    remainingTime = 1500;
    situation = 'focus';
    
    pause = false;

    startButton.disabled = false;
    pauseButton.disabled = true;

    startButton.classList.remove('hidden');
    pauseButton.classList.add('hidden');
});
