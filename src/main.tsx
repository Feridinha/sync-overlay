import ReactDOM from "react-dom/client"
import App from "./App"
import SocketProvider from "./hooks/useSocket/Provider"
import "./i18n"

ReactDOM.createRoot(document.getElementById("root")!).render(
    //   <React.StrictMode>
    <SocketProvider>
        <App />
    </SocketProvider>
    //   </React.StrictMode>,
)
