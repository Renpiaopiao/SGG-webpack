import count from './js/count'
import sum from './js/sum'
import './css/index.css'
import './less/index.less'
import './sass/index.sass'
import './css/iconfont.css'

import 'core-js'

// let a = 1
console.log(count(5,6));
console.log(sum(1,2,3,4));

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) => {
          console.log("SW registered: ", registration);
        })
        .catch((registrationError) => {
          console.log("SW registration failed: ", registrationError);
        });
    });
  }