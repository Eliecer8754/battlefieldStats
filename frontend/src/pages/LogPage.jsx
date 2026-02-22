import { useEffect, useState } from "react";

const LogPage = () => {
  const [matchesByDay, setMatchesByDay] = useState({});
  const [openDate, setOpenDate] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      const res = await fetch("https://battlefieldstats.onrender.com/api/battlefieldStats/matches/grouped");
      const data = await res.json();
      setMatchesByDay(data);
    };

    fetchMatches();
  }, []);

  // 🔥 Sort dates from newest to oldest
  const sortedDates = Object.keys(matchesByDay).sort(
    (a, b) => new Date(b) - new Date(a)
  );

  const toggleDate = (date) => {
    setOpenDate(prev => (prev === date ? null : date));
  };

  return (
    <div className="lg:flex lg:flex-col lg:w-full lg:items-center lg:h-full pt-15 p-6 bg-gray-800 min-h-screen text-white">
      {sortedDates.map((date) => {
        const matches = matchesByDay[date];
        const isOpen = openDate === date;

        return (
          <div key={date} className="mb-6 lg:w-xl rounded-lg overflow-hidden">
            
            
            <div
              onClick={() => toggleDate(date)}
              className="cursor-pointer border-2 rounded-2xl  p-4 flex justify-between items-center"
            >
              <h2 className="text-xl font-bold">
                📅 {new Date(date).toLocaleDateString("es-ES", {
                    month: "long",
                    day: "numeric",
                    timeZone: "UTC"
                  })}
              </h2>

              <span>{isOpen ? "▲" : "▼"}</span>
            </div>

            
            {isOpen && (
              <div className="py-4 ">
                {matches.map((match, index) => (
                  <div
                    key={match.match_id}
                    className="mb-4 p-3 border rounded-lg"
                  >
                    <h3 className="font-semibold mb-2">
                      Partida {index + 1}
                    </h3>
                    <div className="flex w-full border-b pb-2 mb-2 font-semibold text-sm">
                      <div className="w-1/2">
                        Player
                      </div>
                      <div className="w-1/2 grid grid-cols-4 text-center">
                        <span>K</span>
                        <span>A</span>
                        <span>D</span>
                        <span>P</span>
                      </div>
                    </div>
                    {match.players.map((player, index) => (
                      <div key={index} className="flex w-full py-1">

                        {/* LEFT SIDE - NAMES */}
                        <div className="w-1/2 flex items-center">
                          {player.nickname}
                        </div>

                        {/* RIGHT SIDE - STATS */}
                        <div className="w-1/2 grid grid-cols-4 text-center">
                          <span>{player.kills}</span>
                          <span>{player.assists}</span>
                          <span>{player.deaths}</span>
                          <span className="text-center">{player.score}</span>
                        </div>

                      </div>
                    ))}

                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default LogPage;
