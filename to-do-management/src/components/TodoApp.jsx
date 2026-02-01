"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, CheckCircle2, Circle, ListTodo, Calendar, Trash, LogOut, User } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import Auth from "./Auth";

const BackgroundDecoration = () => {
    const [mounted, setMounted] = useState(false);
    const [positions, setPositions] = useState([]);
    const emojis = ["📚", "📖", "📝", "🎓", "💻", "🧠", "🎒", "✏️", "🎨", "🔬"];

    useEffect(() => {
        setMounted(true);
        const newPositions = [...Array(15)].map(() => ({
            left: Math.random() * 90 + 5 + "vw",
            top: Math.random() * 90 + 5 + "vh",
            emoji: emojis[Math.floor(Math.random() * emojis.length)],
            delay: Math.random() * 5,
            duration: 10 + Math.random() * 15,
            scale: 0.5 + Math.random() * 1
        }));
        setPositions(newPositions);
    }, []);

    if (!mounted) return null;

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {positions.map((pos, i) => (
                <motion.div
                    key={i}
                    initial={{
                        opacity: 0,
                        scale: 0,
                        x: 0,
                        y: 0
                    }}
                    animate={{
                        opacity: [0, 0.4, 0.4, 0],
                        scale: [pos.scale, pos.scale * 1.2, pos.scale],
                        y: [0, -30, 30, 0],
                        x: [0, 20, -20, 0]
                    }}
                    transition={{
                        duration: pos.duration,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: pos.delay
                    }}
                    className="absolute text-5xl select-none"
                    style={{
                        left: pos.left,
                        top: pos.top,
                    }}
                >
                    {pos.emoji}
                </motion.div>
            ))}
        </div>
    );
};

export default function TodoApp() {
    const [session, setSession] = useState(null);
    const [todos, setTodos] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [deadline, setDeadline] = useState("");
    const [status, setStatus] = useState("Pending");
    const [isLoaded, setIsLoaded] = useState(false);
    const [showDashboard, setShowDashboard] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    // Fetch todos from Supabase when session is available
    useEffect(() => {
        if (session) {
            fetchTodos();
        } else {
            setTodos([]);
        }
    }, [session]);

    const fetchTodos = async () => {
        try {
            const { data, error } = await supabase
                .from("todos")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setTodos(data || []);
        } catch (error) {
            console.error("Error fetching todos:", error.message);
        } finally {
            setIsLoaded(true);
        }
    };

    const addTodo = async (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        try {
            const { data, error } = await supabase
                .from("todos")
                .insert([
                    {
                        text: inputValue.trim(), // We use 'text' now. If you didn't rename the column, change this to 'todo'
                        user_id: session.user.id,
                        completed: status === "Completed",
                        deadline: deadline || null,
                        status: status,
                    },
                ])
                .select();

            if (error) {
                console.error("Supabase Error Details:", error);
                throw error;
            }

            if (data && data.length > 0) {
                setTodos([data[0], ...todos]);
                setInputValue("");
                setDeadline("");
                setStatus("Pending");
            }
        } catch (error) {
            console.error("Error adding todo:", error.message);
            alert(`Error adding todo: ${error.message} \n\nCheck console for details.`);
        }
    };

    const updateTodoStatus = async (id, newStatus) => {
        try {
            const { error } = await supabase
                .from("todos")
                .update({
                    status: newStatus,
                    completed: newStatus === "Completed"
                })
                .eq("id", id);

            if (error) throw error;
            setTodos(
                todos.map((todo) =>
                    todo.id === id ? { ...todo, status: newStatus, completed: newStatus === "Completed" } : todo
                )
            );
        } catch (error) {
            console.error("Error updating status:", error.message);
        }
    };

    const toggleTodo = async (id, currentStatus) => {
        const newStatus = !currentStatus ? "Completed" : "Pending";
        await updateTodoStatus(id, newStatus);
    };

    const deleteTodo = async (id) => {
        try {
            const { error } = await supabase.from("todos").delete().eq("id", id);
            if (error) throw error;
            setTodos(todos.filter((todo) => todo.id !== id));
        } catch (error) {
            console.error("Error deleting todo:", error.message);
        }
    };

    const clearCompleted = async () => {
        try {
            const { error } = await supabase
                .from("todos")
                .delete()
                .eq("completed", true);
            if (error) throw error;
            setTodos(todos.filter((todo) => !todo.completed));
        } catch (error) {
            console.error("Error clearing completed:", error.message);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setShowDashboard(false);
    };

    const completedCount = todos.filter((t) => t.completed).length;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f0f9ff] relative overflow-hidden">
                <BackgroundDecoration />
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                    <Image src="/logo.png" alt="Logo" width={60} height={30} className="opacity-20" />
                </motion.div>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="relative min-h-screen bg-[#f0f9ff] overflow-hidden">
                <BackgroundDecoration />
                <Auth />
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-[#f0f9ff] text-slate-900 flex flex-col items-center overflow-x-hidden relative">
            <BackgroundDecoration />
            {/* User Status Bar */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-xl w-full mb-8 flex items-center justify-between px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full border border-slate-200"
            >
                <div className="flex items-center space-x-2 text-slate-600 text-sm">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                        <User size={16} />
                    </div>
                    <span className="font-medium truncate max-w-[150px]">{session.user.email}</span>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-slate-400 hover:text-red-500 transition-colors text-sm font-medium px-3 py-1 rounded-full hover:bg-red-50"
                >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                </button>
            </motion.div>

            <div className="max-w-xl mx-auto w-full">
                <AnimatePresence mode="wait">
                    {!showDashboard ? (
                        <motion.div
                            key="welcome"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9, y: -20 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="text-center space-y-8 mt-10"
                        >
                            <div className="space-y-4">
                                <motion.div
                                    initial={{ rotate: -10, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    transition={{ delay: 0.2, duration: 0.8 }}
                                    className="inline-block p-4 rounded-3xl bg-indigo-500/10 ring-1 ring-indigo-500/20 mb-2"
                                >
                                    <Image src="/logo.png" alt="Logo" width={180} height={90} priority />
                                </motion.div>
                                <h1 className="text-5xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 py-2">
                                    Welcome to <br /> Todo Management
                                </h1>
                                <p className="text-slate-600 text-lg max-w-md mx-auto leading-relaxed">
                                    The ultimate workspace to organize your life, track your progress, and achieve your goals with elegance.
                                </p>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowDashboard(true)}
                                className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-indigo-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 shadow-xl shadow-indigo-500/20 hover:bg-indigo-700"
                            >
                                Go to Dashboard
                                <svg
                                    className="w-5 h-5 ml-3 transition-transform group-hover:translate-x-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                                    ></path>
                                </svg>
                            </motion.button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="dashboard"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* Header Section */}
                            <header className="mb-10 text-center">
                                <div className="inline-flex items-center justify-center p-3 mb-4 rounded-2xl bg-indigo-500/10 text-indigo-600 ring-1 ring-indigo-500/20">
                                    <Image src="/logo.png" alt="Logo" width={100} height={50} />
                                </div>
                                <h1 className="text-4xl font-bold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-emerald-600">
                                    Quest Log
                                </h1>
                                <p className="text-slate-500">Conquer your day, one task at a time.</p>
                            </header>

                            {/* Input Section */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white p-6 rounded-2xl shadow-xl shadow-indigo-500/5 ring-1 ring-slate-200 mb-8"
                            >
                                <form onSubmit={addTodo} className="space-y-4">
                                    <div className="relative group">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-200 to-emerald-200 rounded-2xl blur opacity-30 group-focus-within:opacity-60 transition duration-1000"></div>
                                        <div className="relative flex items-center bg-slate-50 rounded-xl overflow-hidden ring-1 ring-slate-200 focus-within:ring-indigo-500/50">
                                            <input
                                                type="text"
                                                value={inputValue}
                                                onChange={(e) => setInputValue(e.target.value)}
                                                placeholder="What needs to be done?"
                                                className="w-full bg-transparent px-6 py-4 outline-none text-slate-900 placeholder-slate-400"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col space-y-1">
                                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Deadline</label>
                                            <input
                                                type="date"
                                                value={deadline}
                                                onChange={(e) => setDeadline(e.target.value)}
                                                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
                                            />
                                        </div>
                                        <div className="flex flex-col space-y-1">
                                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Status</label>
                                            <select
                                                value={status}
                                                onChange={(e) => setStatus(e.target.value)}
                                                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="In Progress">In Progress</option>
                                                <option value="Completed">Completed</option>
                                            </select>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 font-bold shadow-lg shadow-indigo-500/20"
                                    >
                                        <Plus size={20} />
                                        <span>Add Task to Log</span>
                                    </button>
                                </form>
                            </motion.div>

                            {/* Stats & Actions */}
                            {todos.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex items-center justify-between mb-6 px-2 text-sm text-slate-500 font-medium"
                                >
                                    <div className="flex items-center space-x-4">
                                        <span>{todos.length} Tasks</span>
                                        <span className="text-slate-300">•</span>
                                        <span className="text-emerald-600 font-semibold">{completedCount} Completed</span>
                                    </div>
                                    {completedCount > 0 && (
                                        <button
                                            onClick={clearCompleted}
                                            className="text-slate-400 hover:text-red-500 transition-colors flex items-center space-x-1"
                                        >
                                            <Trash size={14} />
                                            <span>Clear Done</span>
                                        </button>
                                    )}
                                </motion.div>
                            )}

                            {/* List Section */}
                            <div className="space-y-4">
                                <AnimatePresence mode="popLayout">
                                    {todos.map((todo) => (
                                        <motion.div
                                            key={todo.id}
                                            layout
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20, scale: 0.95 }}
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                            className={cn(
                                                "group flex flex-col p-5 rounded-2xl border transition-all duration-200 shadow-sm",
                                                todo.completed
                                                    ? "bg-emerald-50/30 border-emerald-100 opacity-80"
                                                    : "bg-white border-slate-200 hover:border-indigo-500/30 hover:shadow-md hover:shadow-indigo-500/5"
                                            )}
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-start space-x-4 flex-grow">
                                                    <button
                                                        onClick={() => toggleTodo(todo.id, todo.completed)}
                                                        className={cn(
                                                            "mt-1 flex-shrink-0 transition-colors duration-200",
                                                            todo.completed ? "text-emerald-500" : "text-slate-300 group-hover:text-slate-400"
                                                        )}
                                                    >
                                                        {todo.completed ? (
                                                            <CheckCircle2 size={24} />
                                                        ) : (
                                                            <Circle size={24} />
                                                        )}
                                                    </button>

                                                    <div className="flex-grow min-w-0">
                                                        <p
                                                            className={cn(
                                                                "text-[17px] transition-all duration-300 leading-tight font-semibold",
                                                                todo.completed
                                                                    ? "text-slate-400 line-through decoration-emerald-500/50"
                                                                    : "text-slate-800"
                                                            )}
                                                        >
                                                            {todo.text}
                                                        </p>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => deleteTodo(todo.id)}
                                                    className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 ml-2"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-[12px]">
                                                <div className="flex items-center space-x-4">
                                                    <div className="flex items-center text-slate-400 space-x-1.5">
                                                        <Calendar size={14} />
                                                        <span>{todo.deadline ? `Deadline: ${new Date(todo.deadline).toLocaleDateString()}` : "No deadline"}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center space-x-2">
                                                    <span className={cn(
                                                        "px-2.5 py-1 rounded-full font-bold uppercase tracking-wider text-[10px]",
                                                        todo.status === "Completed" ? "bg-emerald-100 text-emerald-700" :
                                                            todo.status === "In Progress" ? "bg-indigo-100 text-indigo-700" :
                                                                "bg-slate-100 text-slate-600"
                                                    )}>
                                                        {todo.status}
                                                    </span>

                                                    {todo.status !== "Completed" && (
                                                        <select
                                                            value={todo.status}
                                                            onChange={(e) => updateTodoStatus(todo.id, e.target.value)}
                                                            className="bg-transparent border-none text-indigo-600 font-bold focus:ring-0 cursor-pointer hover:bg-indigo-50 rounded px-1 transition-colors"
                                                        >
                                                            <option value="Pending">Pending</option>
                                                            <option value="In Progress">In Progress</option>
                                                            <option value="Completed">Completed</option>
                                                        </select>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>

                                {todos.length === 0 && isLoaded && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-20 bg-white shadow-sm rounded-2xl border border-dashed border-slate-200"
                                    >
                                        <div className="inline-flex items-center justify-center p-4 mb-4 rounded-full bg-slate-50 text-slate-300">
                                            <ListTodo size={40} strokeWidth={1} />
                                        </div>
                                        <p className="text-slate-400 font-medium">Your quest log is empty.</p>
                                        <p className="text-slate-300 text-sm mt-1">Add a task to begin your journey.</p>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Footer Design Element */}
            <footer className="mt-auto pt-20 text-center">
                <div className="h-px w-24 mx-auto bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-6" />
                <p className="text-slate-400 text-xs">
                    Built with precision for the modern achiever.
                </p>
            </footer>
        </div>
    );
}
