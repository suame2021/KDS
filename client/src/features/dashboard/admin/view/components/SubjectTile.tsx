import type { SubjectModel } from "../../../../../common/model/classModels/subject_model";


export default function SubjectTile({sub}: {sub: SubjectModel}) {

    return <>
        <div className="card p-3 mb-3 shadow-sm border-0 d-flex flex-row justify-content-between align-items-center">
            {/* Left side: class info */}
            <div className="d-flex flex-column">
                <span className="fw-semibold text-dark fs-5 text-uppercase">
                    {sub.title}
                </span>
                <small className="text-muted text-uppercase">teacher: <b>{sub.author}</b></small>
            </div>

            {/* Right side: buttons */}
            <div className="d-flex gap-2">
                <button
                    className="btn btn-outline-primary btn-sm px-3 py-1"
                    onClick={() => { }}
                >
                    View Sub
                </button>
                <button
                    className="btn btn-outline-danger btn-sm px-3 py-1"
                    onClick={() => { }}
                >
                    Delete
                </button>
            </div>
        </div>
    </>
}