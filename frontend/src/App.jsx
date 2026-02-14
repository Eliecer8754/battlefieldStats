import CardPlayer from './components/CardPlayer'
import { useEffect, useState } from "react";
import luis from "./images/luis.jpg"
import yo from "./images/yo.jpg"
import isaac from "./images/isaac.jpg"
import ruben from "./images/ruben.jpg"
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
    <div className='w-full h-screen bg-gray-900 flex flex-col  items-center text-white'>
      <span className='absolute right-30 top-20 text-2xl bg-gray-600 px-6 py-4 rounded-2xl'>partidas: {matchesCount}</span>
      <div className='mt-20'>
        <h1 className="
          text-5xl
          font-extrabold
          tracking-wide
          text-cyan-300
          drop-shadow-[0_0_12px_oklch(78.9%_0.154_211.53)]
          mb-10
          text-center
        ">
          Estadísticas del mes de
          <span className="block text-white text-4xl mt-2 capitalize">
            {month}
          </span>
        </h1>
      </div>
      <div className='flex w-full justify-evenly items-center mt-20'>
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
          />
        ))}
      </div>
    </div>
  )
}

export default App
