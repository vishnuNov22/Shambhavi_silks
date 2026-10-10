"use client";

import { useEffect, useState } from "react";

/**
 * Optional ambient sound — muted by default, only starts on an explicit click.
 * Generated live with the Web Audio API (a soft, slowly breathing tanpura-like
 * drone on Sa–Pa–Sa plus a whisper of air), so there is no audio file to load.
 */
type Engine = { ctx: AudioContext; master: GainNode; stop: () => void };

function createEngine(): Engine {
  const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const ctx = new Ctx();
  const master = ctx.createGain();
  master.gain.value = 0;
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 900;
  filter.Q.value = 0.4;
  filter.connect(master);
  master.connect(ctx.destination);

  const nodes: AudioScheduledSourceNode[] = [];
  // Sa (C3), Pa (G3), Sa (C4) with gentle detune for a shimmering drone
  [130.81, 196.0, 261.63, 130.81 * 1.003].forEach((f, i) => {
    const osc = ctx.createOscillator();
    osc.type = i === 2 ? "triangle" : "sine";
    osc.frequency.value = f;
    const g = ctx.createGain();
    g.gain.value = [0.22, 0.12, 0.06, 0.14][i];
    // slow breathing
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.05 + i * 0.023;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.06;
    lfo.connect(lfoGain).connect(g.gain);
    osc.connect(g).connect(filter);
    osc.start();
    lfo.start();
    nodes.push(osc, lfo);
  });
  // soft air (filtered noise)
  const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.5;
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  noise.loop = true;
  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 600;
  bp.Q.value = 0.7;
  const ng = ctx.createGain();
  ng.gain.value = 0.018;
  noise.connect(bp).connect(ng).connect(master);
  noise.start();
  nodes.push(noise);

  return {
    ctx,
    master,
    stop: () => {
      nodes.forEach((n) => { try { n.stop(); } catch { /* already stopped */ } });
      ctx.close();
    },
  };
}

// One engine for the whole page, shared by every toggle instance.
let shared: Engine | null = null;
let playing = false;
const EVT = "ssh-sound";

export default function SoundToggle({ className = "" }: { className?: string }) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    setOn(playing);
    const sync = () => setOn(playing);
    window.addEventListener(EVT, sync);
    return () => window.removeEventListener(EVT, sync);
  }, []);

  const toggle = async () => {
    try {
      if (!shared) shared = createEngine();
      const { ctx, master } = shared;
      const now = ctx.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(master.gain.value, now);
      if (!playing) {
        await ctx.resume();
        master.gain.linearRampToValueAtTime(0.09, now + 2.5);
        playing = true;
      } else {
        master.gain.linearRampToValueAtTime(0, now + 0.8);
        playing = false;
        window.setTimeout(() => { if (shared && !playing) shared.ctx.suspend(); }, 900);
      }
      window.dispatchEvent(new Event(EVT));
    } catch {
      /* Web Audio unavailable — stay silent */
    }
  };

  return (
    <button
      type="button"
      className={`sound ${on ? "is-on" : ""} ${className}`}
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? "Turn ambient sound off" : "Turn ambient sound on"}
      data-cursor="hover"
    >
      <span className="sound__bars" aria-hidden="true"><i /><i /><i /><i /></span>
      <span className="sound__label">{on ? "Sound on" : "Sound off"}</span>
    </button>
  );
}
