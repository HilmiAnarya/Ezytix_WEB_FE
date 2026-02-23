import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

const BookingSuccessPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <main className="flex-grow flex items-center justify-center px-4 py-16">
                <div className="max-w-xl w-full">
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden text-center relative border-t-4 border-red-600 p-8 md:p-12 animate-in zoom-in-95 duration-300">
                        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
                             <div className="absolute -top-10 -left-10 w-40 h-40 bg-red-200 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
                             <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-red-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
                        </div>
                        <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6 relative z-10 ring-8 ring-red-50 animate-bounce-slow">
                            <CheckCircle className="w-12 h-12 text-red-600" strokeWidth={3} />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
                            Pembayaran <span className="text-red-600">Berhasil!</span>
                        </h1>
                        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                            Status pembayaran Anda telah terkonfirmasi <strong>LUNAS (PAID)</strong>. E-tiket sedang diproses dan akan segera dikirimkan.
                        </p>
                        <div className="flex justify-center mt-6 relative z-10">
                            <button
                                onClick={() => navigate('/history')}
                                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-bold rounded-xl text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 shadow-lg shadow-red-200/50 hover:shadow-red-300/60 hover:-translate-y-1"
                            >
                                Lihat Riwayat Pesanan
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default BookingSuccessPage;