import React from 'react';

type State = {
  loading: boolean;
  sent: boolean;
  email: string;
  password: string;
  error: string;
};

class App extends React.Component<{}, State> {
  state = { email: "", password: "", loading: false, error: "", sent: false };
  handleChange = (e: React.FormEvent<EventTarget>) => {
    const target = e.target as HTMLInputElement;
    this.setState((prevState: State) => ({ ...prevState, [target.name]: target.value }));
  }
  handleSubmit = async () => {
    try {
      this.setState((prevState: State) => ({ ...prevState, loading: true }));
      const { email, password } = this.state;
      const res = await fetch("/login", {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ email, password })
      });

      if (res.status === 200) {
        this.setState({ loading: false, sent: true });
      } else {
        const result = await res.json();
        throw result.msg;
      }
    } catch (e) {
      this.setState((prevState: State) => ({ ...prevState, error: e.msg, loading: false }));
    }
  }
  render() {
    const { email, password, sent, loading, error } = this.state;
    return (
      <div className="container mt-4 w-50">
        <h4 className="text-center text-monospace">Login/Signup with your email + password to receive an email sent by a background worker ;)</h4>
        {loading && <h3>Loading...</h3>}
          {!loading && !sent && (
          <form>
            <div className="form-group">
              <label htmlFor="exampleInputEmail1">Email address</label>
              <input onChange={this.handleChange} value={email} type="email" name="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
              <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
            </div>
            <div className="form-group">
              <label htmlFor="exampleInputPassword1">Password</label>
              <input value={password} name="password" onChange={this.handleChange} type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" />
            </div>
            <button type="submit" onClick={this.handleSubmit} className="btn btn-primary">Submit</button>
          </form>
        )}
        {!loading && error && <h3>{error}</h3>}
        {!loading && sent && <h2>A confirmation email will be sent shortly to: {email}</h2>}
      </div>
    );
  }
}

export default App;
