'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageCircle, X, Send } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { usePathname } from 'next/navigation'

interface Message {
    id: string
    content: string
    sender_type: 'customer' | 'admin'
    created_at: string
}

export function ChatWidget() {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState('')
    const [conversationId, setConversationId] = useState<string | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const supabase = createClient() as any

    // Hide on admin pages
    if (pathname && pathname.includes('/admin')) return null

    // Load conversation from local storage on mount
    useEffect(() => {
        const storedId = localStorage.getItem('pdv_chat_conversation_id')
        if (storedId) {
            setConversationId(storedId)
            fetchMessages(storedId)
        }
    }, [])

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isOpen])

    // Realtime subscription
    useEffect(() => {
        if (!conversationId) return

        const channel = supabase
            .channel(`chat:${conversationId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'chat_messages',
                    filter: `conversation_id=eq.${conversationId}`
                },
                (payload: any) => {
                    const newMsg = payload.new as Message
                    setMessages(prev => [...prev, newMsg])
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [conversationId, supabase])

    const fetchMessages = async (id: string) => {
        const { data } = await supabase
            .from('chat_messages')
            .select('*')
            .eq('conversation_id', id)
            .order('created_at', { ascending: true })

        if (data) {
            setMessages(data)
        }
    }

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim()) return

        const content = newMessage.trim()
        setNewMessage('')

        try {
            let currentConversationId = conversationId

            if (!currentConversationId) {
                const { data: conv, error: convError } = await supabase
                    .from('chat_conversations')
                    .insert({ status: 'active' })
                    .select()
                    .single()

                if (convError) throw convError

                currentConversationId = conv.id
                setConversationId(conv.id)
                localStorage.setItem('pdv_chat_conversation_id', conv.id)
            }

            const { error: msgError } = await supabase
                .from('chat_messages')
                .insert({
                    conversation_id: currentConversationId,
                    content: content,
                    sender_type: 'customer'
                })

            if (msgError) throw msgError

            if (!conversationId) {
                fetchMessages(currentConversationId!)
            }

            fetch('/api/chat/notify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: content,
                    conversationId: currentConversationId
                })
            }).catch(err => console.error('Failed to send notification:', err))

        } catch (error) {
            console.error('Error sending message:', error)
            toast.error('Erro ao enviar mensagem')
        }
    }

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-4">
            {isOpen && (
                <Card className="w-[350px] h-[500px] flex flex-col shadow-2xl animate-in slide-in-from-bottom-10 fade-in duration-300 overflow-hidden border-2 border-gray-200">
                    <div
                        className="p-4 flex flex-row justify-between items-center"
                        style={{ backgroundColor: '#755F40', color: 'white' }}
                    >
                        <div>
                            <h3 className="text-lg font-serif font-semibold" style={{ color: 'white' }}>Pérola do Vouga</h3>
                            <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>Suporte Online</p>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="hover:bg-white/20 p-2 rounded transition-colors"
                            style={{ color: 'white' }}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.length === 0 ? (
                            <div className="text-center text-gray-600 text-sm py-8">
                                <p className="font-medium">Olá! Como podemos ajudar?</p>
                                <p className="text-xs mt-2 text-gray-500">Tentamos sempre responder o mais rápido possível.</p>
                            </div>
                        ) : (
                            messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={cn(
                                        "flex w-full",
                                        msg.sender_type === 'customer' ? "justify-end" : "justify-start"
                                    )}
                                >
                                    <div className={cn(
                                        "max-w-[80%] rounded-2xl px-4 py-2 text-sm",
                                        msg.sender_type === 'customer'
                                            ? "bg-[#755F40] text-white rounded-br-none"
                                            : "bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm"
                                    )}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-4 bg-white border-t">
                        <form onSubmit={handleSendMessage} className="flex gap-2">
                            <Input
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Escreva uma mensagem..."
                                className="flex-1"
                            />
                            <button
                                type="submit"
                                disabled={!newMessage.trim()}
                                className="h-10 w-10 rounded-md bg-[#D4AF37] hover:bg-[#B39226] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                            >
                                <Send className="w-4 h-4 text-white" />
                            </button>
                        </form>
                    </div>
                </Card>
            )}

            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "h-14 w-14 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95",
                    isOpen ? "bg-gray-600 hover:bg-gray-700" : "bg-[#D4AF37] hover:bg-[#B39226]"
                )}
                style={{ zIndex: 9999 }}
                aria-label="Chat de Suporte"
            >
                {isOpen ? (
                    <X className="w-6 h-6 text-white" />
                ) : (
                    <MessageCircle className="w-6 h-6 text-white" />
                )}
            </button>
        </div>
    )
}
