function SignUp() {
  return (
    <>
      <form>
        <div>
          <label htmlFor="">Name</label>
          <input type="text" />
        </div>
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
        <button>Sign Up</button>
      </form>
    </>
  );
}

export default SignUp;
