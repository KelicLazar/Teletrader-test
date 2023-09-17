import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const Details = () => {
  const [pairDetails, setPairDetails] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const isLoggedIn = useSelector((state) => state.crypto.isLoggedIn);
  const { pair } = useParams();

  const checkIfFavorite = useCallback(() => {
    const favorites = JSON.parse(localStorage.getItem("favoritePairs") || "[]");
    setIsFavorite(favorites.includes(pair.toUpperCase()));
  }, [pair]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await fetch(`/v1/pubticker/${pair}`);
        let result = await response.json();
        setPairDetails(result);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();

    checkIfFavorite();
  }, [pair, checkIfFavorite]);

  const updateFavorites = (action) => {
    const favorites = JSON.parse(localStorage.getItem("favoritePairs") || "[]");
    if (action === "add") {
      favorites.push(pair.toUpperCase());
      localStorage.setItem("favoritePairs", JSON.stringify(favorites));
      setIsFavorite(true);
    } else if (action === "remove") {
      const updatedFavorites = favorites.filter(
        (item) => item !== pair.toUpperCase()
      );
      localStorage.setItem("favoritePairs", JSON.stringify(updatedFavorites));
      setIsFavorite(false);
    } else {
      console.log("Unknown action!");
    }
  };
  return (
    <>
      <div className="container  mt-5  crypto-table">
        <div className="table-heading row">
          <span className="text-start col-3 ">Name</span>
          <span className="text-end col-3 ">Last Price</span>

          <span className="text-end  col-3 ">High</span>
          <span className="text-end  col-3 ">Low</span>
        </div>
        <div className="row crypto-pair-row position-relative">
          {!isLoading && (
            <>
              <div className="col-3  text-start">{pair.toUpperCase()}</div>
              <div className="col-3  text-end">{pairDetails.last_price}</div>
              <div className="col-3  text-end">{pairDetails.high}</div>
              <div className="col-3  text-end">{pairDetails.low}</div>
            </>
          )}

          {isLoading && <span className="loader"></span>}
        </div>
      </div>

      {isLoggedIn && (
        <div className="container ps-0">
          {!isFavorite && (
            <button className="btn-add" onClick={() => updateFavorites("add")}>
              Add to Favorites
            </button>
          )}
          {isFavorite && (
            <button
              className="btn-remove"
              onClick={() => updateFavorites("remove")}
            >
              Remove from Favorites
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default Details;
