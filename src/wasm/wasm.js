export async function loadWasm() {
  const go = new Go();
  const wasm = await WebAssembly.instantiateStreaming(
      fetch('/solidui/main.wasm'),
      go.importObject
  );
  // console.log(go)
  go.run(wasm.instance);
}

const getDefaultGameState = () => {
  // // @ts-ignore
  // const go = new Go();
  // console.log({go})
  // WebAssembly.instantiateStreaming(fetch("src/wasm/main.wasm"), go.importObject).then((result) => {
  //   go.run(result.instance);
  //   console.log(result);
  //   console.log(go);
  // });
  // console.log(111111)
  // init().then((instance) => {
  //   console.log(instance)
  //   return instance.exports
  // })
  // return
  // // WebAssembly.instantiateStreaming(fetch("simple.wasm"), importObject).then(
  // //   (obj) => obj.instance.exports.Test(),
  // // );

  // ------------
//   loadWasm().then(() => {
//     console.log('Wasm loaded');
//     console.log('2 + 3 =', window.add(2, 3));
// });
}



// TOOD
const handleEvent = () => {
  init().then((instance) => {
    console.log(instance)
    // return instance.exports.test()
  })
  return
  // WebAssembly.instantiateStreaming(fetch("simple.wasm"), importObject).then(
  //   (obj) => obj.instance.exports.Test(),
  // );
}

export const gameManager = {
  getDefaultState: getDefaultGameState,
  handleEvent: handleEvent,
}