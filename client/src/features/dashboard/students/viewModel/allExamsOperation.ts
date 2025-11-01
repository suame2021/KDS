import { AppUrl } from "../../../../common/routes/app_urls";
import { useNavigationStore } from "../../../../utils/hooks/use_navigation_store";
import { useSelectedExam } from "../../../../utils/hooks/use_selected_exam";

export class AllExamOperations {
  static startExam() {
    const navigate = useNavigationStore.getState().navigate;
    const { startTimer } = useSelectedExam.getState();

  
    navigate(AppUrl.startExam);

  
    setTimeout(() => {
      startTimer();
    }, 300); 
  }
}
