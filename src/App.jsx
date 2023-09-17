import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import "./App.scss";
import {
  Navigate,
  Outlet,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Details from "./pages/Details";
import { login } from "./store/cryptoSlice";

const fivePairsLoader = async () => {
  try {
    let response = await fetch("/v1/symbols");
    let result = await response.json();
    return result.slice(0, 5);
  } catch (err) {
    console.log(err);
    return [];
  }
};
const favoritePairsLoader = async () => {
  try {
    let favoritePairs = JSON.parse(
      localStorage.getItem("favoritePairs") || "[]"
    );

    let response = await fetch("/v1/symbols");
    let result = await response.json();

    return result
      .slice(0, 5)
      .filter((pair) => favoritePairs.includes(pair.toUpperCase()));
  } catch (err) {
    console.log(err);
    return [];
  }
};

const authenticatedRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Header />
        <div className="p-2">
          <Outlet />
        </div>
      </>
    ),
    children: [
      { path: "/", element: <Home />, loader: fivePairsLoader },
      { path: "/details/:pair", element: <Details /> },
      { path: "/favorites", element: <Home />, loader: favoritePairsLoader },
      { path: "*", element: <Navigate to="/" /> },
    ],
  },
]);

const unauthenticatedRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Header />
        <div className="p-2">
          <Outlet />
        </div>
      </>
    ),
    children: [
      { path: "/", element: <Home />, loader: fivePairsLoader },
      { path: "/details/:pair", element: <Details /> },
      { path: "*", element: <Navigate to="/" /> },
    ],
  },
]);

function App() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.crypto.isLoggedIn);

  useEffect(() => {
    const isLogged = localStorage.getItem("isLoggedIn");

    if (isLogged) {
      dispatch(login());
    }
  }, [dispatch]);

  return (
    <RouterProvider
      router={isLoggedIn ? authenticatedRouter : unauthenticatedRouter}
    />
  );
}

export default App;
