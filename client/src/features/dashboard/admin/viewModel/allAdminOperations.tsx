import type { UseFormSetError } from "react-hook-form"
import { AddNewClassModel } from "../model/add_class_model"
import type { ClassFormValues } from "../view/components/AddNewClassForm"
import { DefaultRequestSetUp } from "../../../../utils/http/default_request_set_up"
import { useAllClassStore } from "../../../../utils/hooks/use_all_class"
import { AllServerUrls } from "../../../../utils/http/all_server_url"
import { useAuthTokenStore } from "../../../../utils/hooks/use_auth_token_store"
import { useNotificationStore } from "../../../../utils/hooks/use_notification_store"
import { useClassCreationStore } from "../../../../utils/hooks/use_class_creation_store"
import type { AddNewSubjectForm } from "../view/pages/AddNewClass"
import { SubjectModel, SubjectModelWithOutId } from "../../../../common/model/classModels/subject_model"
import type { AddTimerFormValues } from "../view/components/AddTimerPopUp"
import { useIsAuthenticatedStore } from "../../../../utils/hooks/use_is_authenticated_store"

type addClassType<T extends ClassFormValues> = {
  data: T
  setError: UseFormSetError<T>
}


type addSubjectType<T extends AddNewSubjectForm> = {
  dt: T
  setError: UseFormSetError<T>
}

type addTimerType<T extends AddTimerFormValues>={
  dt:T
  setError: UseFormSetError<T>
}

export class AllAdminOperation {
  static async submitNewClassData({
    data,
    setError,
  }: addClassType<ClassFormValues>) {
    const fullTeacherName = `${data.title} ${data.teacherName}`.trim();
    const { token, getAcessToken } = useAuthTokenStore.getState()
    if (!token) await getAcessToken()

    const finalData = new AddNewClassModel({ className: data.className, teacherName: fullTeacherName })
    const res = await DefaultRequestSetUp.post<AddNewClassModel, void>({ url: AllServerUrls.addNewClass, data: finalData, token: token! })

    if (res.statusCode === 400) {
      setError("className", {
        message: res.message
      })

    } else {
      if (res.statusCode === 200) {
        await useAllClassStore.getState().getLatestUpdate()
        useNotificationStore.getState().showNotification(res.message, "success")
        useClassCreationStore.getState().setProgress(false)

      }
    }
  }

  static async deleteThisClass({ className }: { className: string }) {
    const { token, getAcessToken } = useAuthTokenStore.getState()
    if (!token) await getAcessToken()
    const res = await DefaultRequestSetUp.delete<void, void>({ url: `${AllServerUrls.deleteClass}?className=${className}`, token: token! })


    if (res.statusCode === 200) {
      await useAllClassStore.getState().getLatestUpdate()
    }
    useNotificationStore.getState().showNotification(res.message, res.statusCode === 400 ? "error" : "success")



  }


  static async addNewSubject({
    dt,
    setError,
  }: addSubjectType<SubjectModelWithOutId>) {
    const { token } = useAuthTokenStore.getState();
    const { showNotification } = useNotificationStore.getState();

    try {
      // Prepare new subject instance
      const newSub = new SubjectModelWithOutId(
        dt.title,
        dt.author,
        dt.enable,
        dt.classId
      );

      const res = await DefaultRequestSetUp.post<AddNewSubjectForm, void>({
        url: AllServerUrls.addNewSubject,
        token: token!,
        data: newSub,
      });

      // Handle notification based on status
      showNotification(res.message, res.statusCode === 200 ? "success" : "error");
      
      // Optionally return response data
      return res;
    } catch (err: any) {
      console.error("Error adding subject:", err);
      showNotification("Something went wrong", "error");
      setError("title", { message: "Failed to create subject" });
    }
  }

static async addTimer({ dt, setError }: addTimerType<AddTimerFormValues>) {
    const { isAuthenticated } = useIsAuthenticatedStore.getState();
    const { token } = useAuthTokenStore.getState();
    const { showNotification } = useNotificationStore.getState();

    if (!isAuthenticated || !token) {
      showNotification("You must be logged in to perform this action.", "error");
      return;
    }

    try {
      const payload = {
        hr: dt.hours,
        mins: dt.minutes,
        sec: dt.seconds,
        subjectId: dt.subjectId,
      };

      const res = await DefaultRequestSetUp.post<typeof payload, void>({
        url: AllServerUrls.setTimer,
        token,
        data: payload,
      });

      if (res.statusCode === 200) {
        showNotification(res.message || "Timer added successfully!", "success");
      } else {
        showNotification(res.message || "Failed to add timer", "error");
      }

      return res;
    } catch (err: any) {
      console.error("Error adding timer:", err);
      setError("hours", { message: "Failed to add timer" });
      showNotification("Something went wrong while adding timer", "error");
    }
  }
}
