import { useNavigate } from "react-router-dom";
import apiClient from "../api/axios";
import { useContext } from "react";
import { AuthContext } from "../components/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { setCurrentUser } = useContext(AuthContext);

  const handleLogin = async function (e) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const userCredentials = {
      email: formData.get("email"),
      password: formData.get("password"),
      phoneNumber: formData.get("phone"),
    };
    try {
      const res = await apiClient.post("/user-auth/login", userCredentials);
      // console.log("user logged in=", res.data);
      setCurrentUser(res?.data);
      navigate("/");
    } catch (error) {
      console.log("Error:", error);
    }
  };
  return (
    <div className="bg-primary-light h-screen flex  items-center justify-center">
      <div className="flex flex-col gap-8 items-center justify-between bg-stone-100 border-2 border-primary rounded-lg px-4 py-6 font-poppins md:w-1/3">
        <h1 className="font-semibold text-4xl text-primary">JustGossip</h1>
        <form
          className="flex flex-col gap-3 w-full py-4"
          onSubmit={handleLogin}
        >
          <div className="flex gap-2 items-center justify-between">
            <label htmlFor="" className=" text-xl">
              Email
            </label>
            <input
              type="email"
              name="email"
              className="border border-secondary rounded-md  px-2 py-1 focus:border-primary outline-none w-3/4"
            />
          </div>
          <div className="flex gap-2 items-center justify-between">
            <label htmlFor="" className=" text-xl">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              className="border border-secondary rounded-md  px-2 py-1 focus:border-primary outline-none w-3/4"
            />
          </div>
          <div className="flex gap-2 items-center justify-between">
            <label htmlFor="" className=" text-xl">
              Password
            </label>
            <input
              type="password"
              name="password"
              className="border border-secondary rounded-md  px-2 py-1 focus:border-primary outline-none w-3/4"
            />
          </div>
          <div className="mt-4">
            <button
              className="bg-primary text-white w-full rounded-md font-semibold py-3 cursor-pointer hover:bg-hover mt-6"
              type="submit"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
