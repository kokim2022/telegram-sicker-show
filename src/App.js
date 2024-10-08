import { useEffect, useState } from 'react';
import { ungzip } from "pako";
import { Player, Controls } from '@lottiefiles/react-lottie-player';

function App() {
  const [lottieJson, setLottieJson] = useState(null);
  const [tgsUrl, setTgsUrl] = useState('https://cdn.chatapi.net/stickers/telegram/1c49672ec5dbeef5cfd517996acf2bac/file_10.tgs');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Predefined TGS URLs
  const predefinedUrls = [
    { label: 'Sticker 3', url: 'https://api.telegram.org/file/bot8187950645:AAG5Q9Wq6sZQUMsphXP3lvM8k-ooKZ11w9Q/stickers/file_3.tgs' },
    { label: 'Sticker 4', url: 'https://api.telegram.org/file/bot8187950645:AAG5Q9Wq6sZQUMsphXP3lvM8k-ooKZ11w9Q/stickers/file_4.tgs' },
    { label: 'Sticker 5', url: 'https://api.telegram.org/file/bot8187950645:AAG5Q9Wq6sZQUMsphXP3lvM8k-ooKZ11w9Q/stickers/file_5.tgs' },
    { label: 'Sticker 6', url: 'https://api.telegram.org/file/bot8187950645:AAG5Q9Wq6sZQUMsphXP3lvM8k-ooKZ11w9Q/stickers/file_6.tgs' },
    { label: 'Sticker 7', url: 'https://api.telegram.org/file/bot8187950645:AAG5Q9Wq6sZQUMsphXP3lvM8k-ooKZ11w9Q/stickers/file_7.tgs' },
  ];

  useEffect(() => {
    if (!tgsUrl) {
      setLottieJson(null);
      setError(null);
      return;
    }

    // Reset error and set loading state
    setError(null);
    setLoading(true);

    // Validate URL ends with .tgs
    if (!tgsUrl.endsWith('.tgs')) {
      setError('Invalid URL: The URL does not end with .tgs');
      setLottieJson(null);
      setLoading(false);
      return;
    }

    const corsProxy = 'https://u60ta2bi82.execute-api.ap-southeast-1.amazonaws.com/cors-server?url='; // Replace with your own proxy if needed

    fetch(corsProxy + tgsUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Network response was not ok (${response.status})`);
        }
        return response.arrayBuffer();
      })
      .then(buffer => {
        if (buffer instanceof ArrayBuffer) {
          try {
            const decompressed = ungzip(new Uint8Array(buffer));
            const data = new TextDecoder("utf-8").decode(decompressed);
            const lottieJsonData = JSON.parse(data);
            setLottieJson(lottieJsonData);
            console.log('lottieJsonData', lottieJsonData);
          } catch (err) {
            throw new Error('Error decompressing or parsing the .tgs file.');
          }
        } else {
          throw new Error('Received data is not an ArrayBuffer.');
        }
      })
      .catch(error => {
        console.error('Error fetching or parsing .tgs file:', error);
        setError(error.message);
        setLottieJson(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [tgsUrl]);

  // Handler for input change
  const handleTgsUrlChange = (event) => {
    setTgsUrl(event.target.value);
  };

  // Handler for select change
  const handleSelectChange = (event) => {
    setTgsUrl(event.target.value);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-5 p-4 bg-gray-100 dark:bg-gray-900">
      <h1 className='text-3xl italic text-blue-600 dark:text-blue-400'>Welcome To Telegram Stickers' Show</h1>

      {/* Display Loading Indicator */}
      {loading && <p className="text-blue-500">Loading...</p>}

      {/* Display Error Message */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Lottie Player */}
      {lottieJson && (
        <Player
          autoplay
          loop
          src={lottieJson}
          style={{ height: '300px', width: '300px' }}
        >
          <Controls visible={true} buttons={['play', 'repeat', 'frame', 'debug']} />
        </Player>
      )}

      {/* Input for Custom TGS URL */}
      <div className='w-3/4 space-y-3'>
        <label htmlFor="tgsUrl" className="block font-medium text-gray-700 dark:text-gray-300">
          Please insert your TGS URL below:
        </label>
        <input
          type="text"
          id="tgsUrl"
          value={tgsUrl}
          onChange={handleTgsUrlChange}
          placeholder="Enter TGS file URL"
          disabled={loading}
          className="bg-white dark:bg-gray-800 border border-gray-300 text-gray-900 dark:text-white  rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        />
      </div>

      {/* Dropdown for Selecting Predefined TGS URLs */}
      <div className='w-full max-w-md space-y-3'>
        <label htmlFor="tgsUrls" className="block font-medium text-gray-700 dark:text-gray-300">
          Select Telegram Stickers (TGS URLs)
        </label>
        <select
          id="tgsUrls"
          value={tgsUrl}
          onChange={handleSelectChange}
          disabled={loading}
          className="bg-white dark:bg-gray-800 border border-gray-300 text-gray-900 dark:text-white  rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        >
          <option value="">-- Select a Sticker --</option>
          {predefinedUrls.map((sticker, index) => (
            <option key={index} value={sticker.url}>{sticker.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default App;
