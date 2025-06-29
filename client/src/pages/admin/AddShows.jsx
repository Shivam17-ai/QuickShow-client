import React, { useEffect, useState } from "react";
import { dummyShowsData } from "../../assets/assets";
import Loading from "../../components/Loading";
import { Star } from "lucide-react";
import { kConverter } from "../../lib/kConverter";
import Title from "../../components/admin/Title";
import { CheckIcon } from "lucide-react";
import { useAppContext } from "../../context/AppContext";

const AddShows = () => {

  const{axios,getToken,user}=useAppContext

  const currency = import.meta.env.VITE_CURRENCY;
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [dateTimeSelection, setDateTimeSelection] = useState({});
  const [dateTimeInput, setDateTimeInput] = useState("");
  const [showPrice, setShowPrice] = useState("");

  const fetchNowPlayingMovies = async () => {
    try {
        const { data } = await axios.get('/api/show/now-playing', {
            headers: { Authorization: `Bearer ${await getToken()}` }
        })
        if (data.success) {
            setNowPlayingMovies(data.movies)
        }
    } catch (error) {
        console.error('Error fetching movies:', error)
    }
  }

  const handleDateTimeAdd = () => {
    if (!dateTimeInput) {
      alert("Please select a valid date and time.");
      return;
    }

    const [date, time] = dateTimeInput.split("T");
    if (!date || !time) {
      alert("Date or time is invalid.");
      return;
    }

    setDateTimeSelection((prev) => {
      const times = prev[date] || [];
      if (!times.includes(time)) {
        return { ...prev, [date]: [...times, time] };
      }
      alert("This time is already added for the selected date.");
      return prev;
    });

    setDateTimeInput(""); // Reset input field after adding
  };

  const handleRemoveTime = (date, time) => {
    setDateTimeSelection((prev) => {
      const filteredTimes = prev[date].filter((t) => t !== time);

      if (filteredTimes.length === 0) {
        const { [date]: _, ...rest } = prev;
        return rest;
      }

      return {
        ...prev,
        [date]: filteredTimes,
      };
    });
  };

  useEffect(() => {
    fetchNowPlayingMovies();
  }, []);

  return nowPlayingMovies.length > 0 ? (
    <div className="p-6 bg-black text-white min-h-screen">
      <h1 className="text-4xl font-bold text-red-500">
        Add <span className="text-white">Shows</span>
      </h1>
      <p className="mt-8 text-lg font-semibold">Now Playing Movies</p>

      <div className="mt-6 flex flex-wrap gap-6">
        {nowPlayingMovies.map((movie) => (
          <div
            key={movie.id}
            className={`group relative max-w-[200px] bg-gray-800 rounded-lg 
            shadow-lg hover:shadow-xl hover:-translate-y-1 
            transition duration-300`}
            onClick={() => setSelectedMovie(movie.id)}
          >
            <img
              src={movie.poster_path || "/default.jpg"}
              alt={movie.title || "Movie Poster"}
              className="rounded-t-lg w-full object-cover h-[300px] brightness-90"
            />

            <div className="p-4">
              <h3 className="text-lg font-medium truncate text-center">
                {movie.title || "Untitled"}
              </h3>
              <div className="flex justify-between items-center mt-2">
                <span className="flex items-center text-sm text-yellow-500">
                  <Star className="w-4 h-4 fill-yellow-500 mr-1" />
                  {movie.vote_average.toFixed(1)}
                </span>
                <span className="text-sm text-gray-400">
                  {kConverter(movie.vote_count)} Votes
                </span>
              </div>
            </div>
            {selectedMovie === movie.id && (
              <div className="absolute top-2 right-2 flex items-center justify-center bg-primary h-6 w-6 rounded">
                <CheckIcon className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8">
        <label className="block text-sm font-medium mb-2">Show Price</label>
        <div className="inline-flex items-center gap-2 border border-gray-600 px-3 py-2 rounded-md">
          <p className="text-gray-400 text-sm">{currency}</p>
          <input
            min={0}
            type="number"
            value={showPrice}
            onChange={(e) => setShowPrice(e.target.value)}
            placeholder="Enter show price"
            className="outline-none"
          />
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium mb-2">Select Date and Time</label>
        <div className="inline-flex gap-5 border border-gray-600 p-1 pl-3 rounded-lg">
          <input
            type="datetime-local"
            value={dateTimeInput}
            onChange={(e) => setDateTimeInput(e.target.value)}
            className="outline-none rounded-md"
          />
          <button
            onClick={handleDateTimeAdd}
            className="bg-primary/80 text-white px-3 py-2 text-sm rounded-lg hover:bg-primary cursor-pointer"
          >
            Add Time
          </button>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium">Selected Dates and Times</h3>
        {Object.keys(dateTimeSelection).length > 0 ? (
          <ul className="mt-4">
            {Object.entries(dateTimeSelection).map(([date, times]) => (
              <li key={date} className="mb-2">
                <strong>{date}:</strong>
                {times.map((time) => (
                  <span key={time} className="ml-2 text-gray-500">
                    {time}
                    <button
                      onClick={() => handleRemoveTime(date, time)}
                      className="ml-2 text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </span>
                ))}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No dates or times selected yet.</p>
        )}
      </div>
      <button className="bg-primary text-white px-8 py-2 mt-6 rounded hover:bg-primary/90 transition-all cursor-pointer">
        Add Show
    </button>
    </div>
    
  ) : (
    <Loading />
  );
};

export default AddShows;
