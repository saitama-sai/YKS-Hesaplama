'use client';
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { Timer, Clock, Play, Pause, RotateCcw, Coffee } from 'lucide-react';

export default function PomodoroPage() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  // Pomodoro States
  const WORK_TIME = 25 * 60; // 25 dakika
  const BREAK_TIME = 5 * 60; // 5 dakika
  const [pomoTime, setPomoTime] = useState(WORK_TIME);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  
  const timerRef = useRef(null);

  // YKS Geri Sayım
  useEffect(() => {
    const targetDate = new Date('2027-06-19T10:15:00').getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Pomodoro Mantığı
  useEffect(() => {
    if (isActive && pomoTime > 0) {
      timerRef.current = setInterval(() => {
        setPomoTime((prev) => prev - 1);
      }, 1000);
    } else if (pomoTime === 0) {
      // Süre bitti
      clearInterval(timerRef.current);
      if (!isBreak) {
        setSessionCount(prev => prev + 1);
      }
      setIsBreak(!isBreak);
      setPomoTime(!isBreak ? BREAK_TIME : WORK_TIME);
      setIsActive(false);
      
      // Sesli uyarı
      try {
        const audio = new Audio('/alarm.mp3'); // İsteğe bağlı
        audio.play();
      } catch (e) {}
    }

    return () => clearInterval(timerRef.current);
  }, [isActive, pomoTime, isBreak]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setIsBreak(false);
    setPomoTime(WORK_TIME);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <main className="container" style={{ maxWidth: '1000px', padding: '40px 20px', minHeight: '100vh' }}>
      <Head>
        <title>YKS Geri Sayım ve Pomodoro Sayacı | YKS Rehberim</title>
        <meta name="description" content="2027 YKS sayacı ile kalan süreyi takip edin. Pomodoro tekniği ile odaklanarak ders çalışın." />
      </Head>

      {/* YKS Geri Sayım */}
      <div className="glass-panel" style={{ textAlign: 'center', marginBottom: '40px', padding: '40px 20px', background: 'linear-gradient(145deg, rgba(99, 102, 241, 0.1) 0%, rgba(30, 30, 45, 0.6) 100%)' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', color: 'var(--primary)', marginBottom: '30px' }}>
          <Clock size={32} />
          2027 YKS'ye Kalan Süre
        </h1>
        
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div className="countdown-box">
            <span className="number">{timeLeft.days}</span>
            <span className="label">Gün</span>
          </div>
          <div className="countdown-box">
            <span className="number">{timeLeft.hours}</span>
            <span className="label">Saat</span>
          </div>
          <div className="countdown-box">
            <span className="number">{timeLeft.minutes}</span>
            <span className="label">Dakika</span>
          </div>
          <div className="countdown-box">
            <span className="number">{timeLeft.seconds}</span>
            <span className="label">Saniye</span>
          </div>
        </div>
      </div>

      {/* Pomodoro Timer */}
      <div className="glass-panel" style={{ textAlign: 'center', padding: '50px 20px' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginBottom: '10px' }}>
          {isBreak ? <Coffee size={28} color="var(--success)" /> : <Timer size={28} color="var(--primary)" />}
          {isBreak ? 'Mola Zamanı' : 'Odaklanma Zamanı'}
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>
          Tamamlanan Pomodoro: <strong style={{ color: 'var(--text-main)' }}>{sessionCount}</strong>
        </p>

        <div style={{ 
          fontSize: '6rem', 
          fontWeight: 'bold', 
          fontVariantNumeric: 'tabular-nums',
          color: isBreak ? 'var(--success)' : 'var(--text-main)',
          marginBottom: '40px',
          textShadow: '0 0 20px rgba(255,255,255,0.1)'
        }}>
          {formatTime(pomoTime)}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
          <button 
            onClick={toggleTimer} 
            className="btn-primary" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px', 
              padding: '15px 30px', 
              fontSize: '1.1rem',
              background: isActive ? 'var(--warning)' : 'var(--primary)'
            }}
          >
            {isActive ? <Pause size={24} /> : <Play size={24} />}
            {isActive ? 'Duraklat' : 'Başlat'}
          </button>
          
          <button 
            onClick={resetTimer} 
            className="btn-primary" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px', 
              padding: '15px 20px', 
              background: 'rgba(255,255,255,0.1)',
              color: 'var(--text-main)'
            }}
            title="Sıfırla"
          >
            <RotateCcw size={24} />
          </button>
        </div>
      </div>

      <style>{`
        .countdown-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: rgba(0,0,0,0.2);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 16px;
          min-width: 120px;
          padding: 20px;
          box-shadow: inset 0 0 20px rgba(0,0,0,0.5);
        }
        .countdown-box .number {
          font-size: 3rem;
          font-weight: 700;
          color: #fff;
          line-height: 1;
          margin-bottom: 5px;
        }
        .countdown-box .label {
          font-size: 0.9rem;
          color: var(--primary-light);
          text-transform: uppercase;
          letter-spacing: 2px;
        }
        @media (max-width: 600px) {
          .countdown-box {
            min-width: 80px;
            padding: 10px;
          }
          .countdown-box .number {
            font-size: 2rem;
          }
          .countdown-box .label {
            font-size: 0.7rem;
          }
        }
      `}</style>
    </main>
  );
}
