'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Send, User, Clock, CheckCircle2, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { pt } from 'date-fns/locale'
import { toast } from 'sonner'

interface Conversation {
    id: string
    customer_name?: string
    last_message_at: string
    status: 'active' | 'closed'
    unread_count?: number // Calculated locally
}

interface Message {
    id: string
    content: string
    sender_type: 'customer' | 'admin'
    created_at: string
}

export function AdminChatInterface() {
    const [conversations, setConversations] = useState<Conversation[]>([])
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState('')
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const supabase = createClient() as any

    // Fetch conversations
    useEffect(() => {
        fetchConversations()

        const channel = supabase
            .channel('admin-chat-list')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'chat_conversations' },
                () => fetchConversations()
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    // Fetch messages for selected conversation
    useEffect(() => {
        if (!selectedConversationId) return

        fetchMessages(selectedConversationId)

        const channel = supabase
            .channel(`admin-chat:${selectedConversationId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'chat_messages',
                    filter: `conversation_id=eq.${selectedConversationId}`
                },
                (payload: any) => {
                    setMessages(prev => [...prev, payload.new])
                    // Scroll to bottom
                    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [selectedConversationId])

    const fetchConversations = async () => {
        const { data, error } = await supabase
            .from('chat_conversations')
            .select('*')
            .order('last_message_at', { ascending: false })

        if (data) {
            setConversations(data)
        }
    }

    const fetchMessages = async (id: string) => {
        const { data, error } = await supabase
            .from('chat_messages')
            .select('*')
            .eq('conversation_id', id)
            .order('created_at', { ascending: true })

        if (data) {
            setMessages(data)
            setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
        }
    }

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim() || !selectedConversationId) return

        const content = newMessage.trim()
        setNewMessage('')

        try {
            const { error } = await supabase
                .from('chat_messages')
                .insert({
                    conversation_id: selectedConversationId,
                    content: content,
                    sender_type: 'admin'
                })

            if (error) throw error
        } catch (error) {
            console.error('Error sending message:', error)
            toast.error('Erro ao enviar mensagem')
        }
    }

    const handleCloseConversation = async () => {
        if (!selectedConversationId) return

        try {
            const { error } = await supabase
                .from('chat_conversations')
                .update({ status: 'closed' })
                .eq('id', selectedConversationId)

            if (error) throw error
            toast.success('Conversa marcada como concluída')
            fetchConversations()
        } catch (error) {
            toast.error('Erro ao fechar conversa')
        }
    }

    const selectedConversation = conversations.find(c => c.id === selectedConversationId)

    return (
        <div className="flex h-[calc(100vh-120px)] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Sidebar List */}
            <div className="w-80 border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <h2 className="font-semibold text-gray-700">Conversas</h2>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {conversations.length === 0 ? (
                        <div className="p-4 text-center text-gray-500 text-sm">
                            Nenhuma conversa ativa.
                        </div>
                    ) : (
                        conversations.map(conv => (
                            <button
                                key={conv.id}
                                onClick={() => setSelectedConversationId(conv.id)}
                                className={cn(
                                    "w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors flex gap-3",
                                    selectedConversationId === conv.id && "bg-blue-50 hover:bg-blue-50"
                                )}
                            >
                                <Avatar className="h-10 w-10">
                                    <AvatarFallback className="bg-primary-100 text-primary-700">
                                        <User className="w-5 h-5" />
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-medium text-gray-900 truncate">
                                            {conv.customer_name || 'Cliente Visitante'}
                                        </span>
                                        <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                                            {format(new Date(conv.last_message_at), 'HH:mm', { locale: pt })}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-500 truncate">
                                            {conv.status === 'active' ? 'Ativo' : 'Fechado'}
                                        </span>
                                        {conv.status === 'active' && (
                                            <div className="w-2 h-2 rounded-full bg-green-500" />
                                        )}
                                    </div>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-gray-50/50">
                {selectedConversationId ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                    <AvatarFallback className="bg-gold text-white">
                                        {selectedConversation?.customer_name?.[0] || <User className="w-5 h-5" />}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-medium text-gray-900">
                                        {selectedConversation?.customer_name || 'Cliente Visitante'}
                                    </h3>
                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        Iniciado a {selectedConversation && format(new Date(selectedConversation.last_message_at), "d 'de' MMMM", { locale: pt })}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {selectedConversation?.status === 'active' && (
                                    <Button variant="outline" size="sm" onClick={handleCloseConversation} className="gap-2">
                                        <CheckCircle2 className="w-4 h-4" />
                                        Marcar como Resolvido
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={cn(
                                        "flex w-full",
                                        msg.sender_type === 'admin' ? "justify-end" : "justify-start"
                                    )}
                                >
                                    <div className={cn(
                                        "max-w-[70%] rounded-2xl px-4 py-3 text-sm shadow-sm",
                                        msg.sender_type === 'admin'
                                            ? "bg-primary-900 text-white rounded-br-none"
                                            : "bg-white border border-gray-200 text-gray-800 rounded-bl-none"
                                    )}>
                                        {msg.content}
                                        <div className={cn(
                                            "text-[10px] mt-1 text-right opacity-70",
                                            msg.sender_type === 'admin' ? "text-white" : "text-gray-400"
                                        )}>
                                            {format(new Date(msg.created_at), 'HH:mm')}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 bg-white border-t border-gray-200">
                            <form onSubmit={handleSendMessage} className="flex gap-3">
                                <Input
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Escreva uma resposta..."
                                    className="flex-1"
                                />
                                <Button type="submit" variant="gold" disabled={!newMessage.trim()}>
                                    <Send className="w-4 h-4 mr-2" />
                                    Enviar
                                </Button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                        <MessageCircle className="w-16 h-16 mb-4 opacity-20" />
                        <p>Selecione uma conversa para começar</p>
                    </div>
                )}
            </div>
        </div>
    )
}
