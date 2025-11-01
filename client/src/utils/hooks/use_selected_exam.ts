import { create } from "zustand";
import { SubjectModel } from "../../common/model/classModels/subject_model";
import type { TimerModel } from "../../common/model/classModels/timer_model";
import { useIsAuthenticatedStore } from "./use_is_authenticated_store";
import { useAuthTokenStore } from "./use_auth_token_store";
import { DefaultRequestSetUp } from "../http/default_request_set_up";
import { useNotificationStore } from "./use_notification_store";
import { AllServerUrls } from "../http/all_server_url";
import { AppUrl } from "../../common/routes/app_urls";
import { useNavigationStore } from "./use_navigation_store";

type UseSelectedExam = {
  selectedExam: SubjectModel | null;
  timer: TimerModel | null;
  isLoading: boolean;
  remainingTime: number;
  isTimerRunning: boolean;
  setSelectedExam: (subject: SubjectModel) => void;
  getExamStats: () => Promise<void>;
  startTimer: (onTimeUp?: () => void) => void;
  stopTimer: () => void;
  clear: () => void;
};

const SESSION_KEY = "selectedExam";
const TIMER_KEY = "remainingTime";
const TIMER_OBJECT_KEY = "timerObject";
const LAST_UPDATE_KEY = "lastUpdateTime";
const RUNNING_KEY = "isTimerRunning";

let timerInterval: ReturnType<typeof setInterval> | null = null;

export const useSelectedExam = create<UseSelectedExam>((set, get) => ({
  selectedExam: (() => {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }
  })(),

  timer: (() => {
    const stored = sessionStorage.getItem(TIMER_OBJECT_KEY);
    return stored ? JSON.parse(stored) : null;
  })(),

  isLoading: false,

  remainingTime: (() => {
    const storedTime = Number(sessionStorage.getItem(TIMER_KEY)) || 0;
    const lastUpdate = Number(sessionStorage.getItem(LAST_UPDATE_KEY)) || 0;
    if (storedTime && lastUpdate) {
      const diff = Math.floor((Date.now() - lastUpdate) / 1000);
      return Math.max(storedTime - diff, 0);
    }
    return storedTime;
  })(),

  isTimerRunning: sessionStorage.getItem(RUNNING_KEY) === "true",

  setSelectedExam: (subject) => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(subject));
    set({ selectedExam: subject });
  },

  getExamStats: async () => {
    const { selectedExam } = get();
    const { isAuthenticated } = useIsAuthenticatedStore.getState();
    const { token } = useAuthTokenStore.getState();

    if (!selectedExam) return console.warn("No exam selected!");
    if (!isAuthenticated) return console.warn("Student not authenticated!");

    try {
      set({ isLoading: true });

      const newTimer = await requestTimer({
        token: token!,
        subjectId: selectedExam.id,
      });

      if (newTimer) {
        sessionStorage.setItem(TIMER_OBJECT_KEY, JSON.stringify(newTimer));

        const totalSeconds = newTimer.hr * 3600 + newTimer.mins * 60 + newTimer.sec;
        sessionStorage.setItem(TIMER_KEY, totalSeconds.toString());
        sessionStorage.setItem(LAST_UPDATE_KEY, Date.now().toString());

        set({ timer: newTimer, remainingTime: totalSeconds });
      }
    } catch (error) {
      console.error("Failed to fetch exam timer:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  startTimer: (onTimeUp) => {
    if (timerInterval) clearInterval(timerInterval);

    // ✅ Mark timer as running (persistent)
    sessionStorage.setItem(RUNNING_KEY, "true");
    set({ isTimerRunning: true });

    timerInterval = setInterval(() => {
      const { remainingTime } = get();
      if (remainingTime <= 1) {
        clearInterval(timerInterval!);
        timerInterval = null;

        sessionStorage.removeItem(TIMER_KEY);
        sessionStorage.removeItem(LAST_UPDATE_KEY);
        sessionStorage.removeItem(RUNNING_KEY);

        set({ remainingTime: 0, isTimerRunning: false });

        if (onTimeUp) onTimeUp();
        return;
      }

      const newTime = remainingTime - 1;
      sessionStorage.setItem(TIMER_KEY, newTime.toString());
      sessionStorage.setItem(LAST_UPDATE_KEY, Date.now().toString());
      set({ remainingTime: newTime });
    }, 1000);
  },

  stopTimer: () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }

    sessionStorage.removeItem(RUNNING_KEY);
    set({ isTimerRunning: false });
  },

  clear: () => {
    if (timerInterval) clearInterval(timerInterval);
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(TIMER_KEY);
    sessionStorage.removeItem(LAST_UPDATE_KEY);
    sessionStorage.removeItem(TIMER_OBJECT_KEY);
    sessionStorage.removeItem(RUNNING_KEY);

    set({
      selectedExam: null,
      timer: null,
      isLoading: false,
      remainingTime: 0,
      isTimerRunning: false,
    });
  },
}));

async function requestTimer({
  token,
  subjectId,
}: {
  token: string;
  subjectId: string;
}) {
  const { showNotification } = useNotificationStore.getState();
  const { navigate } = useNavigationStore.getState();

  const url = `${AllServerUrls.getExamTime}?subject_id=${subjectId}`;
  const res = await DefaultRequestSetUp.get<TimerModel>({ url, token });

  if (res.statusCode === 404) {
    showNotification("No timer set for this exam", "info");
    return null;
  }

  if (res.statusCode === 500) {
    showNotification(res.message || "Server error", "error");
    return null;
  }

  navigate(AppUrl.examPreparation);
  return res.data;
}
