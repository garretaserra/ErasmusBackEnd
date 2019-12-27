class Profile {
    _id: string;
    email: string;
    name: string;
    followers: number;
    following: number;
    posts: number;
    events: number;

    constructor(_id, email, name, followers, following, posts, events) {
        this._id = _id;
        this.email = email;
        this.name = name;
        this.followers = followers;
        this.following = following;
        this.posts = posts;
        this.events = events;
    }
}
export default Profile;
