function SignIn({ onSignIn }) {
  return (
    <div style={{ padding: 20 }}>
      <h2>🔐 Student Sign In</h2>
      <input placeholder="Username" />
      <br />
      <input placeholder="Password" type="password" />
      <br />
      <button onClick={onSignIn}>Sign In</button>
    </div>
  );
}

export default SignIn;