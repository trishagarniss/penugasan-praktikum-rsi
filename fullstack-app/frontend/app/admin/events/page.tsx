"use client";

import React, { useState, useEffect } from 'react';

// KONFIGURASI API (Ganti URL ini saat backend sudah siap)
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const AdminEvents = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false); // State untuk loading saat POST

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    nama_event: '',
    tanggal: '',
    lokasi: '',
    status: 'Upcoming'
  });

  // 1. Fungsi GET Data Events dari Backend
  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/events`);
      if (!response.ok) throw new Error('Gagal mengambil data dari server');
      
      const result = await response.json();
      // Asumsi backend mengembalikan format: { data: [...] } atau array langsung [...]
      setEvents(result.data || result); 
    } catch (error) {
      console.error("Error fetching events:", error);
      // Opsional: Tampilkan toast/alert error di sini
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // 2. Fungsi POST Data Event Baru ke Backend
  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${API_URL}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}` // Buka komentar ini jika butuh token login temanmu
        },
        body: JSON.stringify(newEvent),
      });

      if (!response.ok) throw new Error('Gagal menyimpan event');

      // Jika sukses: Tutup modal, reset form, dan refresh tabel
      setIsModalOpen(false);
      setNewEvent({ nama_event: '', tanggal: '', lokasi: '', status: 'Upcoming' });
      fetchEvents(); 
      
    } catch (error) {
      console.error("Error saving event:", error);
      alert("Terjadi kesalahan saat menyimpan event.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900 relative">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Management Events</h1>
            <p className="text-slate-500 text-sm mt-1">Kelola daftar acara, jadwal, dan lokasi di sini.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <input type="text" placeholder="Cari event..." className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-600" />
            </div>
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-slate-200 bg-white hover:bg-slate-100 h-10 px-4 py-2 shadow-sm">
              Export Excel
            </button>
            <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 h-10 px-4 py-2 shadow-sm">
              + Add Event
            </button>
          </div>
        </div>

        {/* Tabel */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50/50 border-b border-slate-200">
                <tr>
                  <th className="h-12 px-6 font-medium">No</th>
                  <th className="h-12 px-6 font-medium">Nama Event</th>
                  <th className="h-12 px-6 font-medium">Tanggal</th>
                  <th className="h-12 px-6 font-medium">Lokasi</th>
                  <th className="h-12 px-6 font-medium text-center">Status</th>
                  <th className="h-12 px-6 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {isLoading ? (
                  <tr><td colSpan={6} className="h-32 text-center text-slate-400">Loading data from database...</td></tr>
                ) : events.length === 0 ? (
                  <tr><td colSpan={6} className="h-32 text-center text-slate-400">Belum ada event ditemukan.</td></tr>
                ) : (
                  events.map((event, index) => (
                    <tr key={event.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-6 text-slate-500">{index + 1}</td>
                      <td className="p-6 font-medium">{event.nama_event}</td>
                      <td className="p-6 text-slate-500">{event.tanggal}</td>
                      <td className="p-6 text-slate-500">{event.lokasi}</td>
                      <td className="p-6 text-center">
                        <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-xs font-semibold">{event.status}</span>
                      </td>
                      <td className="p-6 text-right space-x-3">
                        <button className="text-sm font-medium text-slate-500 hover:text-indigo-600">Edit</button>
                        <button className="text-sm font-medium text-slate-500 hover:text-red-600">Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50/30 gap-4">
            <div className="flex items-center gap-6">
              <p className="text-sm text-slate-500">Total: <span className="font-medium text-slate-900">{events.length}</span> event</p>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL Add Event */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-xl border border-slate-200 shadow-2xl">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-semibold text-slate-900">Add New Event</h2>
            </div>
            <form onSubmit={handleSaveEvent}>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nama Event</label>
                  <input required type="text" className="flex h-10 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-indigo-600" value={newEvent.nama_event} onChange={(e) => setNewEvent({...newEvent, nama_event: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tanggal</label>
                    <input required type="date" className="flex h-10 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-indigo-600" value={newEvent.tanggal} onChange={(e) => setNewEvent({...newEvent, tanggal: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <select className="flex h-10 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-indigo-600" value={newEvent.status} onChange={(e) => setNewEvent({...newEvent, status: e.target.value})}>
                      <option value="Upcoming">Upcoming</option>
                      <option value="Planning">Planning</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Lokasi</label>
                  <input required type="text" className="flex h-10 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-indigo-600" value={newEvent.lokasi} onChange={(e) => setNewEvent({...newEvent, lokasi: e.target.value})} />
                </div>
              </div>
              <div className="p-6 border-t flex justify-end gap-3 bg-slate-50/50 rounded-b-xl">
                <button type="button" onClick={() => setIsModalOpen(false)} disabled={isSubmitting} className="px-4 py-2 text-sm font-medium border bg-white rounded-md hover:bg-slate-100 disabled:opacity-50">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 min-w-[100px]">
                  {isSubmitting ? 'Menyimpan...' : 'Save Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEvents;