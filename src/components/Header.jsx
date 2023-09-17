import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { login } from "../store/cryptoSlice";

const Header = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.crypto.isLoggedIn);

  const loginHandler = () => {
    dispatch(login());
    localStorage.setItem("isLoggedIn", true);
  };

  return (
    <div className="container header">
      <div className="row ">
        <ul className="col-12 mt-2 d-flex align-items-end">
          <li className="me-5">
            <NavLink to="/">Home</NavLink>
          </li>
          {isLoggedIn && (
            <li>
              <NavLink className=" " to="/favorites">
                Favorites
              </NavLink>
            </li>
          )}

          {!isLoggedIn && (
            <li className="ms-auto">
              <button onClick={loginHandler}>Login</button>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Header;
