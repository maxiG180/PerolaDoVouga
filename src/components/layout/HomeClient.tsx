'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

// Register GSAP plugins
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollToPlugin)
}

interface HomeClientProps {
    children: React.ReactNode
}

export function HomeClient({ children }: HomeClientProps) {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // Entrance animations
        const ctx = gsap.context(() => {
            // Hero animations
            gsap.from('.gsap-hero-title', {
                y: 30,
                opacity: 0,
                duration: 1,
                ease: 'power3.out',
                delay: 0.2
            })

            gsap.from('.gsap-hero-text', {
                y: 20,
                opacity: 0,
                duration: 1,
                ease: 'power3.out',
                delay: 0.4
            })

            gsap.from('.gsap-hero-btns', {
                y: 20,
                opacity: 0,
                duration: 1,
                ease: 'power3.out',
                delay: 0.6
            })

            gsap.from('.gsap-hero-image', {
                scale: 0.95,
                opacity: 0,
                duration: 1.2,
                ease: 'power3.out',
                delay: 0.3
            })
        }, containerRef)

        return () => ctx.revert()
    }, [])

    const handleScrollToMenu = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault()
        const targetId = e.currentTarget.getAttribute('href')
        if (targetId) {
            gsap.to(window, {
                duration: 1,
                scrollTo: {
                    y: targetId,
                    offsetY: 80
                },
                ease: 'power3.inOut'
            })
        }
    }

    // Effect to attach scroll handlers to all anchor links with hash
    useEffect(() => {
        const anchors = document.querySelectorAll('a[href^="#"]')
        anchors.forEach(anchor => {
            anchor.addEventListener('click', (e: any) => {
                e.preventDefault()
                const target = document.querySelector(anchor.getAttribute('href') || '')
                if (target) {
                    gsap.to(window, {
                        duration: 1.2,
                        scrollTo: {
                            y: target,
                            offsetY: 80
                        },
                        ease: 'power4.inOut'
                    })
                }
            })
        })
    }, [])

    return (
        <div ref={containerRef} className="contents">
            {children}
        </div>
    )
}
