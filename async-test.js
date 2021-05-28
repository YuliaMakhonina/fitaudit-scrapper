function delay(timeout) {
    return new Promise(
      (resolve, reject) => {
        setTimeout(
          () => resolve(),
          timeout
        );
      }
    );
}

(async () => {
    for (let i = 0; i < 10 ; i++) {
        console.log('before dealy', i);
        await delay(1000);
        console.log('do something after delay', i)
    }
})();


for (const elem of [1,2,3,4]) {
    
}