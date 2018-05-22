export interface teacherInfo {
    account?: string
    email?: string
    idCode: string
    idType: number
    phone?: string
    photo?: string
    schoolId: number
    schoolName: string
    sid: string
    teacherName: string
    tid: number
    token: string
    userId: number
    userType: number
}

export interface searchTeacherInfo {
    uid: number
    tid: number
    teacherName: string
    phone?: string
    email?: string
    account?: string
    photo?: string
    idType: number
    isUse: number
    subPermission?: number
    complexPermission?: number
}