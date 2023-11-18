import { ApiRoomData, ApiVideo } from "@types"
import { createContext, useContext } from "react"
import { Socket } from "socket.io-client"

interface ISocket {
    socket: Socket
    setSocket: (d: Socket) => void
    current: ApiVideo
    queue: ApiVideo[]
    isConnected: boolean
    isReady: boolean
    isInvalidRoom: boolean
    roomData: ApiRoomData
}

const SocketContext = createContext<ISocket>({
    socket: null,
    setSocket: null,
    current: null,
    isConnected: false,
    isReady: false,
    isInvalidRoom: false,
    roomData: null,
    queue: [],
})

export default SocketContext

export const useSocket = () => useContext(SocketContext)
