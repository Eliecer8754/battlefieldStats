import React from 'react'

const CardPlayer = ({nickname, kills, deaths, assists, score, image, rank}) => {
    const getStyles = () => {
        switch (rank) {
            case 0:
            return "border-red-500 shadow-red-500 shadow-[0_0_60px_10px_rgba(255,0,0,0.9)]";
            case 1:
            return "shadow-green-400 border-green-400 shadow-[0_0_40px_6px_rgba(255,140,0,0.8)]";
            case 2:
            return "border-orange-400 shadow-orange-400  shadow-[0_0_25px_4px_rgba(34,197,94,0.6)]";
            default:
            return "border-gray-500 shadow-gray-500 shadow-md";
        }
        };

  return (
    <div className={`flex flex-col items-center w-100 h-140 bg-gray-700 rounded-4xl font-bold text-xl border-2 transition-all duration-500 ${getStyles()} flex-col items-center  w-100 h-140 bg-gray-700 rounded-4xl font-bold text-xl border-2
    `}>
    <span className='mt-10'>{nickname}</span>
    <div>
        <img src={image} alt="" className='w-75 h-65 rounded-2xl mt-2 mb-2 ' />
    </div>
    <div className='w-75 h-36 flex flex-col justify-evenly'>
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
  )
}

export default CardPlayer
