
export default class MemoryStore {
    constructor() {
        this.actions = [];
    }
    closePullRequest(pullRequest) {
        this.actions.push(pullRequest);
    }
    listPullRequests() {
        return this.actions;
    }
}
