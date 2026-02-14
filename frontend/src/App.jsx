import CardPlayer from './components/CardPlayer'
import { useEffect, useState } from "react";
import luis from "./images/luis.jpg"
import yo from "./images/yo.jpg"
import isaac from "./images/isaac.jpg"
import ruben from "./images/ruben.jpg"
import diamante from "./images/medallaDiamanteWB.png"
import oro from "./images/medallaOroWB.png"
import plata from "./images/medallaPlataWB.png"
import bronce from "./images/medallaBronceWB.png"
const App = () => {
  const month = new Date().toLocaleString("es-ES", { month: "long" });
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [matchesCount, setMatchesCount] = useState(0);

  const playerImages = {
    RACG507PTY: ruben,
    Visuetti5075029: luis,
    isaacvisuetti: isaac,
    javierKiller13: yo,
  };
  const medals = {
    0: diamante,
    1: oro,
    2: plata,
    3: bronce,
  };


  useEffect(() => {
  const fetchData = async () => {
    try {
      const statsRes = await fetch("https://battlefieldstats.onrender.com/api/battlefieldStats");
      if (!statsRes.ok) throw new Error("Failed to fetch stats");
      const statsData = await statsRes.json();
      setStats(statsData.data);

      const matchesRes = await fetch("https://battlefieldstats.onrender.com/api/battlefieldStats/matches/count");
      if (!matchesRes.ok) throw new Error("Failed to fetch matches count");
      const matchesData = await matchesRes.json();
      setMatchesCount(matchesData.total);

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  fetchData();
}, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  console.log(stats)
  return (
    <div className='w-full relative h-full lg:h-screen bg-gray-900 flex flex-col  items-center text-white'>
      <div className='mt-25 lg:mt-20 flex flex-col justify-center'>
        <h1 className="
          text-2xl
          lg:text-5xl
          font-extrabold
          tracking-wide
          text-cyan-300
          drop-shadow-[0_0_12px_oklch(78.9%_0.154_211.53)]
          text-center
          ">
          Estadísticas del mes de
          <span className="block text-whiright-30 text-4xl mt-2 capitalize">
            {month}
          </span>
        </h1>
        <div className="w-30 absolute top-5 right-5 lg:top-10 lg:right-10 px-4 py-2 [background:linear-gradient(45deg,#172033,--theme(--color-slate-800)_50%,#172033)_padding-box,conic-gradient(from_var(--border-angle),--theme(--color-slate-600/.48)_80%,--theme(--color-indigo-500)_86%,--theme(--color-indigo-300)_90%,--theme(--color-indigo-500)_94%,--theme(--color-slate-600/.48))_border-box] rounded-2xl border border-transparent animate-border">
        Partidas: {matchesCount}
      </div>
      </div>
      <div className=' flex flex-col lg:flex-row w-full justify-evenly items-center mt-20'>
        {[...stats]
        .sort((a, b) => Number(b.score) - Number(a.score))
        .map((player, index) => (
          <CardPlayer
            key={`${player.month}-${player.nickname}`}
            nickname={player.nickname}
            kills={Number(player.kills)}
            deaths={Number(player.deaths)}
            assists={Number(player.assists)}
            score={Number(player.score)}
            image={playerImages[player.nickname]}
            rank={index}
            medalla={medals[index]}
          />
        ))}
      </div>
    </div>
  )
}

export default App
