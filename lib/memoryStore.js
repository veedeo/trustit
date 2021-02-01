
export default class MemoryStore {
    constructor() {
        this.actions = [
            {"title": "added Git hook API","source":"github","action":"closed","externalId":565202807,"merged_at":"2021-02-01T13:58:30Z","merged_by":"alexs-sb","html_url":"https://github.com/veedeo/trustit/pull/4"}
        ];
    }
    closePullRequest(pullRequest) {
        this.actions.push(pullRequest);
    }
    getPullRequests() {
        return this.actions;
    }
}