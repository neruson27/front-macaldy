const urls = {
  development: "http://localhost:4000",
  // production: "https://vertice-audio-backend.herokuapp.com",
  production: "https://verticeaudio.com"
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
