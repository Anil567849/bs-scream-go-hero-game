
'use client'
import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"

interface Obstacle {
  id: number;
  x: number;
  height: number;
}

const sampleObs = [
  {
  "id": 1726040787236.0483,
  "x": -50,
  "height": 54.84547594613494
  },
  {
    "id": 1726040787238.0557,
    "x": -150,
    "height": 55.57854175513592
  },
  {
    "id": 1726040788943.2913,
    "x": -200,
    "height": 79.1295190030107
  },
  {
    "id": 1726040789826.2998,
    "x": -350,
    "height": 79.98946832982621
  },
  {
    "id": 1726040789826.014,
    "x": -450,
    "height": 51.40175823524062
  },
  {
    "id": 1726040790096.343,
    "x": -600,
    "height": 84.30286859359708
  },
  {
    "id": 1726040790317.0374,
    "x": -700,
    "height": 53.73571166040341
  },
  {
    "id": 1726040790500.4912,
    "x": -720,
    "height": 99.11696074094036
  },
  {
    "id": 1726040790655.305,
    "x": -800,
    "height": 80.49944147138596
  },
  {
    "id": 1726040790818.3162,
    "x": -1000,
    "height": 81.6113398427184
  },
  {
    "id": 1726040790985.2576,
    "x": -1200,
    "height": 75.74660418144845
  },
  {
    "id": 1726040790988.4644,
    "x": -1260,
    "height": 96.42710767923306
  },
  {
    "id": 1726040791145.2258,
    "x": -1800,
    "height": 72.59448294697873
  },
  {
    "id": 1726040791484.4824,
    "x": -2000,
    "height": 98.23253939534294
  },
  {
    "id": 134534534543534.4824,
    "x": 500,
    "height": 98.23253939534294
  },
  {
    "id": 34534534534.4824,
    "x": 500,
    "height": 98.23253939534294
  }
];

export default function Component() {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameOver'>('start')
  const [score, setScore] = useState(0)
  const [characterY, setCharacterY] = useState(0)
  const [obstacles, setObstacles] = useState<Obstacle[]>(sampleObs);
  const [move, setMove] = useState(0)
  const [flag, setFlag] = useState(false)
  const [h, setH] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [volume, setVolume] = useState(0);

  useEffect(() => {
    jump();
  }, [volume])
  

  useEffect(() => {

    if(gameState != 'playing') return;

    let audioContext: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    let microphone: MediaStreamAudioSourceNode | null = null;
    let javascriptNode: ScriptProcessorNode | null = null;

    const handleSuccess = (stream: MediaStream) => {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)(); // Create audio context

      analyser = audioContext.createAnalyser(); // Create an analyser node
      analyser.fftSize = 256; // Set the FFT (Fast Fourier Transform - transforms time-domain data into frequency-domain data) size (more bins = more data, but 256 is sufficient for volume)
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength); // Create a data array for the audio signal

      microphone = audioContext.createMediaStreamSource(stream); // Create media stream source from the microphone
      microphone.connect(analyser); // Connect the microphone to the analyser

      javascriptNode = audioContext.createScriptProcessor(2048, 1, 1); // Processor for audio data
      javascriptNode.connect(audioContext.destination);

      javascriptNode.onaudioprocess = () => {
        analyser?.getByteFrequencyData(dataArray); // Get the frequency data (volume levels)

        // Calculate average volume (RMS)
        let values = 0;
        for (let i = 0; i < bufferLength; i++) {
          values += dataArray[i];
        }
        const average = values / bufferLength;
        const normalizedVolume = (average / 256) * 100; // Normalize the volume (0-100 scale)

        let vol = Math.round(normalizedVolume);
        
        if(vol < 50) return;

        vol = (vol/10);
        
        // console.log(vol);
        setVolume(vol); // Update volume state
        setCharacterY((prev) => {
          const val = Math.min(200, prev+vol);
          if(prev == val) return prev;
          console.log(val);
          return val;
        })
      };
    };

    // Request microphone access
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(handleSuccess)
      .catch((err) => {
        console.error('Error accessing microphone:', err);
      });

    // Cleanup the audio context and microphone stream when the component is unmounted or gameState Change
    return () => {
      if (audioContext) audioContext.close();
      if (microphone) microphone.disconnect();
      if (javascriptNode) javascriptNode.disconnect();
    };
  }, [gameState]);

  const startGame = () => {
    setGameState('playing')
    setScore(0)
    setCharacterY(0)
    setObstacles(sampleObs);
  }

  const endGame = () => {
    setGameState('gameOver')
  }
  
  useEffect(() => {
    
    if(flag){
      if(characterY+h <= h){
        endGame();
      }
    }
  
    if (characterY <= 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }else{
      intervalRef.current = setInterval(() => {
        setCharacterY(prevY => prevY - 10);
      }, 50);
    }

    // Cleanup function to clear the interval on unmount or when `characterY` changes
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [characterY, flag, h]);

  useEffect(() => {
    
    setObstacles((prev) => {
      let checkObs = false;
      const arr = prev.map((obs) => {
        // Check for collision detection
        if ((obs.x <= 1010 && (obs.x + 48) >= (905+48))) {
          setFlag(true);
          setH(obs.height);
          checkObs = true;
        }
        
        // Move obstacle by increasing its x position
        return { ...obs, x: obs.x + 5 };
      }).filter(obs => obs.x < 1300); // remove obstacle that is out of screen

      if(!checkObs){
        setFlag(false);
        setH(0);
      }
      return arr;
    });
  
  }, [move])
  

  const jump = () => {

      // Just trigger move state
      setMove((prev) => {
        return prev+1;
      });

      setScore((prev) => {
        return prev+1;
      })
      
  }


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-400 to-purple-500">
      <div className="relative w-[100vw] h-[100vh] bg-white rounded-3xl overflow-hidden shadow-2xl">
        {/* Game screen */}
        <div className="relative h-full">
          {/* White background */}
          <div className="absolute inset-0 bg-white"></div>
          
          {/* Ground */}
          <div className="absolute bottom-0 left-0 right-0 h-[10%] bg-gradient-to-b from-green-400 to-green-600"></div>
          
          <img 
            className={`absolute left-1/4 w-16 h-16 transition-all duration-500 ease-in-out`} 
            style={{bottom: `calc(10% + ${characterY}px)`}}
            src={'/char.png'}
          />
          
          {/* Obstacles */}
          {obstacles.map(obstacle => (
            <div 
              key={obstacle.id}
              className="absolute bottom-[10%] w-12 bg-gradient-to-b from-gray-700 to-gray-900 rounded-t-lg"
              style={{
                right: `${obstacle.x}px`,
                height: `${obstacle.height}px`
              }}
            ></div>
          ))}
          
          {/* Score display */}
          <div className="absolute top-4 left-4 text-2xl font-bold text-black">
            Score: {score}
          </div>
          
          {/* Start screen */}
          {gameState === 'start' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <Button onClick={startGame} className="px-8 py-4 text-2xl">
                Start Game
              </Button>
            </div>
          )}
          
          {/* Game over screen */}
          {gameState === 'gameOver' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
              <h2 className="text-4xl font-bold text-white mb-4">Game Over</h2>
              <p className="text-2xl text-white mb-8">Score: {score}</p>
              <Button onClick={startGame} className="px-8 py-4 text-2xl">
                Play Again
              </Button>
            </div>
          )}
        </div>
        
        {/* Microphone input visualization */}
        <div className="absolute bottom-4 left-4 right-4 h-8 bg-gray-800 rounded-full overflow-hidden">
          <div 
              className="h-full bg-gradient-to-r from-red-400 to-red-600 rounded-full transition-all duration-100 ease-in-out"
              style={{width: `${volume}%`}}
            ></div>
        </div>
      </div>
    </div>
  )
}