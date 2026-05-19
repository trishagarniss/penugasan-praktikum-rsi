"use client";

import React, { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Event {
  id: number;
  name: string;
  description: string;
  quota: number;
  started_at: string;
  ended_at: string;
}

const UserEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [registeringId, setRegisteringId] = useState<number | null>(null);
  const [registeredEvent, setRegisteredEvent] = useState<Event | null>(null);

  // 1. Fungsi GET Data Events
  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/events`);
      if (!response.ok) throw new Error('Gagal mengambil data dari server');
      
      const result = await response.json();
      setEvents(result.data || result);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filteredEvents = events.filter(event => 
    event.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 2. Fungsi POST Registrasi Event
  const handleRegister = async (event: Event) => {
    setRegisteringId(event.id);
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Silakan login terlebih dahulu untuk mendaftar.");
      setRegisteringId(null);
      return;
    }

    // Decode JWT untuk dapat user_id (payload ada di bagian tengah)
    let userId: number | null = null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      userId = payload.user_id;
    } catch {
      alert("Token tidak valid, silakan login ulang.");
      setRegisteringId(null);
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/registrations/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ user_id: userId, event_id: event.id })
      });

      if (!response.ok) throw new Error('Gagal melakukan pendaftaran');

      setRegisteredEvent(event);
      
    } catch (error) {
      console.error("Error registering:", error);
      alert("Gagal melakukan registrasi, silakan coba lagi.");
    } finally {
      setRegisteringId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 relative">
      <div className="bg-indigo-600 text-white py-16 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Temukan Event Menarik</h1>
          <p className="text-indigo-100 max-w-2xl mx-auto text-lg">Jelajahi berbagai kegiatan, workshop, dan kompetisi.</p>
          <div className="max-w-xl mx-auto mt-8 relative">
            <input type="text" placeholder="Cari nama event..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full h-12 rounded-full pl-6 pr-4 border-none text-slate-900 shadow-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none text-sm" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold tracking-tight">Event Mendatang</h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
            <p className="text-slate-500">Tidak ada event yang ditemukan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div key={event.id} className="flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="h-32 bg-slate-100 border-b flex items-center justify-center">
                  <span className="text-slate-400 text-xs uppercase tracking-widest font-semibold">{event.quota} Kuota</span>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <span className="inline-flex rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
                      {new Date(event.started_at) > new Date() ? 'Upcoming' : 'Berlangsung'}
                    </span>
                    <span className="text-sm font-medium text-slate-500">{new Date(event.started_at).toLocaleDateString('id-ID')}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{event.name}</h3>
                  <p className="text-sm text-slate-600 line-clamp-3 mb-6 flex-1">{event.description || 'Belum ada deskripsi.'}</p>
                  
                  <button 
                    onClick={() => handleRegister(event)}
                    disabled={registeringId === event.id}
                    className="w-full rounded-md text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 h-10 px-4 py-2 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {registeringId === event.id ? (
                      <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Memproses...</>
                    ) : "Daftar Sekarang"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {registeredEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-8 max-w-sm w-full text-center shadow-2xl">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Registrasi Berhasil!</h3>
            <p className="text-sm text-slate-500 mb-8">Kamu telah berhasil terdaftar pada event <span className="font-semibold text-slate-900">&ldquo;{registeredEvent.name}&rdquo;</span>.</p>
            <button onClick={() => setRegisteredEvent(null)} className="w-full bg-indigo-600 text-white rounded-md h-11 font-medium">Tutup</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserEvents;