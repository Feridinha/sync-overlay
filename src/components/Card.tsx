import { MotionProps, motion } from "framer-motion"
import Title from "./Title"
import { ApiVideo } from "@types"
import { useTranslation } from "react-i18next"

function formatTime(milliseconds: number) {
    milliseconds %= 3600000
    const minutes = Math.floor(milliseconds / 60000) // 1 minute = 60000 milliseconds
    milliseconds %= 60000
    const seconds = Math.floor(milliseconds / 1000) // 1 second = 1000 milliseconds

    // Format the time components with leading zeros
    const formattedMinutes = minutes.toString().padStart(2, "0")
    const formattedSeconds = seconds.toString().padStart(2, "0")

    return `${formattedMinutes}:${formattedSeconds}`
}

const plural = (target: number) => {
    if (target === 0 || target >= 2) return "s"
    return ""
}

const fadeInOut: MotionProps = {
    initial: {
        opacity: 0,
        y: 250,
        filter: "blur(15px)",
    },
    animate: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
    },
    exit: {
        opacity: 0,
        y: -250,
        filter: "blur(15px)",
    },
    transition: {
        ease: "easeInOut",
        duration: 0.5,
    },
}

const Card = ({
    current,
    percentage,
    queue,
    time,
}: {
    current: ApiVideo
    percentage: number
    queue: ApiVideo[]
    time: number
}) => {
    if (!current) return
    const { t } = useTranslation()
    return (
        <motion.div className="vertical" {...fadeInOut}>
            <motion.p className="page-title">
                <span className="icon">play_arrow</span>
                {t("card.playing_right_now")}
                <span className="sync">sync</span>:
            </motion.p>
            <Title title={current.title} />
            <div className="horizontal">
                <p style={{ color: current.user.color }}>
                    <span className="icon">headphones</span>
                    {current.user.name}
                </p>
                <motion.p>
                    <span className="icon">queue_music</span>
                    {t("card.queue_size", { count: queue.length })}
                </motion.p>
            </div>
            <div className="progress-bar">
                <p>
                    {formatTime(time)} / {formatTime(current.duration)}
                </p>

                <motion.div
                    animate={{ width: `calc(${percentage || 0}% - 20rem)` }}
                    transition={{ duration: 0.3 }}
                    className="bar"
                ></motion.div>
            </div>
        </motion.div>
    )
}

export default Card
const getRoomName = () => window.location.pathname.split("/")[1]
export const ErrorCard = ({
    error,
    showRooName,
}: {
    error: string
    showRooName?: boolean
}) => {
    return (
        <motion.div
            style={{
                position: "absolute",
                height: "100%",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                inset: 0,
            }}
            {...fadeInOut}
        >
            <motion.p
                style={{
                    fontSize: "7.5rem",
                }}
            >
                {error}
            </motion.p>
            <div className="url-wrapper">
                <motion.span className="sync">
                    sync.feridinha.com{showRooName && `/${getRoomName()}`}
                </motion.span>
            </div>
        </motion.div>
    )
}
