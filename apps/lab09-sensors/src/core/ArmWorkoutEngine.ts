import type { AccelSample, WorkoutState } from "./types";
import { MotionService } from "./MotionService";
import { TtsService } from "./TtsService";
import { HapticsService } from "./HapticsService";

export class ArmWorkoutEngine {
  private motion = new MotionService();
  private tts = new TtsService();
  private haptics = new HapticsService();

  private state: WorkoutState = {
    status: "IDLE",
    repDisplay: 0,
    stats: {
      repsTotal: 0,
      repsOk: 0,
      repsBad: 0,
      score: 0,
      avgRepMs: 0,
      lastMessage: "",
    },
  };

  private lastPeak = 0;
  private lastRepTime = 0;

  constructor(private onUpdate: (s: WorkoutState) => void) {}

  async start() {
    this.state.status = "RUNNING";
    this.onUpdate(this.state);

    await this.motion.start((sample) => this.process(sample));
  }

  async stop() {
    await this.motion.stop();
    this.state.status = "STOPPED";
    this.onUpdate(this.state);
  }

  private async process(s: AccelSample) {
    const magnitude = Math.sqrt(s.ax * s.ax + s.ay * s.ay + s.az * s.az);

    // ตรวจจับ "ยกขึ้น"
    if (magnitude > 13 && Date.now() - this.lastPeak > 600) {
      const now = Date.now();
      const repTime = now - this.lastRepTime;
      this.lastPeak = now;
      this.lastRepTime = now;

      this.state.stats.repsTotal++;
      this.state.repDisplay = this.state.stats.repsTotal;

      if (repTime > 800 && repTime < 2500) {
        // ถือว่าทำถูก
        this.state.stats.repsOk++;
        this.state.stats.lastMessage = "ดีมาก";
        await this.tts.speak("ดีมาก");
        await this.haptics.success();
      } else {
        // เร็วหรือช้าเกิน
        this.state.stats.repsBad++;
        this.state.stats.lastMessage = "ช้าไป หรือ เร็วไป";
        await this.tts.speak("ควบคุมจังหวะ");
        await this.haptics.warning();
      }

      this.state.stats.score =
        (this.state.stats.repsOk / this.state.stats.repsTotal) * 100;

      this.state.stats.avgRepMs =
        (this.state.stats.avgRepMs + repTime) / 2;

      this.onUpdate(this.state);
    }
  }
}