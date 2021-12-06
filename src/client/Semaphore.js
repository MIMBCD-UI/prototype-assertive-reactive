// CODE FROM: https://gist.github.com/Gericop/e33be1f201cf242197d9c4d0a1fa7335

function Semaphore(max) {
  var counter = 0;
  var waiting = [];
  
  var take = function() {
    if (waiting.length > 0 && counter < max){
      counter++;
      let promise = waiting.shift();
      promise.resolve();
    }
  }
  
  this.acquire = function() {
    if(counter < max) {
      counter++
      return new Promise(resolve => {
      resolve();
    });
    } else {
      return new Promise((resolve, err) => {
        waiting.push({resolve: resolve, err: err});
      });
    }
  }
    
  this.release = function() {
   counter--;
   take();
  }
  
  this.purge = function() {
    let unresolved = waiting.length;
  
    for (let i = 0; i < unresolved; i++) {
      waiting[i].err('Task has been purged.');
    }
  
    counter = 0;
    waiting = [];
    
    return unresolved;
  }
}

let sema = new Semaphore(1);

// testing the semaphore
/*
let sema = new Semaphore(2);

async function test(id) {
  console.log('queueing task', id);
  try {
    await sema.acquire();
    console.log('running task', id);
    setTimeout(() => {
    sema.release();
    }, 2000);
  } catch (e) {
    console.error(id, e);
  }
}

test(1);
test(2);
test(3);
test(4);
test(5);

setTimeout(() => {
  test(10);
  test(11);
  test(12);
}, 1500);

setTimeout(() => {
  test(20);
  test(21);
  test(22);
}, 2700);*/

// PURGE TEST
// setTimeout(() => {sema.purge();}, 2200);