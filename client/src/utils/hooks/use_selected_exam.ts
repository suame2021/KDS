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

// 🔑 Session storage keys
const SESSION_EXAM_KEY = "selectedExam";
const SESSION_TIMER_KEY = "selectedExamTimer";

type UseSelectedExam = {
  selectedExam: SubjectModel | null;
  timer: TimerModel | null;
  isLoading: boolean;
  setSelectedExam: (subject: SubjectModel) => void;
  getExamStats: () => Promise<void>;
  clear: () => void;
};

// ✅ Helper to restore SubjectModel class instance
function restoreSubjectModel(data: any): SubjectModel | null {
  if (!data) return null;
  return new SubjectModel(data.id, data.title, data.author, data.enable, data.classId);
}

export const useSelectedExam = create<UseSelectedExam>((set, get) => ({
  // ✅ Restore from session storage on load
  selectedExam: (() => {
    const stored = sessionStorage.getItem(SESSION_EXAM_KEY);
    if (!stored) return null;
    try {
      const parsed = JSON.parse(stored);
      return restoreSubjectModel(parsed);
    } catch {
      sessionStorage.removeItem(SESSION_EXAM_KEY);
      return null;
    }
  })(),

  timer: (() => {
    const stored = sessionStorage.getItem(SESSION_TIMER_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored) as TimerModel;
    } catch {
      sessionStorage.removeItem(SESSION_TIMER_KEY);
      return null;
    }
  })(),

  isLoading: false,


  setSelectedExam: (subject) => {
    sessionStorage.setItem(SESSION_EXAM_KEY, JSON.stringify(subject));
    set({ selectedExam: subject });
  },


  getExamStats: async () => {
    const { selectedExam } = get();
    const { isAuthenticated } = useIsAuthenticatedStore.getState();
    const { token } = useAuthTokenStore.getState();

    if (!selectedExam) {
      console.warn("No exam selected!");
      return;
    }
    if (!isAuthenticated) {
      console.warn("Student not authenticated!");
      return;
    }

    try {
      set({ isLoading: true });

      const newTimer = await requestTimer({
        token: token!,
        subjectId: selectedExam.id,
      });

      if (newTimer) {
        sessionStorage.setItem(SESSION_TIMER_KEY, JSON.stringify(newTimer));
        set({ timer: newTimer });
      } else {
        console.warn("No timer found for this exam.");
      }
    } catch (error) {
      console.error("Failed to fetch exam timer:", error);
    } finally {
      set({ isLoading: false });
    }
  },


  clear: () => {
    sessionStorage.removeItem(SESSION_EXAM_KEY);
    sessionStorage.removeItem(SESSION_TIMER_KEY);
    set({
      selectedExam: null,
      timer: null,
      isLoading: false,
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
