const urls = {
  development: "http://localhost:4001",
  // production: "https://macaldy-backend.herokuapp.com",
  production: "https://macaldy.com"
};

let env = process.env.NODE_ENV;

export default {
  graphql: {
    url: {
      http: `${urls[env]}/graphql`,
      ws: `${urls[env]
        .replace("https", "wss")
        .replace("http", "ws")}/subscriptions`
    },
    method: "POST",
    headers: {
      json: { "Content-Type": "application/json" }
    }
  },
  api: {
    url: `${urls[env]}`
  }
};
