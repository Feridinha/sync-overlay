import { ApiRoomData, ApiVideo } from "@types"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import * as socketio from "socket.io-client"
import SocketContext from "."
const getRoomName = () => window.location.pathname.split("/")[1]

const SocketProvider = ({ children }: { children: JSX.Element }) => {
    const room = getRoomName()
    const [socket, setSocket] = useState<socketio.Socket>(null)
    const [isConnected, setIsConnected] = useState(false)
    const [current, setCurrent] = useState<ApiVideo | null>(null)
    const [isInvalidRoom, setInvalidRoom] = useState(!room || room.length < 0)
    const [queue, setQueue] = useState<ApiVideo[]>([])
    const [isReady, setIsReady] = useState(false)
    const [roomData, setRoomData] = useState<ApiRoomData>(null)
    const { i18n } = useTranslation()

    useEffect(() => {
        if (socket) return
        const io = socketio.connect(process.env.API_PATH, {
            transports: ["websocket"],
            autoConnect: false,
            extraHeaders: {
                "ngrok-skip-browser-warning": "any",
            },
        })

        io.on("disconnect", () => setIsConnected(false))
        io.on("connect", () => setIsConnected(true))
        io.connect()
        setSocket(io)
    }, [])

    useEffect(() => {
        if (!socket) return
        socket.on("current", (data: ApiVideo) => {
            setCurrent(data)
            setIsReady(true)
        })

        socket.on("skip", () => {
            setCurrent(null)
        })

        socket.on("seek", (data: ApiVideo) => {
            setCurrent(data)
        })

        socket.on("ready", () => {
            socket.emit("get-current")
            socket.emit("get-queue")
            socket.emit("get-room-data")
        })

        socket.on("invalid-room", () => {
            setInvalidRoom(true)
        })

        socket.on("queue", setQueue)
        socket.on("queue-add", (data: ApiVideo) => {
            setQueue((d) => [...d, data])
        })

        socket.on("queue-remove", (uuid: string) => {
            setQueue((queue) => queue.filter((v) => v.uuid !== uuid))
        })

        socket.on("reset-queue", () => {
            setQueue([])
            setCurrent(null)
        })

        socket.on("room-data", (data: ApiRoomData) => {
            setRoomData(data)
            i18n.changeLanguage(data.config.language)
        })

        socket.emit("enter-room", room)
        console.log("Entrando", room)
    }, [socket])

    const value = {
        roomData,
        socket,
        setSocket,
        current,
        isConnected,
        isInvalidRoom,
        isReady,
        queue,
    }

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    )
}

export default SocketProvider
