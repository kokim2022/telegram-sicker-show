import { useEffect, useState } from 'react';
import { ungzip } from "pako";
import { Player, Controls } from '@lottiefiles/react-lottie-player';

function App() {
  const [lottieJson, setLottieJson] = useState()
  const [tgsUrl, setTgsUrl] = useState('https://cdn.chatapi.net/stickers/telegram/1c49672ec5dbeef5cfd517996acf2bac/file_10.tgs')

  useEffect(() => {
    fetch(tgsUrl)
      .then(response => response.arrayBuffer())
      .then(buffer => {
        if (buffer instanceof ArrayBuffer) {
          const data = new TextDecoder("utf-8").decode(ungzip(buffer));
          const lottieJsonData = JSON.parse(data);
          setLottieJson(lottieJsonData)
          console.log('lottieJsonData', lottieJsonData)
        }
      })
      .catch(error => console.error('Error fetching or parsing .tgs file:', error));
  }, [tgsUrl])

  const handletgsUrlChange = (event) => {
    setTgsUrl(event.target.value)
  }

  return (
    <div className="flex flex-col items-center  justify-center h-screen space-y-5">
      <div className='text-2xl text-italic'>Welcome To Telegram Sickers' Show</div>
      <Player
        autoplay
        loop
        src={lottieJson}
        style={{ height: '300px', width: '300px' }}
      >
        <Controls visible={true} buttons={['play', 'repeat', 'frame', 'debug']} />
      </Player>
      <div className='w-3/4 space-y-3'>
        <label htmlFor="tgstgsUrl">Please insert your tgs tgsUrl below:</label>
        <input type="text" autoFocus id="tgstgsUrl" value={tgsUrl} onChange={handletgsUrlChange} placeholder="Enter TGS file tgsUrl" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
      </div>
    </div>
  );
}

export default App;