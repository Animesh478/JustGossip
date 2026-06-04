import { Link, useNavigate } from "react-router-dom";
import apiClient from "../api/axios";

function SignUp() {
  const navigate = useNavigate();
  const handleSignup = async function (formData) {
    const userDetails = {
      username: formData.get("username"),
      email: formData.get("email"),
      password: formData.get("password"),
      phoneNumber: formData.get("phoneNumber"),
    };
    try {
      await apiClient.post("/user-auth/signup", userDetails);
      navigate("/login");
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="bg-primary-light h-screen flex  items-center justify-center">
      <div className="flex flex-col gap-8 items-center justify-between bg-stone-100 border-2 border-primary rounded-md px-4 py-6 font-poppins md:w-1/3">
        <h1 className="font-semibold text-4xl text-primary">JustGossip</h1>
        <form className="flex flex-col gap-3 w-full py-4" action={handleSignup}>
          <div className="flex gap-2 items-center justify-between">
            <label htmlFor="" className=" text-xl">
              Name
            </label>
            <input
              type="text"
              className="border border-secondary rounded-md  px-2 py-1 focus:border-primary outline-none w-3/4"
              name="username"
            />
          </div>
          <div className="flex gap-2 items-center justify-between">
            <label htmlFor="" className=" text-xl">
              Email
            </label>
            <input
              type="email"
              className="border border-secondary rounded-md  px-2 py-1 focus:border-primary outline-none w-3/4"
              name="email"
            />
          </div>
          <div className="flex gap-2 items-center justify-between">
            <label htmlFor="" className=" text-xl">
              Phone
            </label>
            <input
              type="text"
              className="border border-secondary rounded-md  px-2 py-1 focus:border-primary outline-none w-3/4"
              name="phoneNumber"
            />
          </div>
          <div className="flex gap-2 items-center justify-between">
            <label htmlFor="" className=" text-xl">
              Password
            </label>
            <input
              type="password"
              className="border border-secondary rounded-md  px-2 py-1 focus:border-primary outline-none w-3/4"
              name="password"
            />
          </div>
          <div className="mt-4">
            <button className="bg-primary text-white w-full rounded-md font-semibold py-3 cursor-pointer hover:bg-hover mt-6">
              Sign Up
            </button>
            <div className="flex gap-1">
              <p>Already a member?</p>
              <Link to="/login" className="text-secondary">
                Login
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
