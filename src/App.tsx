import { AnimatePresence, MotionProps, motion } from "framer-motion"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import useMeasure from "react-use-measure"
import styled from "styled-components"
import "./App.css"
import Card, { ErrorCard } from "./components/Card"
import { useSocket } from "./hooks/useSocket"

const Container = styled(motion.div)`
    position: fixed;
    --padding: 2rem;
    bottom: var(--padding);
    left: var(--padding);
    right: var(--padding);
    background-color: var(--background);
    border-radius: 2rem;
    width: calc(100% - calc(var(--padding) * 2));

    box-shadow: 0px 0px 15px 5px rgb(1, 1, 1, 0.5);
    overflow: hidden;

    .padding-wrapper {
        display: flex;
        gap: 2rem;
        min-height: 30rem;
        padding: 3.5rem;
    }

    .thumb {
        aspect-ratio: 1/1;
        object-fit: cover;
        border-radius: 1.5rem;
        height: 30rem;
    }

    .vertical {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: 100%;
    }

    p {
        font-size: 6rem;
    }

    p.page-title {
        display: flex;
        align-items: center;
        font-size: 4rem;

        span.icon {
            font-size: 5rem;
        }
    }

    .progress-bar {
        margin-top: 1rem;
        display: flex;
        align-items: center;
        min-height: 3rem;
        padding: 0.75rem 1rem;
        padding-left: 1.5rem;
        gap: 1rem;
        background-color: var(--background-light);
        border-radius: 3rem;
        flex-wrap: nowrap;
        overflow: hidden;

        p {
            display: flex;
            font-size: 3rem;
            color: var(--foreground);
            font-weight: 500;
            min-width: 20rem;
            flex-grow: 0;
            text-overflow: clip;
            overflow: hidden;
            white-space: nowrap;
        }

        .bar {
            background-color: var(--foreground);
            height: 100%;
            border-radius: 2rem;
            min-width: 4rem;
        }
    }

    .horizontal {
        display: flex;
        gap: 1.5rem;

        p {
            display: flex;
            align-items: center;
            font-size: 4rem;
        }
    }

    span.icon {
        font-size: 4rem;
        margin-right: 1rem;
    }

    span.sync {
        background: linear-gradient(318deg, #ff80bf, #9580ff);
        background-size: 150% 150%;
        -webkit-animation: BackgroundMove 5s infinite;
        -moz-animation: BackgroundMove 5s infinite;
        animation: BackgroundMove 5s infinite;
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-left: 1rem;
        font-weight: 700;
    }

    .url-wrapper {
        position: absolute;
        bottom: 1rem;
        font-size: 4rem;
        display: flex;
    }
`

let interval: any = null

function App() {
    const [time, setTime] = useState(0)
    const { current, isInvalidRoom, isReady, queue } = useSocket()
    const { t } = useTranslation()

    const [ref, { height }] = useMeasure()

    useEffect(() => {
        clearInterval(interval)
        if (!current) return
        setTime(current.time)

        interval = setInterval(() => {
            setTime((time) => (time += 100))
        }, 100)

        return () => {
            clearInterval(interval)
        }
    }, [current])

    const percentage = (time / (current?.duration || 0)) * 100

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

    if (isInvalidRoom)
        return (
            <Container>
                <div className="padding-wrapper">
                    <ErrorCard error={t("card.invalid_room")} />
                </div>
            </Container>
        )

    if (!isReady) return

    return (
        <Container
            animate={{ height: height || 0 }}
            transition={{ ease: "easeOut", duration: 0.5, delay: 0 }}
        >
            <div ref={ref} className="padding-wrapper">
                <AnimatePresence mode="wait">
                    {current && (
                        <motion.img
                            className="thumb"
                            src={`https://i.ytimg.com/vi/${current.id}/mqdefault.jpg`}
                            key={current.uuid}
                            {...fadeInOut}
                        ></motion.img>
                    )}
                </AnimatePresence>
                <AnimatePresence mode="wait">
                    {current && (
                        <Card
                            current={current}
                            percentage={percentage}
                            queue={queue}
                            time={time}
                            key={current.uuid}
                        />
                    )}
                </AnimatePresence>
                <AnimatePresence>
                    {!current && (
                        <ErrorCard
                            showRooName={true}
                            error={t("card.no_video_playing")}
                        />
                    )}
                </AnimatePresence>

                <span
                    className="icon"
                    style={{ position: "fixed", opacity: 0 }}
                >
                    headphones
                </span>
            </div>
        </Container>
    )
}

export default App
