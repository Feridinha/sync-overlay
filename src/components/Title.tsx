import { styled } from "styled-components"
import { motion, TargetAndTransition } from "framer-motion"
import { useEffect, useRef, useState } from "react"

const Container = styled.div`
    position: relative;
    width: 100%;
    overflow: hidden;
    font-size: 6rem;
    min-height: 1.5em;
    div {
        position: absolute;
        display: flex;
        word-break: keep-all;
        word-wrap: nowrap;
        white-space: nowrap;
        width: fit-content;
        padding-right: 1em;
    }
`

const Title = ({ title }: { title: string }) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const children1 = useRef<HTMLDivElement>(null)
    const [isOverflowing, setOverflowing] = useState(false)

    useEffect(() => {
        if (!children1.current || !containerRef.current) return
        const children1Size = window.getComputedStyle(children1.current)
        const containerSize = window.getComputedStyle(containerRef.current)
        const sizeParent = parseInt(containerSize.width)
        const sizeChildren1 = parseInt(children1Size.width)

        console.log(sizeParent, sizeChildren1)
        if (sizeChildren1 >= sizeParent) {
            console.log("Overflow")
            setOverflowing(true)
        }
    }, [children1, containerRef, title])

    const animation1: TargetAndTransition = isOverflowing
        ? {
              x: ["0%", "-100%"],
              transition: {
                  repeat: Infinity,
                  ease: "linear",
                  duration: 25,
              },
          }
        : {}
    const animation2: TargetAndTransition = isOverflowing
        ? {
              ...animation1,
              x: ["100%", "0%"],
          }
        : {}

    return (
        <Container ref={containerRef}>
            <motion.div animate={animation1} ref={children1}>
                {title}
            </motion.div>
            <motion.div animate={animation2}>{title}</motion.div>
        </Container>
    )
}

export default Title
