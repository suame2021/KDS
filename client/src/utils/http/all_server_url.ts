export class AllServerUrls{

    static backendUrl:string = "http://127.0.0.1:8000"




    // auth url
    static login: string = `${AllServerUrls.backendUrl}/auth/login`
    static getRefreshToken:string = `${AllServerUrls.backendUrl}/auth/refresh_token`
    static currentUser:string = `${AllServerUrls.backendUrl}/auth/current_user`
    static logout:string = `${AllServerUrls.backendUrl}/auth/logout`
   
    
// all url relating to classess
    static classUrls: string = `${AllServerUrls.backendUrl}/class`
    static getAllClassUlr:string = `${AllServerUrls.classUrls}/all_classess`


    // al student url
    static getStudentInfoUrl:string = `${AllServerUrls.backendUrl}/students/student_info`


    // all subject url
    static getAllSubjects:string = `${AllServerUrls.backendUrl}/subjects/get_all_subject`



    // all time url
    static getExamTime:string = `${AllServerUrls.backendUrl}/timer/get_exam_time`

}