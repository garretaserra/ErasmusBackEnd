class AuthUser {
    _id: string;
    email: string;
    name: string;
    activity: Array<any> | undefined;

    constructor(_id, email, name, activity) {
        this._id = _id;
        this.email = email;
        this.name = name;
        this.activity = activity;
    }
}
export default AuthUser;
