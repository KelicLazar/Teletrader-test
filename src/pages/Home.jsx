import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPair, updatePair } from "../store/cryptoSlice";

import { Link, useLoaderData, useLocation } from "react-router-dom";

const Home = () => {
  const dispatch = useDispatch();
  const cryptoData = useSelector((state) => state.crypto.data);
  const loadedPairs = useLoaderData();
  const location = useLocation();
  const favoritePairs = JSON.parse(localStorage.getItem("favoritePairs"));

  useEffect(() => {
    const ws = new WebSocket("wss://api-pub.bitfinex.com/ws/2");

    ws.onopen = () => {
      console.log("CONNECTION OPENED.");
      if (ws.readyState === WebSocket.OPEN) {
        loadedPairs.forEach((pair) => {
          ws.send(
            JSON.stringify({
              event: "subscribe",
              channel: "ticker",
              symbol: "t" + pair.toUpperCase(),
            })
          );
        });
      }
    };

    ws.onmessage = (event) => {
      const response = JSON.parse(event.data);

      if (response.event === "subscribed") {
        console.log("SUBSCRIBED", response.chanId, response.pair);
        dispatch(addPair({ name: response.pair, channelId: response.chanId }));
      }

      if (response[1] && typeof response[1] !== "string") {
        console.log(response, "updated");

        dispatch(
          updatePair({
            channelId: response[0],
            lastPrice: response[1][6],
            change: response[1][4],
            changePercent: response[1][5] * 100,
            high: response[1][8],
            low: response[1][9],
          })
        );
      }
    };

    ws.onerror = (error) => {
      console.error(`WebSocket Error:`, error);
    };

    ws.onclose = (event) => {
      console.log("CONNECTION CLOSED", event);
    };

    return () => {
      console.log("CLEANUP RUNNED");
      ws.close();
    };
  }, [dispatch, loadedPairs]);

  const filteredCryptoData = cryptoData.filter(
    (item) =>
      location.pathname !== "/favorites" ||
      (favoritePairs && favoritePairs.includes(item.name))
  );

  return (
    <div className="container  mt-5 crypto-table">
      <div className="table-heading row">
        <span className="text-start col-2 ">Name</span>
        <span className="text-end col-2 ">Last</span>
        <span className="text-end col-2 ">Change</span>
        <span className="text-end col-2 ">Change Percent</span>
        <span className="text-end col-2 ">High</span>
        <span className="text-end col-2 ">Low</span>
      </div>
      {filteredCryptoData.map((pair) => {
        return (
          <div key={pair.name} className="row crypto-pair-row">
            <div className="col-2 ">
              <Link
                to={`/details/${pair.name.toLowerCase()}`}
                className="pair-name"
              >
                {pair.name}
              </Link>
            </div>
            <div className="col-2 text-end">{pair.lastPrice}</div>
            <div
              className={`col-2  text-end ${
                +pair.change > 0 ? "positive" : "negative"
              }`}
            >
              {pair.change}
            </div>
            <div
              className={`col-2  text-end ${
                +pair.change > 0 ? "positive" : "negative"
              }`}
            >
              {pair.changePercent?.toFixed(2) + "%"}
            </div>
            <div className="col-2  text-end">{pair.high}</div>
            <div className="col-2  text-end">{pair.low}</div>
          </div>
        );
      })}
    </div>
  );
};

export default Home;
