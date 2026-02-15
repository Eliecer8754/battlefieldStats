import React from 'react'
import { useState } from "react";

const CardPlayer = ({
  nickname,
  kills,
  deaths,
  assists,
  score,
  image,
  rank,
  medalla,
  killContribution
}) => {

  let KD = null;
  let KDA = null;

  if (deaths == 0) {
    KD = kills;
    KDA = kills + assists;
  } else {
    KD = kills / deaths;
    KDA = (kills + assists) / deaths;
  }

  KD = Number(KD.toFixed(1));
  KDA = Number(KDA.toFixed(1));

  const [reverse, setReverse] = useState(false);

  const toggleReverse = () => {
    console.log("toggle");
    setReverse(prev => !prev);
  };

  const getStyles = () => {
    switch (rank) {
      case 0:
        return "border-red-500 shadow-red-500 shadow-[0_0_60px_10px_rgba(255,0,0,0.9)]";
      case 1:
        return "shadow-green-400 border-green-400 shadow-[0_0_40px_6px_rgba(255,140,0,0.8)]";
      case 2:
        return "border-orange-400 shadow-orange-400 shadow-[0_0_25px_4px_rgba(34,197,94,0.6)]";
      default:
        return "border-gray-500 shadow-gray-500 shadow-md";
    }
  };

  return (
    <div
      onClick={toggleReverse}
      className="w-70 h-100 lg:w-100 lg:h-140 mb-20 lg:mb-0 cursor-pointer"
      style={{ perspective: "1000px" }}
    >
      <div
        className={`relative flex flex-col items-center font-normal lg:font-bold transition-all duration-700`}
        style={{
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          transform: reverse ? "rotateY(180deg)" : "rotateY(0deg)"
        }}
      >

        {/* FRONT */}
        <div
          className={`absolute flex flex-col items-center bg-gray-700 rounded-4xl border-2 transition-all duration-500 ${getStyles()} w-70 h-100 lg:w-100 lg:h-140 text-md lg:text-xl border-2`}
          style={{
            backfaceVisibility: "hidden"
          }}
        >
          <img src={medalla} className='absolute w-15 -top-0.5 right-5' />

          <span className='mt-10'>{nickname}</span>

          <div>
            <img
              src={image}
              alt=""
              className='w-50 h-40 lg:w-75 lg:h-65 rounded-2xl mt-2 mb-2'
            />
          </div>

          <div className='w-50 lg:w-75 lg:h-36 flex flex-col justify-evenly'>
            <div>
              <span>Kills: </span>
              <span>{kills}</span>
            </div>

            <div>
              <span>Puntos: </span>
              <span>{score}</span>
            </div>

            <div>
              <span>Muertes: </span>
              <span>{deaths}</span>
            </div>

            <div>
              <span>Asistencias: </span>
              <span>{assists}</span>
            </div>
          </div>
        </div>

        {/* BACK */}
        <div
          className={`absolute flex flex-col justify-center items-center bg-gray-700 rounded-4xl border-2 transition-all duration-500 ${getStyles()} w-70 h-100 lg:w-100 lg:h-140 text-md lg:text-xl border-2`}
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)"
          }}
        >
          <div className='flex justify-center items-center mb-7 lg:mb-10'>
            <div className='flex flex-col justify-center items-center lg:h-30 lg:w-30 h-24 w-24 rounded-2xl border-2 border-green-700 bg-green-900 mr-6'>
              <span>KD</span>
              <span className='text-4xl'>{KD}</span>
            </div>

            <div className='flex flex-col justify-center items-center lg:h-30 lg:w-30 h-24 w-24 rounded-2xl border-2 border-yellow-700 bg-yellow-900'>
              <span>KDA</span>
              <span className='text-4xl'>{KDA}</span>
            </div>
          </div>

          <span className='lg:w-60 lg:h-30 w-49 h-24  bg-cyan-700 rounded-2xl border-cyan-950 flex flex-col justify-center items-center border-2'>
            <span>kill%</span>
            <span className='text-4xl'>{killContribution}</span>
          </span>
        </div>

      </div>
    </div>
  );
};

export default CardPlayer;
