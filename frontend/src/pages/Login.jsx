function Login() {
  return (
    <>
      <form>
        <div>
          <label htmlFor="">Email</label>
          <input type="email" />
        </div>
        <div>
          <label htmlFor="">Phone Number</label>
          <input type="text" />
        </div>
        <div>
          <label htmlFor="">Password</label>
          <input type="password" />
        </div>
        <button>Login</button>
      </form>
    </>
  );
}

export default Login;
