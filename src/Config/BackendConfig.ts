const getLocalIP = () => {
  // You can hardcode your LAN IP here, or make this configurable
  return "192.168.1.241";
};

const hostname = window.location.hostname;

const isLocalhost = hostname === "localhost" || hostname === "127.0.0.1";
const isLocalIP = hostname.startsWith("192.168.");

type BackendConfig = {
  apiEndpoint: string;
  socketEndpoint: string;
};

const config: BackendConfig = {
  apiEndpoint:
    (globalThis as any).process?.env?.NODE_ENV === "production"
      ? ""
      : isLocalhost
      ? "http://localhost:3000/api"
      : isLocalIP
      ? `http://${hostname}:3000/api` // Using actual LAN IP from browser URL
      : `http://${getLocalIP()}:3000/api`,

  socketEndpoint:
    (globalThis as any).process?.env?.NODE_ENV === "production"
      ? ""
      : isLocalhost
      ? "http://localhost:3000/"
      : isLocalIP
      ? `http://${hostname}:3000/`
      : `http://${getLocalIP()}:3000/`,
};

export default config;