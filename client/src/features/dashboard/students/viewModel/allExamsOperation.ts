import { AppUrl } from "../../../../common/routes/app_urls";
import { useNavigationStore } from "../../../../utils/hooks/use_navigation_store";
import { useNotificationStore } from "../../../../utils/hooks/use_notification_store";
import { useSelectedExam } from "../../../../utils/hooks/use_selected_exam";

export class AllExamOperations {
  static startExam() {
    const navigate = useNavigationStore.getState().navigate;
    const { startTimer, allAvaliableQuestions } = useSelectedExam.getState();

    if (allAvaliableQuestions === null) {
      useNotificationStore.getState().showNotification("no question found refresh your browser", "info")
    } else {
      navigate(AppUrl.startExam);
    }
    setTimeout(() => {
      startTimer();
    }, 300);
  }
}
